import { isNil, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { InvalidOperationError } from "@oliversalzburg/js-utils/errors/InvalidOperationError.js";
import type { BonfireManager } from "./BonfireManager.js";
import type { Automation, FrameContext } from "./Engine.js";
import { BulkPurchaseHelper } from "./helper/BulkPurchaseHelper.js";
import type { KittenScientists } from "./KittenScientists.js";
import { BonfireBuildingSetting } from "./settings/BonfireSettings.js";
import { ReligionSettings, type ReligionSettingsItem } from "./settings/ReligionSettings.js";
import { negativeOneToInfinity } from "./tools/Format.js";
import { cl } from "./tools/Log.js";
import {
  type FaithItem,
  type ReligionItem,
  type ReligionUpgrade,
  type TranscendenceUpgrade,
  type UnicornItem,
  UnicornItems,
  UnicornItemVariant,
  type ZigguratUpgrade,
} from "./types/index.js";
import type {
  ReligionBtnController,
  TranscendenceBtnController,
  TransformBtnController,
  UnsafeReligionUpgrade,
  UnsafeTranscendenceBtnModel,
  UnsafeTranscendenceButtonOptions,
  UnsafeTranscendenceUpgrade,
  UnsafeTransformBtnModel,
  UnsafeZigguratUpgrade,
  ZigguratBtnController,
} from "./types/religion.js";
import type { WorkshopManager } from "./WorkshopManager.js";

export class ReligionManager implements Automation {
  private readonly _host: KittenScientists;
  readonly settings: ReligionSettings;
  private readonly _bulkManager: BulkPurchaseHelper;
  private readonly _bonfireManager: BonfireManager;
  private readonly _workshopManager: WorkshopManager;

  constructor(
    host: KittenScientists,
    bonfireManager: BonfireManager,
    workshopManager: WorkshopManager,
    settings = new ReligionSettings(),
  ) {
    this._host = host;
    this.settings = settings;
    this._workshopManager = workshopManager;
    this._bulkManager = new BulkPurchaseHelper(this._host, this._workshopManager);
    this._bonfireManager = bonfireManager;
  }

  async tick(context: FrameContext) {
    if (!this.settings.enabled) {
      return;
    }

    this._autoBuild(context);

    if (this.settings.sacrificeUnicorns.enabled) {
      await this._autoSacrificeUnicorns();
    }

    if (this.settings.sacrificeAlicorns.enabled) {
      await this._autoSacrificeAlicorns(context);
    }

    if (this.settings.refineTears.enabled) {
      this._autoTears(context);
    }

    if (this.settings.refineTimeCrystals.enabled) {
      await this._autoTCs(context);
    }

    this._autoTAP();
  }

  private _autoBuild(context: FrameContext) {
    if (this.settings.bestUnicornBuilding.enabled) {
      this._buildBestUnicornBuilding();
      this._buildNonUnicornBuildings(context);
    } else {
      // Create the list of builds, excluding the unicorn pasture.
      // The unicorn pasture requires a special build path, because it's really
      // a bonfire building.
      const builds = Object.fromEntries(
        Object.entries(this.settings.buildings).filter(
          ([, building]) => building.variant !== UnicornItemVariant.UnicornPasture,
        ),
      );
      // Build a unicorn pasture if possible.
      const maxPastures = negativeOneToInfinity(this.settings.buildings.unicornPasture.max);
      const meta = this._host.game.bld.getBuildingExt("unicornPasture").meta;
      if (this.settings.buildings.unicornPasture.enabled && meta.val < maxPastures) {
        this._bonfireManager.autoBuild(context, {
          unicornPasture: new BonfireBuildingSetting(
            "unicornPasture",
            this.settings.buildings.unicornPasture.enabled,
            this.settings.buildings.unicornPasture.trigger,
            this.settings.buildings.unicornPasture.max,
          ),
        });
      }
      // And then we build all other possible religion buildings.
      this._buildReligionBuildings(context, builds);
    }
  }

  private _buildBestUnicornBuilding() {
    const bestUnicornBuilding = this.getBestUnicornBuilding();
    if (this.settings.bestUnicornBuildingCurrent !== bestUnicornBuilding) {
      this.settings.bestUnicornBuildingCurrent = bestUnicornBuilding;
      this._host.refreshEntireUserInterface();
    }

    if (this.settings.bestUnicornBuildingCurrent === null) {
      return;
    }

    const sectionTrigger = this.settings.trigger;

    if (this.settings.bestUnicornBuildingCurrent === "unicornPasture") {
      this._bonfireManager.build(this.settings.bestUnicornBuildingCurrent, 0, 1);
    } else {
      const buildingButton = this._getBuild(
        this.settings.bestUnicornBuildingCurrent,
        UnicornItemVariant.Ziggurat,
      );
      if (isNil(buildingButton?.model)) {
        return;
      }

      let tearsNeeded = 0;
      const priceTears = mustExist(buildingButton.model.prices).find(
        subject => subject.name === "tears",
      );
      if (!isNil(priceTears)) {
        tearsNeeded = priceTears.val;
      }

      const tearsAvailableForUse =
        this._workshopManager.getValue("tears") - this._workshopManager.getStock("tears");

      if (!isNil(this._host.game.religionTab.sacrificeBtn) && tearsAvailableForUse < tearsNeeded) {
        // if no ziggurat, getBestUnicornBuilding will return unicornPasture
        // TODO: ☝ Yeah. So?

        // How many times can we sacrifice unicorns to make tears?
        const maxSacrifice = Math.floor(
          (this._workshopManager.getValue("unicorns") -
            this._workshopManager.getStock("unicorns")) /
            2500,
        );

        // How many sacrifices would we need, so we'd end up with enough tears.
        const needSacrifice = Math.ceil(
          (tearsNeeded - tearsAvailableForUse) /
            this._host.game.bld.getBuildingExt("ziggurat").meta.on,
        );

        // Sacrifice some unicorns to get the tears to buy the building.
        const zigguratCount = this._host.game.bld.get("ziggurat").on;
        if (needSacrifice < maxSacrifice && 0 < zigguratCount) {
          const controller = new classes.ui.religion.TransformBtnController(this._host.game, {
            applyAtGain: (priceCount: number) => {
              this._host.game.stats.getStat("unicornsSacrificed").val += priceCount;
            },
            gainedResource: "tears",
            gainMultiplier: () => {
              return this._host.game.bld.get("ziggurat").on;
            },
            logfilterID: "unicornSacrifice",
            logTextID: "religion.sacrificeBtn.sacrifice.msg",
            overcapMsgID: "religion.sacrificeBtn.sacrifice.msg.overcap",
          }) as TransformBtnController;
          const model = controller.fetchModel({
            controller,
            description: "",
            name: "",
            prices: [{ name: "unicorns", val: 2500 }],
          });
          controller._transform(model, needSacrifice);

          // iactivity?
          // TODO: ☝ Yeah, seems like a good idea.
        } else {
          // Not enough unicorns to sacrifice to make enough tears.
          return;
        }
      }

      // Let the BulkManager figure out if the build can be made.
      const buildRequest = {
        [this.settings.bestUnicornBuildingCurrent]:
          this.settings.buildings[this.settings.bestUnicornBuildingCurrent],
      };
      const build = this._bulkManager.bulk(
        buildRequest,
        this.getBuildMetaData(buildRequest),
        sectionTrigger,
        "Religion",
      );
      if (0 < build.length && 0 < build[0].count) {
        // We force only building 1 of the best unicorn building, because
        // afterwards the best unicorn building is likely going to change.
        this.build(this.settings.bestUnicornBuildingCurrent, UnicornItemVariant.Ziggurat, 1);
      }
    }
  }
  private _buildNonUnicornBuildings(context: FrameContext) {
    const alreadyHandled: Array<FaithItem | UnicornItem> = [...UnicornItems];
    const builds = Object.fromEntries(
      Object.entries(this.settings.buildings).filter(
        ([, building]) => !alreadyHandled.includes(building.building),
      ),
    );
    this._buildReligionBuildings(context, builds);
  }

  private _buildReligionBuildings(
    context: FrameContext,
    builds: Partial<Record<FaithItem, ReligionSettingsItem>>,
  ): void {
    const metaData: Partial<
      Record<
        FaithItem,
        Required<UnsafeReligionUpgrade | UnsafeTranscendenceUpgrade | UnsafeZigguratUpgrade>
      >
    > = this.getBuildMetaData(builds);
    const sectionTrigger = this.settings.trigger;

    // Let the bulk manager figure out which of the builds to actually build.
    const buildList = this._bulkManager.bulk(builds, metaData, sectionTrigger, "Religion");

    for (const build of buildList) {
      if (0 < build.count) {
        this.build(
          build.id as ReligionItem | "unicornPasture",
          mustExist(build.variant) as UnicornItemVariant,
          build.count,
        );
        context.requestGameUiRefresh = true;
      }
    }
  }

  /**
   * Determine the best unicorn-related building to buy next.
   * This is the building where the cost is in the best proportion to the
   * unicorn production bonus it generates.
   *
   * @see https://github.com/Bioniclegenius/NummonCalc/blob/112f716e2fde9956dfe520021b0400cba7b7113e/NummonCalc.js#L490
   * @returns The best unicorn building.
   */
  getBestUnicornBuilding(): ZigguratUpgrade | "unicornPasture" | null {
    const pastureButton = this._bonfireManager.getBuild("unicornPasture");
    if (pastureButton === null) {
      return null;
    }

    const validBuildings: Array<ZigguratUpgrade> = [...UnicornItems].filter(
      item => item !== "unicornPasture",
    );

    // How many unicorns are produced per second.
    const unicornsPerSecondBase =
      this._host.game.getEffect("unicornsPerTickBase") * this._host.game.getTicksPerSecondUI();
    // Unicorn ratio modifier. For example, through "unicorn selection".
    const globalRatio = this._host.game.getEffect("unicornsGlobalRatio") + 1;
    // The unicorn ratio modifier through religion buildings.
    const religionRatio = this._host.game.getEffect("unicornsRatioReligion") + 1;
    // The ratio modifier through paragon.
    const paragonRatio = this._host.game.prestige.getParagonProductionRatio() + 1;
    // Bonus from collected faith.
    const faithBonus = this._host.game.religion.getSolarRevolutionRatio() + 1;

    const currentCycleIndex = this._host.game.calendar.cycle;
    const currentCycle = this._host.game.calendar.cycles[currentCycleIndex];

    // The modifier applied by the current cycle and holding a festival.
    let cycleBonus = 1;
    // If the current cycle has an effect on unicorn production during festivals
    // TODO: Simplify
    if (currentCycle.festivalEffects.unicorns !== undefined) {
      // Numeromancy is the metaphysics upgrade that grants bonuses based on cycles.
      if (
        this._host.game.prestige.getPerk("numeromancy").researched &&
        this._host.game.calendar.festivalDays
      ) {
        cycleBonus = currentCycle.festivalEffects.unicorns;
      }
    }

    const unicornsPerSecond =
      unicornsPerSecondBase * globalRatio * religionRatio * paragonRatio * faithBonus * cycleBonus;

    // Based on how many ziggurats we have.
    const zigguratRatio = Math.max(this._host.game.bld.getBuildingExt("ziggurat").meta.on, 1);
    // How many unicorns do we receive in a unicorn rift?
    const baseUnicornsPerRift =
      500 * (1 + this._host.game.getEffect("unicornsRatioReligion") * 0.1);

    // How likely are unicorn rifts to happen? The unicornmancy metaphysics upgrade increases this chance.
    let riftChanceRatio = 1;
    if (this._host.game.prestige.getPerk("unicornmancy").researched) {
      riftChanceRatio *= 1.1;
    }
    // ?
    const unicornRiftChange =
      ((this._host.game.getEffect("riftChance") * riftChanceRatio) / (10000 * 2)) *
      baseUnicornsPerRift;

    // We now want to determine how quickly the cost of given building is neutralized
    // by its effect on production of unicorns.

    let bestAmortization = Number.POSITIVE_INFINITY;
    let bestBuilding: ZigguratUpgrade | "unicornPasture" | null = null;
    const unicornsPerTickBase = mustExist(
      this._host.game.bld.getBuildingExt("unicornPasture").meta.effects?.unicornsPerTickBase,
    );
    const pastureProduction =
      unicornsPerTickBase *
      this._host.game.getTicksPerSecondUI() *
      globalRatio *
      religionRatio *
      paragonRatio *
      faithBonus *
      cycleBonus;

    // If the unicorn pasture amortizes itself in less than infinity ticks,
    // set it as the default. This is likely to protect against cases where
    // production of unicorns is 0.
    const pastureAmortization = mustExist(pastureButton.model?.prices)[0].val / pastureProduction;
    if (pastureAmortization < bestAmortization) {
      bestAmortization = pastureAmortization;
      bestBuilding = "unicornPasture";
    }

    for (const building of validBuildings) {
      const button = this._getBuild(building, UnicornItemVariant.Ziggurat);

      // Determine a price value for this building.
      let unicornPrice = 0;
      for (const price of mustExist(button.model.prices)) {
        // Add the amount of unicorns the building costs (if any).
        if (price.name === "unicorns") {
          unicornPrice += price.val;
        }
        // Tears result from unicorn sacrifices, so factor that into the price proportionally.
        if (price.name === "tears") {
          unicornPrice += (price.val * 2500) / zigguratRatio;
        }
      }

      // Determine the effect the building will have on unicorn production and unicorn rifts.
      const buildingInfo = mustExist(this._host.game.religion.getZU(building));
      let religionBonus = religionRatio;
      let riftChance = this._host.game.getEffect("riftChance");
      for (const effect in buildingInfo.effects) {
        if (effect === "unicornsRatioReligion") {
          religionBonus += mustExist(buildingInfo.effects.unicornsRatioReligion);
        }
        if (effect === "riftChance") {
          riftChance += mustExist(buildingInfo.effects.riftChance);
        }
      }

      // The rest should be straight forward.
      const unicornsPerRift = 500 * ((religionBonus - 1) * 0.1 + 1);
      let riftBonus = ((riftChance * riftChanceRatio) / (10000 * 2)) * unicornsPerRift;
      riftBonus -= unicornRiftChange;
      let buildingProduction =
        unicornsPerSecondBase *
        globalRatio *
        religionBonus *
        paragonRatio *
        faithBonus *
        cycleBonus;
      buildingProduction -= unicornsPerSecond;
      buildingProduction += riftBonus;
      const amortization = unicornPrice / buildingProduction;

      if (amortization < bestAmortization) {
        if (0 < riftBonus || (religionRatio < religionBonus && 0 < unicornPrice)) {
          bestAmortization = amortization;
          bestBuilding = building;
        }
      }
    }

    return bestBuilding;
  }

  build(name: ReligionItem | "unicornPasture", variant: UnicornItemVariant, amount: number): void {
    let amountCalculated = amount;
    const amountTemp = amountCalculated;
    let label: string;
    if (variant === UnicornItemVariant.Cryptotheology) {
      const itemMetaRaw = game.getUnlockByName(name, "transcendenceUpgrades");
      const controller = new classes.ui.TranscendenceBtnController(
        this._host.game,
      ) as TranscendenceBtnController<
        UnsafeTranscendenceBtnModel<UnsafeTranscendenceButtonOptions>
      >;
      const model = controller.fetchModel({ controller, id: itemMetaRaw.name });
      amountCalculated = this._bulkManager.construct(model, controller, amountCalculated);
      label = itemMetaRaw.label;
    } else if (variant === UnicornItemVariant.OrderOfTheSun) {
      const itemMetaRaw = game.getUnlockByName(name, "religion");
      const controller = new com.nuclearunicorn.game.ui.ReligionBtnController(
        this._host.game,
      ) as ReligionBtnController;
      const model = controller.fetchModel({ controller, id: itemMetaRaw.name });
      amountCalculated = this._bulkManager.construct(model, controller, amountCalculated);
      label = itemMetaRaw.label;
    } else if (variant === UnicornItemVariant.Ziggurat) {
      const itemMetaRaw = game.getUnlockByName(name, "zigguratUpgrades");
      const controller = new com.nuclearunicorn.game.ui.ZigguratBtnController(
        this._host.game,
      ) as ZigguratBtnController;
      const model = controller.fetchModel({ controller, id: itemMetaRaw.name });
      amountCalculated = this._bulkManager.construct(model, controller, amountCalculated);
      label = itemMetaRaw.label;
    } else {
      throw new InvalidOperationError("unsupported");
    }

    if (amountCalculated !== amountTemp) {
      console.warn(
        ...cl(`${label} Amount ordered: ${amountTemp} Amount Constructed: ${amountCalculated}`),
      );
      // Bail out to not flood the log with garbage.
      if (amountCalculated === 0) {
        return;
      }
    }

    if (variant === UnicornItemVariant.OrderOfTheSun) {
      this._host.engine.storeForSummary(label, amountCalculated, "faith");
      if (amountCalculated === 1) {
        this._host.engine.iactivity("act.sun.discover", [label], "ks-faith");
      } else {
        this._host.engine.iactivity(
          "act.sun.discovers",
          [label, this._host.renderAbsolute(amountCalculated)],
          "ks-faith",
        );
      }
    } else {
      this._host.engine.storeForSummary(label, amountCalculated, "build");
      if (amountCalculated === 1) {
        this._host.engine.iactivity("act.build", [label], "ks-build");
      } else {
        this._host.engine.iactivity(
          "act.builds",
          [label, this._host.renderAbsolute(amountCalculated)],
          "ks-build",
        );
      }
    }
  }

  getBuildMetaData(builds: Partial<Record<FaithItem, ReligionSettingsItem>>) {
    const metaData: Partial<
      Record<
        FaithItem,
        Required<UnsafeReligionUpgrade | UnsafeTranscendenceUpgrade | UnsafeZigguratUpgrade>
      >
    > = {};
    for (const build of Object.values(builds)) {
      const buildInfo = this.getUpgradeMeta(build.building, build.variant);
      if (buildInfo === null) {
        continue;
      }
      metaData[build.building as FaithItem] = buildInfo;
      const buildMetaData = mustExist(metaData[build.building as FaithItem]);

      // If an item is marked as `rHidden`, it wouldn't be build.
      // TODO: Why not remove it from the `builds` then?
      if (!this._getBuild(build.building, build.variant)) {
        buildMetaData.rHidden = true;
      } else {
        const model = mustExist(this._getBuild(build.building, build.variant)).model;
        const panel =
          build.variant === UnicornItemVariant.Cryptotheology
            ? this._host.game.science.get("cryptotheology").researched
            : true;
        buildMetaData.rHidden = !(model?.visible && model.enabled && panel);
      }
    }

    return metaData;
  }

  /**
   * Retrieve information about an upgrade.
   *
   * @param name The name of the upgrade.
   * @param variant The variant of the upgrade.
   * @returns The build information for the upgrade.
   */
  getUpgradeMeta(name: ReligionItem | "unicornPasture", variant: UnicornItemVariant) {
    switch (variant) {
      case UnicornItemVariant.Ziggurat:
        return this._host.game.religion.getZU(name as ZigguratUpgrade) ?? null;
      case UnicornItemVariant.OrderOfTheSun:
        return this._host.game.religion.getRU(name as ReligionUpgrade) ?? null;
      case UnicornItemVariant.Cryptotheology:
        return this._host.game.religion.getTU(name as TranscendenceUpgrade) ?? null;
    }
    throw new Error(`Unknown build: ${name} (${variant})`);
  }

  /**
   * Find the button that allows purchasing a given upgrade.
   *
   * @param name The name of the upgrade.
   * @param variant The variant of the upgrade.
   * @returns The button to buy the upgrade, or `null`.
   */
  private _getBuild(name: ReligionItem | "unicornPasture", variant: UnicornItemVariant) {
    switch (variant) {
      case UnicornItemVariant.Ziggurat: {
        return this._host.game.time.queue.getQueueElementControllerAndModel({
          name,
          type: "zigguratUpgrades",
        });
      }
      case UnicornItemVariant.OrderOfTheSun: {
        return this._host.game.time.queue.getQueueElementControllerAndModel({
          name,
          type: "religion",
        });
      }
      case UnicornItemVariant.Cryptotheology: {
        return this._host.game.time.queue.getQueueElementControllerAndModel({
          name,
          type: "transcendenceUpgrades",
        });
      }
      default:
        throw new Error(`Invalid variant '${variant}'`);
    }
  }

  private _transformBtnSacrificeHelper<TModel extends UnsafeTransformBtnModel>(
    available: number,
    total: number,
    controller: TransformBtnController<TModel>,
    model: TModel,
  ) {
    const conversionPercentage = available / total;
    const percentageInverse = 1 / conversionPercentage;

    const customController = new classes.ui.religion.TransformBtnController(
      game,
      controller.controllerOpts,
    ) as TransformBtnController<TModel, Record<string, unknown>>;

    const link = customController._newLink(model, percentageInverse);
    return new Promise<boolean>(resolve => {
      link.handler(new Event("decoy"), resolve);
    });
  }

  private async _autoSacrificeUnicorns() {
    const unicorns = this._workshopManager.getResource("unicorns");
    const available = this._workshopManager.getValueAvailable("unicorns");

    if (
      !isNil(this._host.game.religionTab.sacrificeBtn) &&
      negativeOneToInfinity(this.settings.sacrificeUnicorns.trigger) <= available &&
      negativeOneToInfinity(this.settings.sacrificeUnicorns.trigger) <= unicorns.value
    ) {
      const controller = this._host.game.religionTab.sacrificeBtn.controller;
      const model = this._host.game.religionTab.sacrificeBtn.model;

      if (isNil(model)) {
        return;
      }

      await this._transformBtnSacrificeHelper(available, unicorns.value, controller, model);

      const availableNow = this._workshopManager.getValueAvailable("unicorns");
      const cost = available - availableNow;

      this._host.engine.iactivity(
        "act.sacrificeUnicorns",
        [this._host.game.getDisplayValueExt(cost)],
        "ks-faith",
      );
      this._host.engine.storeForSummary(
        this._host.engine.i18n("$resources.unicorns.title"),
        cost,
        "refine",
      );
    }
  }

  private async _autoSacrificeAlicorns(context: FrameContext) {
    const alicorns = this._workshopManager.getResource("alicorn");
    const available = this._workshopManager.getValueAvailable("alicorn");
    if (
      !isNil(this._host.game.religionTab.sacrificeAlicornsBtn) &&
      negativeOneToInfinity(this.settings.sacrificeAlicorns.trigger) <= available &&
      negativeOneToInfinity(this.settings.sacrificeAlicorns.trigger) <= alicorns.value
    ) {
      this._host.game.religionTab.sacrificeAlicornsBtn.render();
      const controller = this._host.game.religionTab.sacrificeAlicornsBtn.controller;
      const model = this._host.game.religionTab.sacrificeAlicornsBtn.model;

      if (isNil(model)) {
        context.requestGameUiRefresh = true;
        return;
      }

      await this._transformBtnSacrificeHelper(available, alicorns.value, controller, model);

      const availableNow = this._workshopManager.getValueAvailable("alicorn");
      const cost = available - availableNow;

      this._host.engine.iactivity(
        "act.sacrificeAlicorns",
        [this._host.game.getDisplayValueExt(cost)],
        "ks-faith",
      );
      this._host.engine.storeForSummary(
        this._host.engine.i18n("$resources.alicorn.title"),
        cost,
        "refine",
      );
    }
  }

  private _autoTears(context: FrameContext) {
    const tears = this._workshopManager.getResource("tears");
    const available = this._workshopManager.getValueAvailable("tears");
    const sorrow = this._workshopManager.getResource("sorrow");
    if (
      !isNil(this._host.game.religionTab.refineBtn) &&
      negativeOneToInfinity(this.settings.refineTears.trigger) <= available &&
      negativeOneToInfinity(this.settings.refineTears.trigger) <= tears.value &&
      sorrow.value < sorrow.maxValue
    ) {
      const availableForConversion = available - this.settings.refineTears.trigger;

      if (availableForConversion < 10000) {
        return;
      }

      const controller = this._host.game.religionTab.refineBtn.controller;
      const model = this._host.game.religionTab.refineBtn.model;

      if (isNil(model)) {
        context.requestGameUiRefresh = true;
        return;
      }

      controller.buyItem(model, new Event("decoy"), availableForConversion);

      const availableNow = this._workshopManager.getValueAvailable("tears");
      const cost = available - availableNow;

      this._host.engine.iactivity(
        "act.refineTears",
        [this._host.game.getDisplayValueExt(cost)],
        "ks-faith",
      );
      this._host.engine.storeForSummary(
        this._host.engine.i18n("$resources.tears.title"),
        cost,
        "refine",
      );
    }
  }

  private async _autoTCs(context: FrameContext) {
    const timeCrystals = this._workshopManager.getResource("timeCrystal");
    const available = this._workshopManager.getValueAvailable("timeCrystal");
    if (
      !isNil(this._host.game.religionTab.refineTCBtn) &&
      negativeOneToInfinity(this.settings.refineTimeCrystals.trigger) <= available &&
      negativeOneToInfinity(this.settings.refineTimeCrystals.trigger) <= timeCrystals.value
    ) {
      const controller = this._host.game.religionTab.refineTCBtn.controller;
      const model = this._host.game.religionTab.refineTCBtn.model;

      if (isNil(model)) {
        context.requestGameUiRefresh = true;
        return;
      }

      await this._transformBtnSacrificeHelper(available, timeCrystals.value, controller, model);

      const availableNow = this._workshopManager.getValueAvailable("timeCrystal");
      const cost = available - availableNow;

      this._host.engine.iactivity(
        "act.refineTCs",
        [this._host.game.getDisplayValueExt(cost)],
        "ks-faith",
      );
      this._host.engine.storeForSummary(
        this._host.engine.i18n("$resources.timeCrystal.title"),
        cost,
        "refine",
      );
    }
  }

  private _autoTAP() {
    const faith = this._workshopManager.getResource("faith");
    const faithLevel = faith.value / faith.maxValue;
    // enough faith, and then TAP (transcend, adore, praise)
    if (this.settings.transcend.enabled && this.settings.autoPraise.trigger - 0.02 <= faithLevel) {
      this._autoTranscend();
    }

    // Praise (faith → worship)
    if (this.settings.autoPraise.trigger <= faithLevel) {
      // Adore the galaxy (worship → epiphany)
      if (
        this.settings.adore.enabled &&
        mustExist(this._host.game.religion.getRU("apocripha")).on
      ) {
        this._autoAdore(this.settings.adore.trigger);
      }

      if (this.settings.autoPraise.enabled) {
        this._autoPraise();
      }
    }
  }

  private _autoAdore(trigger: number) {
    const faith = this._workshopManager.getResource("faith");

    const worship = this._host.game.religion.faith;
    const epiphany = this._host.game.religion.faithRatio;
    const transcendenceReached = mustExist(this._host.game.religion.getRU("transcendence")).on;
    const transcendenceTierCurrent = transcendenceReached
      ? this._host.game.religion.transcendenceTier
      : 0;
    // game version: 1.4.8.1
    // solarRevolutionLimit is increased by black obelisks.
    const maxSolarRevolution = 10 + this._host.game.getEffect("solarRevolutionLimit");
    // The absolute value at which to trigger adoring the galaxy.
    const triggerSolarRevolution = maxSolarRevolution * trigger;
    // How much epiphany we'll get from converting our worship.
    const epiphanyIncrease =
      (worship / 1000000) * transcendenceTierCurrent * transcendenceTierCurrent * 1.01;
    // How much epiphany we'll have after adoring.
    const epiphanyAfterAdore = epiphany + epiphanyIncrease;
    // How much worship we'll have after adoring.
    const worshipAfterAdore =
      0.01 + faith.value * (1 + this._host.game.getUnlimitedDR(epiphanyAfterAdore, 0.1) * 0.1);
    // How much solar revolution bonus we'll have after adoring.
    const solarRevolutionAfterAdore = this._host.game.getLimitedDR(
      this._host.game.getUnlimitedDR(worshipAfterAdore, 1000) / 100,
      maxSolarRevolution,
    );
    // After adoring the galaxy, we want a single praise to be able to reach the trigger
    // level of solar revolution bonus.
    if (triggerSolarRevolution <= solarRevolutionAfterAdore) {
      // Perform the actual adoration.
      this._host.game.religion._resetFaithInternal(1.01);

      // Log the action.
      this._host.engine.iactivity(
        "act.adore",
        [
          this._host.game.getDisplayValueExt(worship),
          this._host.game.getDisplayValueExt(epiphanyIncrease),
        ],
        "ks-adore",
      );
      this._host.engine.storeForSummary("adore", epiphanyIncrease);
    }
  }

  private _autoTranscend() {
    let epiphany = this._host.game.religion.faithRatio;
    const transcendenceReached = mustExist(this._host.game.religion.getRU("transcendence")).on;
    let transcendenceTierCurrent = transcendenceReached
      ? this._host.game.religion.transcendenceTier
      : 0;

    // Transcend
    if (transcendenceReached) {
      // How much our adoration ratio increases from transcending.
      const adoreIncreaseRatio =
        ((transcendenceTierCurrent + 2) / (transcendenceTierCurrent + 1)) ** 2;
      // The amount of worship needed to upgrade to the next level.
      const needNextLevel =
        this._host.game.religion._getTranscendTotalPrice(transcendenceTierCurrent + 1) -
        this._host.game.religion._getTranscendTotalPrice(transcendenceTierCurrent);

      // We want to determine the ideal value for when to transcend.
      // TODO: How exactly this works isn't understood yet.
      const x = needNextLevel;
      const k = adoreIncreaseRatio;
      const epiphanyRecommend =
        ((1 - k + Math.sqrt(80 * (k * k - 1) * x + (k - 1) * (k - 1))) * k) /
          (40 * (k + 1) * (k + 1) * (k - 1)) +
        x +
        x / (k * k - 1);

      if (epiphanyRecommend <= epiphany) {
        // code copy from kittens game's religion.js: this._host.game.religion.transcend()
        // this._host.game.religion.transcend() need confirm by player
        // game version: 1.4.8.1
        // ========================================================================================================
        // DO TRANSCEND START
        // ========================================================================================================
        this._host.game.religion.faithRatio -= needNextLevel;
        this._host.game.religion.tcratio += needNextLevel;
        this._host.game.religion.transcendenceTier += 1;

        const atheism = mustExist(this._host.game.challenges.getChallenge("atheism"));
        atheism.calculateEffects?.(atheism, this._host.game);
        const blackObelisk = mustExist(this._host.game.religion.getTU("blackObelisk"));
        blackObelisk.calculateEffects?.(blackObelisk, this._host.game);

        this._host.game.msg(
          this._host.engine.i18n("$religion.transcend.msg.success", [
            this._host.game.religion.transcendenceTier,
          ]),
        );
        // ========================================================================================================
        // DO TRANSCEND END
        // ========================================================================================================

        epiphany = this._host.game.religion.faithRatio;
        transcendenceTierCurrent = this._host.game.religion.transcendenceTier;
        this._host.engine.iactivity(
          "act.transcend",
          [this._host.game.getDisplayValueExt(needNextLevel), transcendenceTierCurrent],
          "ks-transcend",
        );
        this._host.engine.storeForSummary("transcend", 1);
      }
    }
  }

  private _autoPraise() {
    const faith = this._workshopManager.getResource("faith");
    const apocryphaBonus = this._host.game.religion.getApocryphaBonus();

    // Determine how much worship we'll gain and log it.
    const worshipIncrease = faith.value * (1 + apocryphaBonus);
    this._host.engine.storeForSummary("praise", worshipIncrease);
    this._host.engine.iactivity(
      "act.praise",
      [
        this._host.game.getDisplayValueExt(faith.value),
        this._host.game.getDisplayValueExt(worshipIncrease),
      ],
      "ks-praise",
    );

    // Now finally praise the sun.
    this._host.game.religion.praise();
  }
}
