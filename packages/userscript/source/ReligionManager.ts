import { BonfireManager } from "./BonfireManager";
import { Automation, TickContext } from "./Engine";
import { BulkPurchaseHelper } from "./helper/BulkPurchaseHelper";
import { BonfireBuildingSetting } from "./settings/BonfireSettings";
import {
  FaithItem,
  ReligionSettings,
  ReligionSettingsItem,
  UnicornItem,
} from "./settings/ReligionSettings";
import { TabManager } from "./TabManager";
import { cwarn } from "./tools/Log";
import { isNil, mustExist } from "./tools/Maybe";
import {
  BuildButton,
  ButtonModernController,
  ButtonModernModel,
  ReligionTab,
  ReligionUpgradeInfo,
  ReligionUpgrades,
  TranscendenceUpgradeInfo,
  TranscendenceUpgrades,
  TransformBtnController,
  UnicornItemVariant,
  ZiggurathUpgradeInfo,
  ZiggurathUpgrades,
} from "./types";
import { UserScript } from "./UserScript";
import { WorkshopManager } from "./WorkshopManager";

export class ReligionManager implements Automation {
  private readonly _host: UserScript;
  settings: ReligionSettings;
  readonly manager: TabManager<ReligionTab>;
  private readonly _bulkManager: BulkPurchaseHelper;
  private readonly _bonfireManager: BonfireManager;
  private readonly _workshopManager: WorkshopManager;

  constructor(
    host: UserScript,
    bonfireManager: BonfireManager,
    workshopManager: WorkshopManager,
    settings = new ReligionSettings()
  ) {
    this._host = host;
    this.settings = settings;
    this.manager = new TabManager(this._host, "Religion");
    this._workshopManager = workshopManager;
    this._bulkManager = new BulkPurchaseHelper(this._host, this._workshopManager);
    this._bonfireManager = bonfireManager;
  }

  async tick(context: TickContext) {
    if (!this.settings.enabled) {
      return;
    }

    this._autoBuild();

    if (this.settings.refineTears.enabled) {
      await this._autoTears();
    }

    if (this.settings.refineTimeCrystals.enabled) {
      await this._autoTCs();
    }

    this._autoTAP();
  }

  load(settings: ReligionSettings) {
    this.settings.load(settings);
  }

  private _autoBuild() {
    if (this.settings.bestUnicornBuilding.enabled) {
      this._buildBestUnicornBuilding();
      this._buildNonUnicornBuildings();
    } else {
      // Create the list of builds, excluding the unicorn pasture.
      // The unicorn pasture requires a special build path, because it's really
      // a bonfire building.
      const builds = Object.fromEntries(
        Object.entries(this.settings.buildings).filter(
          ([k, v]) => v.variant !== UnicornItemVariant.UnicornPasture
        )
      );
      // Build a unicorn pasture if possible.
      const maxPastures =
        -1 === this.settings.buildings.unicornPasture.max
          ? Number.POSITIVE_INFINITY
          : this.settings.buildings.unicornPasture.max;
      const meta = this._host.gamePage.bld.getBuildingExt("unicornPasture").meta;
      if (this.settings.buildings.unicornPasture.enabled && meta.val < maxPastures) {
        this._bonfireManager.autoBuild({
          unicornPasture: new BonfireBuildingSetting(
            "unicornPasture",
            this.settings.buildings.unicornPasture.enabled,
            this.settings.buildings.unicornPasture.require,
            this.settings.buildings.unicornPasture.max
          ),
        });
      }
      // And then we build all other possible religion buildings.
      this._buildReligionBuildings(builds);
    }
  }

  private _buildBestUnicornBuilding() {
    const bestUnicornBuilding = this.getBestUnicornBuilding();
    if (bestUnicornBuilding === null) {
      return;
    }

    if (bestUnicornBuilding === "unicornPasture") {
      this._bonfireManager.build(bestUnicornBuilding, 0, 1);
    } else {
      const buildingButton = mustExist(
        this.getBuildButton(bestUnicornBuilding, UnicornItemVariant.Ziggurat)
      );

      let tearsNeeded = 0;
      const priceTears = mustExist(mustExist(buildingButton.model).prices).find(
        subject => subject.name === "tears"
      );
      if (!isNil(priceTears)) {
        tearsNeeded = priceTears.val;
      }

      const tearsAvailableForUse =
        this._workshopManager.getValue("tears") - this._workshopManager.getStock("tears");

      if (tearsAvailableForUse < tearsNeeded) {
        // if no ziggurat, getBestUnicornBuilding will return unicornPasture
        // TODO: ☝ Yeah. So?

        // How many times can we sacrifice unicorns to make tears?
        const maxSacrifice = Math.floor(
          (this._workshopManager.getValue("unicorns") -
            this._workshopManager.getStock("unicorns")) /
            2500
        );

        // How many sacrifices would we need, so we'd end up with enough tears.
        const needSacrifice = Math.ceil(
          (tearsNeeded - tearsAvailableForUse) /
            this._host.gamePage.bld.getBuildingExt("ziggurat").meta.on
        );

        // Sacrifice some unicorns to get the tears to buy the building.
        if (needSacrifice < maxSacrifice) {
          this._host.gamePage.religionTab.sacrificeBtn.controller._transform(
            this._host.gamePage.religionTab.sacrificeBtn.model,
            needSacrifice
          );
          // iactivity?
          // TODO: ☝ Yeah, seems like a good idea.
        } else {
          // Not enough unicorns to sacrifice to make enough tears.
          return;
        }
      }

      // Let the BulkManager figure out if the build can be made.
      const buildRequest = { [bestUnicornBuilding]: this.settings.buildings[bestUnicornBuilding] };
      const build = this._bulkManager.bulk(
        buildRequest,
        this.getBuildMetaData(buildRequest),
        this.settings.trigger
      );
      if (0 < build.length && 0 < build[0].count) {
        // We force only building 1 of the best unicorn building, because
        // afterwards the best unicorn building is likely going to change.
        this.build(bestUnicornBuilding, UnicornItemVariant.Ziggurat, 1);
      }
    }
  }
  private _buildNonUnicornBuildings() {
    const alreadyHandled: Array<FaithItem | UnicornItem> = [
      "unicornPasture",
      "unicornTomb",
      "ivoryTower",
      "ivoryCitadel",
      "skyPalace",
      "unicornUtopia",
      "sunspire",
    ];
    const builds = Object.fromEntries(
      Object.entries(this.settings.buildings).filter(
        ([k, v]) => !alreadyHandled.includes(v.building)
      )
    );
    this._buildReligionBuildings(builds);
  }

  private _buildReligionBuildings(builds: Partial<Record<FaithItem, ReligionSettingsItem>>): void {
    // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
    this.manager.render();

    const metaData: Partial<
      Record<FaithItem, ReligionUpgradeInfo | TranscendenceUpgradeInfo | ZiggurathUpgradeInfo>
    > = this.getBuildMetaData(builds);

    // Let the bulk manager figure out which of the builds to actually build.
    const buildList = this._bulkManager.bulk(builds, metaData, this.settings.trigger);

    let refreshRequired = false;
    for (const build of buildList) {
      if (0 < build.count) {
        this.build(
          build.id as ReligionUpgrades | TranscendenceUpgrades | ZiggurathUpgrades,
          mustExist(build.variant) as UnicornItemVariant,
          build.count
        );
        refreshRequired = true;
      }
    }

    // If we built any religion buildings, refresh the UI.
    if (refreshRequired) {
      this._host.gamePage.ui.render();
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
  getBestUnicornBuilding(): ZiggurathUpgrades | null {
    const pastureButton = this._bonfireManager.getBuildButton("unicornPasture");
    if (pastureButton === null) {
      return null;
    }

    const validBuildings: Array<ZiggurathUpgrades> = [
      "unicornTomb",
      "ivoryTower",
      "ivoryCitadel",
      "skyPalace",
      "unicornUtopia",
      "sunspire",
    ];

    // How many unicorns are produced per second.
    const unicornsPerSecondBase =
      this._host.gamePage.getEffect("unicornsPerTickBase") *
      this._host.gamePage.getTicksPerSecondUI();
    // Unicorn ratio modifier. For example, through "unicorn selection".
    const globalRatio = this._host.gamePage.getEffect("unicornsGlobalRatio") + 1;
    // The unicorn ratio modifier through religion buildings.
    const religionRatio = this._host.gamePage.getEffect("unicornsRatioReligion") + 1;
    // The ratio modifier through paragon.
    const paragonRatio = this._host.gamePage.prestige.getParagonProductionRatio() + 1;
    // Bonus from collected faith.
    const faithBonus = this._host.gamePage.religion.getSolarRevolutionRatio() + 1;

    const currentCycleIndex = this._host.gamePage.calendar.cycle;
    const currentCycle = this._host.gamePage.calendar.cycles[currentCycleIndex];

    // The modifier applied by the current cycle and holding a festival.
    let cycleBonus = 1;
    // If the current cycle has an effect on unicorn production during festivals
    // TODO: Simplify
    if (currentCycle.festivalEffects["unicorns"] !== undefined) {
      // Numeromancy is the metaphysics upgrade that grants bonuses based on cycles.
      if (
        this._host.gamePage.prestige.getPerk("numeromancy").researched &&
        this._host.gamePage.calendar.festivalDays
      ) {
        cycleBonus = currentCycle.festivalEffects["unicorns"];
      }
    }

    const unicornsPerSecond =
      unicornsPerSecondBase * globalRatio * religionRatio * paragonRatio * faithBonus * cycleBonus;

    // Based on how many zigguraths we have.
    const ziggurathRatio = Math.max(this._host.gamePage.bld.getBuildingExt("ziggurat").meta.on, 1);
    // How many unicorns do we receive in a unicorn rift?
    const baseUnicornsPerRift =
      500 * (1 + this._host.gamePage.getEffect("unicornsRatioReligion") * 0.1);

    // How likely are unicorn rifts to happen? The unicornmancy metaphysics upgrade increases this chance.
    let riftChanceRatio = 1;
    if (this._host.gamePage.prestige.getPerk("unicornmancy").researched) {
      riftChanceRatio *= 1.1;
    }
    // ?
    const unicornRiftChange =
      ((this._host.gamePage.getEffect("riftChance") * riftChanceRatio) / (10000 * 2)) *
      baseUnicornsPerRift;

    // We now want to determine how quickly the cost of given building is neutralized
    // by its effect on production of unicorns.

    let bestAmoritization = Infinity;
    let bestBuilding: ZiggurathUpgrades | null = null;
    const unicornsPerTickBase = mustExist(
      this._host.gamePage.bld.getBuildingExt("unicornPasture").meta.effects["unicornsPerTickBase"]
    );
    const pastureProduction =
      unicornsPerTickBase *
      this._host.gamePage.getTicksPerSecondUI() *
      globalRatio *
      religionRatio *
      paragonRatio *
      faithBonus *
      cycleBonus;

    // If the unicorn pasture amortizes itself in less than infinity ticks,
    // set it as the default. This is likely to protect against cases where
    // production of unicorns is 0.
    const pastureAmortization = mustExist(pastureButton.model.prices)[0].val / pastureProduction;
    if (pastureAmortization < bestAmoritization) {
      bestAmoritization = pastureAmortization;
      bestBuilding = "unicornPasture";
    }

    // For all ziggurath upgrade buttons...
    for (const button of this.manager.tab.zgUpgradeButtons) {
      // ...that are in the "valid" buildings (are unicorn-related) and visible (unlocked)...
      if (validBuildings.includes(button.id) && button.model.visible) {
        // Determine a price value for this building.
        let unicornPrice = 0;
        for (const price of mustExist(button.model.prices)) {
          // Add the amount of unicorns the building costs (if any).
          if (price.name === "unicorns") {
            unicornPrice += price.val;
          }
          // Tears result from unicorn sacrifices, so factor that into the price proportionally.
          if (price.name === "tears") {
            unicornPrice += (price.val * 2500) / ziggurathRatio;
          }
        }

        // Determine the effect the building will have on unicorn production and unicorn rifts.
        const buildingInfo = mustExist(this._host.gamePage.religion.getZU(button.id));
        let religionBonus = religionRatio;
        let riftChance = this._host.gamePage.getEffect("riftChance");
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

        if (amortization < bestAmoritization) {
          if (0 < riftBonus || (religionRatio < religionBonus && 0 < unicornPrice)) {
            bestAmoritization = amortization;
            bestBuilding = button.id;
          }
        }
      }
    }
    return bestBuilding;
  }

  build(
    name: ReligionUpgrades | TranscendenceUpgrades | ZiggurathUpgrades,
    variant: UnicornItemVariant,
    amount: number
  ): void {
    const build = this.getBuild(name, variant);
    if (build === null) {
      throw new Error(`Unable to build '${name}'. Build information not available.`);
    }

    const button = this.getBuildButton(name, variant);
    if (!button || !button.model.enabled) return;

    const amountTemp = amount;
    const label = build.label;
    amount = this._bulkManager.construct(button.model, button, amount);
    if (amount !== amountTemp) {
      cwarn(`${label} Amount ordered: ${amountTemp} Amount Constructed: ${amount}`);
    }

    if (variant === UnicornItemVariant.OrderOfTheSun) {
      this._host.engine.storeForSummary(label, amount, "faith");
      if (amount === 1) {
        this._host.engine.iactivity("act.sun.discover", [label], "ks-faith");
      } else {
        this._host.engine.iactivity("act.sun.discovers", [label, amount], "ks-faith");
      }
    } else {
      this._host.engine.storeForSummary(label, amount, "build");
      if (amount === 1) {
        this._host.engine.iactivity("act.build", [label], "ks-build");
      } else {
        this._host.engine.iactivity("act.builds", [label, amount], "ks-build");
      }
    }
  }

  getBuildMetaData(builds: Partial<Record<FaithItem, ReligionSettingsItem>>) {
    const metaData: Partial<
      Record<FaithItem, ReligionUpgradeInfo | TranscendenceUpgradeInfo | ZiggurathUpgradeInfo>
    > = {};
    for (const build of Object.values(builds)) {
      const buildInfo = this.getBuild(build.building, build.variant);
      if (buildInfo === null) {
        continue;
      }
      metaData[build.building as FaithItem] = buildInfo;
      const buildMetaData = mustExist(metaData[build.building as FaithItem]);

      // If an item is marked as `rHidden`, it wouldn't be build.
      // TODO: Why not remove it from the `builds` then?
      if (!this.getBuildButton(build.building, build.variant)) {
        buildMetaData.rHidden = true;
      } else {
        const model = mustExist(this.getBuildButton(build.building, build.variant)).model;
        const panel =
          build.variant === UnicornItemVariant.Cryptotheology
            ? this._host.gamePage.science.get("cryptotheology").researched
            : true;
        buildMetaData.rHidden = !(model.visible && model.enabled && panel);
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
  getBuild(
    name: ReligionUpgrades | TranscendenceUpgrades | ZiggurathUpgrades,
    variant: UnicornItemVariant
  ): ReligionUpgradeInfo | TranscendenceUpgradeInfo | ZiggurathUpgradeInfo | null {
    switch (variant) {
      case UnicornItemVariant.Ziggurat:
        return this._host.gamePage.religion.getZU(name as ZiggurathUpgrades) ?? null;
      case UnicornItemVariant.OrderOfTheSun:
        return this._host.gamePage.religion.getRU(name as ReligionUpgrades) ?? null;
      case UnicornItemVariant.Cryptotheology:
        return this._host.gamePage.religion.getTU(name as TranscendenceUpgrades) ?? null;
    }
    return null;
  }

  /**
   * Find the button that allows purchasing a given upgrade.
   *
   * @param name The name of the upgrade.
   * @param variant The variant of the upgrade.
   * @returns The button to buy the upgrade, or `null`.
   */
  getBuildButton(
    name: ReligionUpgrades | TranscendenceUpgrades | ZiggurathUpgrades,
    variant: UnicornItemVariant
  ): BuildButton<string, ButtonModernModel, ButtonModernController> | null {
    let buttons: Array<BuildButton>;
    switch (variant) {
      case UnicornItemVariant.Ziggurat:
        buttons = this.manager.tab.zgUpgradeButtons;
        break;
      case UnicornItemVariant.OrderOfTheSun:
        buttons = this.manager.tab.rUpgradeButtons;
        break;
      case UnicornItemVariant.Cryptotheology:
        buttons = this.manager.tab.children[0].children[0].children;
        break;
      default:
        throw new Error(`Invalid variant '${variant}'`);
    }

    const build = this.getBuild(name, variant);
    if (build === null) {
      throw new Error(`Unable to retrieve build information for '${name}'`);
    }

    for (const button of buttons) {
      const haystack = button.model.name;
      if (haystack.indexOf(build.label) !== -1) {
        return button as BuildButton<string, ButtonModernModel, ButtonModernController>;
      }
    }

    return null;
  }

  private async _autoTears() {
    const tears = this._workshopManager.getResource("tears");
    const available = this._workshopManager.getValueAvailable("tears");
    if (
      this.settings.refineTears.trigger <= available &&
      this.settings.refineTears.trigger <= tears.value
    ) {
      const controller = new classes.ui.religion.RefineTearsBtnController(this._host.gamePage);

      await new Promise(resolve =>
        controller.buyItem(
          this._host.gamePage.religionTab.refineBtn.model,
          new MouseEvent("click"),
          resolve
        )
      );

      this._host.engine.iactivity("act.refineTears", [], "ks-faith");
      this._host.engine.storeForSummary(
        this._host.engine.i18n("$resources.tears.title"),
        1,
        "refine"
      );
    }
  }

  private async _autoTCs() {
    const timeCrystals = this._workshopManager.getResource("timeCrystal");
    const available = this._workshopManager.getValueAvailable("timeCrystal");
    if (
      this.settings.refineTimeCrystals.trigger <= available &&
      this.settings.refineTimeCrystals.trigger <= timeCrystals.value
    ) {
      const controller = this._host.gamePage.religionTab.refineTCBtn
        .controller as TransformBtnController;
      const model = this._host.gamePage.religionTab.refineTCBtn.model;
      await new Promise(resolve =>
        controller.buyItem(
          this._host.gamePage.religionTab.refineTCBtn.model,
          new MouseEvent("click"),
          resolve
        )
      );

      const cost = mustExist(model.prices?.[0]).val;

      this._host.engine.iactivity("act.refineTCs", [cost], "ks-faith");
      this._host.engine.storeForSummary(
        this._host.engine.i18n("$resources.timeCrystal.title"),
        cost,
        "refine"
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
        mustExist(this._host.gamePage.religion.getRU("apocripha")).on
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

    const worship = this._host.gamePage.religion.faith;
    const epiphany = this._host.gamePage.religion.faithRatio;
    const transcendenceReached = mustExist(this._host.gamePage.religion.getRU("transcendence")).on;
    const transcendenceTierCurrent = transcendenceReached
      ? this._host.gamePage.religion.transcendenceTier
      : 0;
    // game version: 1.4.8.1
    // solarRevolutionLimit is increased by black obelisks.
    const maxSolarRevolution = 10 + this._host.gamePage.getEffect("solarRevolutionLimit");
    // The absolute value at which to trigger adoring the galaxy.
    const triggerSolarRevolution = maxSolarRevolution * trigger;
    // How much epiphany we'll get from converting our worship.
    const epiphanyIncrease =
      (worship / 1000000) * transcendenceTierCurrent * transcendenceTierCurrent * 1.01;
    // How much epiphany we'll have after adoring.
    const epiphanyAfterAdore = epiphany + epiphanyIncrease;
    // How much worship we'll have after adoring.
    const worshipAfterAdore =
      0.01 + faith.value * (1 + this._host.gamePage.getUnlimitedDR(epiphanyAfterAdore, 0.1) * 0.1);
    // How much solar revolution bonus we'll have after adoring.
    const solarRevolutionAfterAdore = this._host.gamePage.getLimitedDR(
      this._host.gamePage.getUnlimitedDR(worshipAfterAdore, 1000) / 100,
      maxSolarRevolution
    );
    // After adoring the galaxy, we want a single praise to be able to reach the trigger
    // level of solar revolution bonus.
    if (triggerSolarRevolution <= solarRevolutionAfterAdore) {
      // Perform the actual adoration.
      this._host.gamePage.religion._resetFaithInternal(1.01);

      // Log the action.
      this._host.engine.iactivity(
        "act.adore",
        [
          this._host.gamePage.getDisplayValueExt(worship),
          this._host.gamePage.getDisplayValueExt(epiphanyIncrease),
        ],
        "ks-adore"
      );
      this._host.engine.storeForSummary("adore", epiphanyIncrease);
      // TODO: Not sure what the point of updating these values would be
      //       We're at the end of the branch.
      //epiphany = this._host.gamePage.religion.faithRatio;
      //worship = this._host.gamePage.religion.faith;
    }
  }

  private _autoTranscend() {
    let epiphany = this._host.gamePage.religion.faithRatio;
    const transcendenceReached = mustExist(this._host.gamePage.religion.getRU("transcendence")).on;
    let transcendenceTierCurrent = transcendenceReached
      ? this._host.gamePage.religion.transcendenceTier
      : 0;

    // Transcend
    if (transcendenceReached) {
      // How much our adoration ratio increases from transcending.
      const adoreIncreaceRatio = Math.pow(
        (transcendenceTierCurrent + 2) / (transcendenceTierCurrent + 1),
        2
      );
      // The amount of worship needed to upgrade to the next level.
      const needNextLevel =
        this._host.gamePage.religion._getTranscendTotalPrice(transcendenceTierCurrent + 1) -
        this._host.gamePage.religion._getTranscendTotalPrice(transcendenceTierCurrent);

      // We want to determine the ideal value for when to trancend.
      // TODO: How exactly this works isn't understood yet.
      const x = needNextLevel;
      const k = adoreIncreaceRatio;
      const epiphanyRecommend =
        ((1 - k + Math.sqrt(80 * (k * k - 1) * x + (k - 1) * (k - 1))) * k) /
          (40 * (k + 1) * (k + 1) * (k - 1)) +
        x +
        x / (k * k - 1);

      if (epiphanyRecommend <= epiphany) {
        // code copy from kittens game's religion.js: this._host.gamePage.religion.transcend()
        // this._host.gamePage.religion.transcend() need confirm by player
        // game version: 1.4.8.1
        // ========================================================================================================
        // DO TRANSCEND START
        // ========================================================================================================
        this._host.gamePage.religion.faithRatio -= needNextLevel;
        this._host.gamePage.religion.tcratio += needNextLevel;
        this._host.gamePage.religion.transcendenceTier += 1;

        const atheism = mustExist(this._host.gamePage.challenges.getChallenge("atheism"));
        atheism.calculateEffects(atheism, this._host.gamePage);
        const blackObelisk = mustExist(this._host.gamePage.religion.getTU("blackObelisk"));
        blackObelisk.calculateEffects(blackObelisk, this._host.gamePage);

        this._host.gamePage.msg(
          this._host.engine.i18n("$religion.transcend.msg.success", [
            this._host.gamePage.religion.transcendenceTier,
          ])
        );
        // ========================================================================================================
        // DO TRANSCEND END
        // ========================================================================================================

        epiphany = this._host.gamePage.religion.faithRatio;
        transcendenceTierCurrent = this._host.gamePage.religion.transcendenceTier;
        this._host.engine.iactivity(
          "act.transcend",
          [this._host.gamePage.getDisplayValueExt(needNextLevel), transcendenceTierCurrent],
          "ks-transcend"
        );
        this._host.engine.storeForSummary("transcend", 1);
      }
    }
  }

  private _autoPraise() {
    const faith = this._workshopManager.getResource("faith");
    let apocryphaBonus;
    if (!this._host.gamePage.religion.getFaithBonus) {
      apocryphaBonus = this._host.gamePage.religion.getApocryphaBonus();
    } else {
      apocryphaBonus = this._host.gamePage.religion.getFaithBonus();
    }

    // Determine how much worship we'll gain and log it.
    const worshipIncrease = faith.value * (1 + apocryphaBonus);
    this._host.engine.storeForSummary("praise", worshipIncrease);
    this._host.engine.iactivity(
      "act.praise",
      [
        this._host.gamePage.getDisplayValueExt(faith.value),
        this._host.gamePage.getDisplayValueExt(worshipIncrease),
      ],
      "ks-praise"
    );

    // Now finally praise the sun.
    this._host.gamePage.religion.praise();
  }
}
