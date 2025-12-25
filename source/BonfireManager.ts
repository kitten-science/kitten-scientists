import { isNil, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import type { Automation, FrameContext } from "./Engine.js";
import { BulkPurchaseHelper, type ConcreteBuild } from "./helper/BulkPurchaseHelper.js";
import type { KittenScientists } from "./KittenScientists.js";
import {
  type BonfireBuildingSetting,
  type BonfireItem,
  BonfireSettings,
} from "./settings/BonfireSettings.js";
import { cl } from "./tools/Log.js";
import type {
  BuildingBtnModernController,
  BuildingMeta,
  StagingBldBtnController,
  UnsafeBuilding,
  UnsafeStagingBldButtonOptions,
  UnsafeUnstagedBuildingButtonOptions,
} from "./types/buildings.js";
import type { UnsafeBuildingBtnModernModel } from "./types/core.js";
import type { Building } from "./types/index.js";
import type { WorkshopManager } from "./WorkshopManager.js";

export class BonfireManager implements Automation {
  private readonly _host: KittenScientists;
  readonly settings: BonfireSettings;
  private readonly _bulkManager: BulkPurchaseHelper;
  private readonly _workshopManager: WorkshopManager;

  constructor(
    host: KittenScientists,
    workshopManager: WorkshopManager,
    settings = new BonfireSettings(),
  ) {
    this._host = host;
    this.settings = settings;

    this._workshopManager = workshopManager;
    this._bulkManager = new BulkPurchaseHelper(this._host, this._workshopManager);
  }

  tick(context: FrameContext) {
    if (!this.settings.enabled) {
      return;
    }

    this._bulkManager.resetPriceCache();
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
    // Get the current metadata for all the referenced buildings.
    const metaData: Partial<Record<BonfireItem, Required<UnsafeBuilding>>> = {};
    for (const build of Object.values(builds)) {
      metaData[build.building] = this._host.game.bld.getBuildingExt(
        (build.baseBuilding ?? build.building) as Building,
      ).meta as Required<UnsafeBuilding>;
    }
    const sectionTrigger = this.settings.trigger;

    const builder = (build: ConcreteBuild) => {
      this.build((build.name || build.id) as Building, build.stage ?? undefined, build.count);
    };
    context.purchaseOrders.push({ builder, builds, metaData, sectionTrigger });
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
        if (this._bulkManager.singleBuildPossible("pasture")) {
          const button = this.getBuild("pasture", 0);
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
        if (this._bulkManager.singleBuildPossible("aqueduct")) {
          const button = this.getBuild("aqueduct", 0);
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
        if (this._bulkManager.singleBuildPossible("library")) {
          const button = mustExist(this.getBuild("library", 0));
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
      if (this._bulkManager.singleBuildPossible("warehouse")) {
        const button = this.getBuild("warehouse", 0);
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
      if (this._bulkManager.singleBuildPossible("amphitheatre")) {
        const button = this.getBuild("amphitheatre", 0);
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
        const button = this.getBuild("steamworks");
        button.controller.onAll(button.model);
      }
    }

    // Auto turn on magnetos
    if (this.settings.turnOnMagnetos.enabled) {
      const magnetos = this._host.game.bld.getBuildingExt("magneto");
      if (magnetos.meta.val && magnetos.meta.on < magnetos.meta.val) {
        const button = this.getBuild("magneto");
        button.controller.onAll(button.model);
      }
    }

    // Auto turn on reactors
    if (this.settings.turnOnReactors.enabled) {
      const reactors = this._host.game.bld.getBuildingExt("reactor");
      if (reactors.meta.val && reactors.meta.on < reactors.meta.val) {
        const button = this.getBuild("reactor");
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
    for (let clicks = 0; clicks < Math.floor(this._host.engine.settings.interval / 20); ++clicks) {
      this._host.game.bld.gatherCatnip();
    }
  }

  build(name: Building, _stage: number | undefined, amount: number): void {
    let amountConstructed = 0;
    let label: string;
    const itemMetaRaw = game.getUnlockByName(name, "buildings");
    const meta = new classes.BuildingMeta(itemMetaRaw).getMeta();
    if ("stages" in meta) {
      const controller = new classes.ui.btn.StagingBldBtnController(
        this._host.game,
      ) as StagingBldBtnController<UnsafeBuildingBtnModernModel<UnsafeStagingBldButtonOptions>>;
      const model = controller.fetchModel({
        building: name,
        controller,
        description: mustExist(meta.description),
        name: mustExist(meta.label),
        twoRow: false,
      });
      amountConstructed = this._bulkManager.construct(model, controller, amount);
      label = meta.label ?? "";
    } else {
      const controller = new classes.ui.btn.BuildingBtnModernController(
        this._host.game,
      ) as BuildingBtnModernController<
        UnsafeBuildingBtnModernModel<UnsafeUnstagedBuildingButtonOptions>
      >;
      const model = controller.fetchModel({
        building: name,
        controller,
        description: mustExist(meta.description),
        name: mustExist(meta.label),
        twoRow: false,
      });
      amountConstructed = this._bulkManager.construct(model, controller, amount);
      label = meta.label ?? "";
    }

    if (amount !== amountConstructed) {
      console.warn(
        ...cl(`${label} Amount ordered: ${amount} Amount Constructed: ${amountConstructed}`),
      );
      // Bail out to not flood the log with garbage.
      if (amountConstructed === 0) {
        return;
      }
    }
    this._host.engine.storeForSummary(label, amountConstructed, "build");

    if (amountConstructed === 1) {
      this._host.engine.iactivity("act.build", [label], "ks-build");
    } else {
      this._host.engine.iactivity(
        "act.builds",
        [label, this._host.renderAbsolute(amountConstructed)],
        "ks-build",
      );
    }
  }

  getBuild(name: Building, stage = 0) {
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
      building: name,
      description: meta.description,
      key: name,
      name: meta.label,
    });
    return { controller, model };
  }
}
