import { isNil, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import type { Automation, FrameContext } from "./Engine.js";
import type { KittenScientists } from "./KittenScientists.js";
import { TabManager } from "./TabManager.js";
import type { WorkshopManager } from "./WorkshopManager.js";
import { BulkPurchaseHelper } from "./helper/BulkPurchaseHelper.js";
import {
  type BonfireBuildingSetting,
  type BonfireItem,
  BonfireSettings,
} from "./settings/BonfireSettings.js";
import { cl } from "./tools/Log.js";
import type {
  BuildingBtnModernController,
  BuildingMeta,
  BuildingsModern,
  GatherCatnipButtonController,
  StagingBldBtnController,
  UnsafeBuilding,
  UnsafeStagingBldButtonOptions,
  UnsafeUnstagedBuildingButtonOptions,
} from "./types/buildings.js";
import type { UnsafeBuildingBtnModernModel } from "./types/core.js";
import type { Building } from "./types/index.js";

export class BonfireManager implements Automation {
  private readonly _host: KittenScientists;
  readonly settings: BonfireSettings;
  readonly manager: TabManager<BuildingsModern>;
  private readonly _bulkManager: BulkPurchaseHelper;
  private readonly _workshopManager: WorkshopManager;

  constructor(
    host: KittenScientists,
    workshopManager: WorkshopManager,
    settings = new BonfireSettings(),
  ) {
    this._host = host;
    this.settings = settings;
    this.manager = new TabManager<BuildingsModern>(this._host, "Bonfire");

    this._workshopManager = workshopManager;
    this._bulkManager = new BulkPurchaseHelper(this._host, this._workshopManager);
  }

  tick(context: FrameContext) {
    if (!this.settings.enabled) {
      return;
    }

    // We must call `.render()` here, because evaluation of availability of our options
    // is only performed when the game renders the contents of that tab.
    this.manager.render();

    this.autoBuild(context);
    this.autoMisc(context);
  }

  /**
   * Try to build as many of the passed buildings as possible.
   * Usually, this is called at each iteration of the automation engine to
   * handle the building of items on the Bonfire tab.
   *
   * @param builds The buildings to build.
   */
  autoBuild(
    context: FrameContext,
    builds: Partial<Record<BonfireItem, BonfireBuildingSetting>> = this.settings.buildings,
  ) {
    const bulkManager = this._bulkManager;

    // Get the current metadata for all the referenced buildings.
    const metaData: Partial<Record<BonfireItem, Required<UnsafeBuilding>>> = {};
    for (const build of Object.values(builds)) {
      metaData[build.building] = this.getBuild(
        (build.baseBuilding ?? build.building) as Building,
      ).meta;
    }
    const sectionTrigger = this.settings.trigger;

    // Let the bulkmanager determine the builds we can make.
    const buildList = bulkManager.bulk(builds, metaData, sectionTrigger, "Bonfire");

    // Build all entries in the build list, where we can build any items.
    for (const build of buildList.filter(item => 0 < item.count)) {
      this.build((build.name || build.id) as Building, build.stage, build.count);
      context.requestGameUiRefresh = true;
    }
  }

  autoUpgrade(context: FrameContext) {
    // Get current count of pastures.
    const pastures =
      this._host.game.bld.getBuildingExt("pasture").meta.stage === 0
        ? this._host.game.bld.getBuildingExt("pasture").meta.val
        : 0;
    // Get current count of aqueducts.
    const aqueducts =
      this._host.game.bld.getBuildingExt("aqueduct").meta.stage === 0
        ? this._host.game.bld.getBuildingExt("aqueduct").meta.val
        : 0;

    const pastureMeta = this._host.game.bld.getBuildingExt("pasture").meta;
    // If pastures haven't been upgraded to solar farms yet...
    if (
      this.settings.upgradeBuildings.buildings.solarfarm.enabled &&
      pastureMeta.unlocked &&
      pastureMeta.stage === 0 &&
      mustExist(pastureMeta.stages)[1].stageUnlocked
    ) {
      // If we would reduce our pastures to 0, by upgrading them, would we lose any catnip?
      if (this._workshopManager.getPotentialCatnip(true, 0, aqueducts) > 0) {
        const prices = mustExist(pastureMeta.stages)[1].prices;
        if (this._bulkManager.singleBuildPossible(pastureMeta, prices, 1)) {
          const button = this.getBuildButton("pasture", 0);
          if (!isNil(button?.model)) {
            // We need to perform the process like this to avoid UI confirmations
            // for selling items.
            // Sell all pastures (to regain the resources).
            button.controller.sellInternal(button.model, 0, false);
            // Manually update the metadata, as we bypassed the full selling logic.
            pastureMeta.on = 0;
            pastureMeta.val = 0;
            pastureMeta.stage = 1;

            this._host.engine.iactivity("upgrade.building.pasture", [], "ks-upgrade");

            // Upgrade the pasture.
            this._host.game.ui?.render();
            this.build("pasture", 1, 1);
            context.requestGameUiRefresh = true;
          }
        }
      }
    }

    const aqueductMeta = this._host.game.bld.getBuildingExt("aqueduct").meta;
    // If aqueducts haven't been upgraded to hydro plants yet...
    if (
      this.settings.upgradeBuildings.buildings.hydroplant.enabled &&
      aqueductMeta.unlocked &&
      aqueductMeta.stage === 0 &&
      mustExist(aqueductMeta.stages)[1].stageUnlocked
    ) {
      // If we would reduce our aqueducts to 0, by upgrading them, would we lose any catnip?
      if (this._workshopManager.getPotentialCatnip(true, pastures, 0) > 0) {
        const prices = mustExist(aqueductMeta.stages)[1].prices;
        if (this._bulkManager.singleBuildPossible(aqueductMeta, prices, 1)) {
          const button = this.getBuildButton("aqueduct", 0);
          if (!isNil(button?.model)) {
            button.controller.sellInternal(button.model, 0, false);
            aqueductMeta.on = 0;
            aqueductMeta.val = 0;
            aqueductMeta.stage = 1;

            // TODO: Why do we do this for the aqueduct and not for the pasture?
            aqueductMeta.calculateEffects?.(aqueductMeta, this._host.game);

            this._host.engine.iactivity("upgrade.building.aqueduct", [], "ks-upgrade");

            this._host.game.ui?.render();
            this.build("aqueduct", 1, 1);
            context.requestGameUiRefresh = true;
          }
        }
      }
    }

    const libraryMeta = this._host.game.bld.getBuildingExt("library").meta;
    if (
      this.settings.upgradeBuildings.buildings.dataCenter.enabled &&
      libraryMeta.unlocked &&
      libraryMeta.stage === 0 &&
      mustExist(libraryMeta.stages)[1].stageUnlocked
    ) {
      let energyConsumptionRate = this._host.game.workshop.get("cryocomputing").researched ? 1 : 2;
      if (this._host.game.challenges.currentChallenge === "energy") {
        energyConsumptionRate *= 2;
      }

      // This indicates how valuable a data center is, compared to a single library.
      // We check for possible upgrades, that would make them more valuable.
      let libToDat = 3;
      if (this._host.game.workshop.get("uplink").researched) {
        libToDat *=
          1 +
          this._host.game.bld.getBuildingExt("biolab").meta.val *
            this._host.game.getEffect("uplinkDCRatio");
      }
      if (this._host.game.workshop.get("machineLearning").researched) {
        libToDat *=
          1 +
          this._host.game.bld.getBuildingExt("aiCore").meta.on *
            this._host.game.getEffect("dataCenterAIRatio");
      }

      // We now have the energy consumption of data centers and the value of data centers.
      // Assuming, we would upgrade to data centers and buy as many as we need to have value
      // equal to our current libraries, and that wouldn't cap our energy, upgrade them.
      if (
        this._host.game.resPool.energyProd >=
        this._host.game.resPool.energyCons + (energyConsumptionRate * libraryMeta.val) / libToDat
      ) {
        const prices = mustExist(libraryMeta.stages)[1].prices;
        if (this._bulkManager.singleBuildPossible(libraryMeta, prices, 1)) {
          const button = mustExist(this.getBuildButton("library", 0));
          if (isNil(button.model)) {
            return;
          }

          button.controller.sellInternal(button.model, 0, false);
          libraryMeta.on = 0;
          libraryMeta.val = 0;
          libraryMeta.stage = 1;
          libraryMeta.calculateEffects?.(libraryMeta, this._host.game);
          this._host.engine.iactivity("upgrade.building.library", [], "ks-upgrade");
          this._host.game.ui?.render();
          this.build("library", 1, 1);
          context.requestGameUiRefresh = true;
          return;
        }
      }
    }

    const warehouseMeta = this._host.game.bld.getBuildingExt("warehouse").meta;
    if (
      this.settings.upgradeBuildings.buildings.spaceport.enabled &&
      warehouseMeta.unlocked &&
      warehouseMeta.stage === 0 &&
      mustExist(warehouseMeta.stages)[1].stageUnlocked
    ) {
      const prices = mustExist(warehouseMeta.stages)[1].prices;
      if (this._bulkManager.singleBuildPossible(warehouseMeta, prices, 1)) {
        const button = this.getBuildButton("warehouse", 0);
        if (!isNil(button?.model)) {
          button.controller.sellInternal(button.model, 0, false);
          warehouseMeta.on = 0;
          warehouseMeta.val = 0;
          warehouseMeta.stage = 1;

          this._host.engine.iactivity("upgrade.building.warehouse", [], "ks-upgrade");

          this._host.game.ui?.render();
          this.build("warehouse", 1, 1);
          context.requestGameUiRefresh = true;

          return;
        }
      }
    }

    const amphitheatreMeta = this._host.game.bld.getBuildingExt("amphitheatre").meta;
    // If amphitheathres haven't been upgraded to broadcast towers yet...
    // This seems to be identical to the pasture upgrade.
    if (
      this.settings.upgradeBuildings.buildings.broadcasttower.enabled &&
      amphitheatreMeta.unlocked &&
      amphitheatreMeta.stage === 0 &&
      mustExist(amphitheatreMeta.stages)[1].stageUnlocked
    ) {
      // TODO: This is problematic. Upgrading from 50 amphitheatres to 1 broadcast tower sucks
      //       if you don't have enough resources to build several more.
      const prices = mustExist(amphitheatreMeta.stages)[1].prices;
      if (this._bulkManager.singleBuildPossible(amphitheatreMeta, prices, 1)) {
        const button = this.getBuildButton("amphitheatre", 0);
        if (!isNil(button?.model)) {
          button.controller.sellInternal(button.model, 0, false);
          amphitheatreMeta.on = 0;
          amphitheatreMeta.val = 0;
          amphitheatreMeta.stage = 1;

          this._host.engine.iactivity("upgrade.building.amphitheatre", [], "ks-upgrade");

          this._host.game.ui?.render();
          this.build("amphitheatre", 1, 1);
          context.requestGameUiRefresh = true;
        }
      }
    }
  }

  autoMisc(context: FrameContext) {
    // Auto turn on steamworks
    if (this.settings.turnOnSteamworks.enabled) {
      const steamworks = this._host.game.bld.getBuildingExt("steamworks");
      if (steamworks.meta.val && steamworks.meta.on === 0) {
        const button = mustExist(this.getBuildButton("steamworks"));
        if (isNil(button.model)) {
          return;
        }

        button.controller.onAll(button.model);
      }
    }

    // Auto turn on magnetos
    if (this.settings.turnOnMagnetos.enabled) {
      const magnetos = this._host.game.bld.getBuildingExt("magneto");
      if (magnetos.meta.val && magnetos.meta.on < magnetos.meta.val) {
        const button = mustExist(this.getBuildButton("magneto"));
        if (isNil(button.model)) {
          return;
        }

        button.controller.onAll(button.model);
      }
    }

    // Auto turn on reactors
    if (this.settings.turnOnReactors.enabled) {
      const reactors = this._host.game.bld.getBuildingExt("reactor");
      if (reactors.meta.val && reactors.meta.on < reactors.meta.val) {
        const button = mustExist(this.getBuildButton("reactor"));
        if (isNil(button.model)) {
          return;
        }

        button.controller.onAll(button.model);
      }
    }

    // If buildings (upgrades of bonfire items) are enabled...
    if (this.settings.upgradeBuildings.enabled) {
      this.autoUpgrade(context);
    }

    if (this.settings.gatherCatnip.enabled) {
      this.autoGather();
    }
  }

  autoGather(): void {
    const controller = new classes.game.ui.GatherCatnipButtonController(
      this._host.game,
    ) as GatherCatnipButtonController;
    for (let clicks = 0; clicks < Math.floor(this._host.engine.settings.interval / 20); ++clicks) {
      controller.buyItem(undefined, null);
    }
  }

  build(name: Building, _stage: number | undefined, amount: number): void {
    let amountCalculated = amount;
    const amountTemp = amountCalculated;
    let label: string;
    const itemMetaRaw = game.getUnlockByName(name, "buildings");
    const meta = new classes.BuildingMeta(itemMetaRaw).getMeta();
    if ("stages" in meta) {
      const controller = new classes.ui.btn.StagingBldBtnController(
        this._host.game,
      ) as StagingBldBtnController<UnsafeBuildingBtnModernModel<UnsafeStagingBldButtonOptions>>;
      const model = controller.fetchModel({
        name: mustExist(meta.label),
        description: mustExist(meta.description),
        building: name,
        twoRow: false,
        controller,
      });
      amountCalculated = this._bulkManager.construct(model, controller, amountCalculated);
      label = meta.label ?? "";
    } else {
      const controller = new classes.ui.btn.BuildingBtnModernController(
        this._host.game,
      ) as BuildingBtnModernController<
        UnsafeBuildingBtnModernModel<UnsafeUnstagedBuildingButtonOptions>
      >;
      const model = controller.fetchModel({
        name: mustExist(meta.label),
        description: mustExist(meta.description),
        building: name,
        twoRow: false,
        controller,
      });
      amountCalculated = this._bulkManager.construct(model, controller, amountCalculated);
      label = meta.label ?? "";
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

  private _getBuildLabel(meta: UnsafeBuilding, stage?: number): string {
    return meta.stages && !isNil(stage) ? meta.stages[stage].label : mustExist(meta.label);
  }

  getBuild(name: Building): BuildingMeta<Required<UnsafeBuilding>> {
    return this._host.game.bld.getBuildingExt(name) as BuildingMeta<Required<UnsafeBuilding>>;
  }

  getBuildButton(name: Building, stage = 0) {
    const metaRaw = game.bld.get(name);
    const buildingMeta = (
      new classes.BuildingMeta(metaRaw) as BuildingMeta<UnsafeBuilding>
    ).getMeta();
    const meta = !isNil(buildingMeta.stages) ? buildingMeta.stages[stage] : metaRaw;
    const controller =
      "stages" in meta
        ? (new classes.ui.btn.StagingBldBtnController(
            this._host.game,
          ) as StagingBldBtnController<UnsafeBuildingBtnModernModel>)
        : (new classes.ui.btn.BuildingBtnModernController(
            this._host.game,
          ) as BuildingBtnModernController<UnsafeBuildingBtnModernModel>);
    const model = controller.fetchModel({
      key: name,
      name: meta.label,
      description: meta.description,
      building: name,
    });
    return { model, controller };
  }
}
