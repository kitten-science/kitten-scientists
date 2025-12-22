import { mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import type { Automation, FrameContext } from "./Engine.js";
import { BulkPurchaseHelper } from "./helper/BulkPurchaseHelper.js";
import type { KittenScientists } from "./KittenScientists.js";
import { type SpaceBuildingSetting, SpaceSettings } from "./settings/SpaceSettings.js";
import { cl } from "./tools/Log.js";
import type { Mission, SpaceBuilding } from "./types/index.js";
import type { UnsafeSpaceBuilding, UnsafeSpaceProgram } from "./types/space.js";
import type { WorkshopManager } from "./WorkshopManager.js";

export class SpaceManager implements Automation {
  private readonly _host: KittenScientists;
  readonly settings: SpaceSettings;
  private readonly _bulkManager: BulkPurchaseHelper;
  private readonly _workshopManager: WorkshopManager;

  constructor(
    host: KittenScientists,
    workshopManager: WorkshopManager,
    settings = new SpaceSettings(),
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

    this.autoBuild(context);

    if (this.settings.unlockMissions.enabled) {
      this.autoUnlock(context);
    }
  }

  /**
   * Try to build as many of the passed buildings as possible.
   * Usually, this is called at each iteration of the automation engine to
   * handle the building of items on the Space tab.
   *
   * @param builds The buildings to build.
   */
  autoBuild(
    context: FrameContext,
    builds: Partial<Record<SpaceBuilding, SpaceBuildingSetting>> = this.settings.buildings,
  ) {
    const bulkManager = this._bulkManager;
    const sectionTrigger = this.settings.trigger;

    // Get the current metadata for all the referenced buildings.
    const metaData: Partial<Record<SpaceBuilding, Required<UnsafeSpaceBuilding>>> = {};
    for (const build of Object.values(builds)) {
      metaData[build.building] = this._host.game.space.getBuilding(build.building);
    }

    // Let the bulkmanager determine the builds we can make.
    const buildList = bulkManager.bulk(builds, metaData, sectionTrigger);

    // Build all entries in the build list, where we can build any items.
    for (const build of buildList) {
      if (build.count <= 0) {
        continue;
      }
      if (0 === this.build(build.id as SpaceBuilding, build.count)) {
        continue;
      }
      context.requestGameUiRefresh = true;
    }
  }

  autoUnlock(_context: FrameContext) {
    if (!this._host.game.tabs[6].visible) {
      return;
    }

    const missions = this._host.game.space.meta[0].meta as Array<Required<UnsafeSpaceProgram>>;
    missionLoop: for (let i = 0; i < missions.length; i++) {
      // If the mission is already purchased or not available yet, continue with the next one.
      if (
        0 < missions[i].val ||
        !missions[i].unlocked ||
        !this.settings.unlockMissions.missions[missions[i].name as Mission].enabled
      ) {
        continue;
      }

      const button = this._host.game.time.queue.getQueueElementControllerAndModel({
        name: missions[i].name,
        type: "spaceMission",
      });

      const prices = mustExist(button.model.prices);
      for (const resource of prices) {
        // If we can't afford this resource price, continue with the next mission.
        if (this._workshopManager.getValueAvailable(resource.name) < resource.val) {
          continue missionLoop;
        }
      }

      // Start mission.
      button.controller.buyItem(button.model);

      if (i === 7 || i === 12) {
        this._host.engine.iactivity("upgrade.space.mission", [missions[i].label], "ks-upgrade");
      } else {
        this._host.engine.iactivity("upgrade.space", [missions[i].label], "ks-upgrade");
      }
    }
  }

  build(name: SpaceBuilding, amount: number): number {
    let amountConstructed = 0;
    let label: string;
    const button = this._host.game.time.queue.getQueueElementControllerAndModel({
      name,
      type: "spaceBuilding",
    });

    const itemMetaRaw = game.getUnlockByName(name, "spaceBuilding");
    label = itemMetaRaw.label;

    const controller = button.controller;
    const model = button.model;
    amountConstructed = this._bulkManager.construct(model, controller, amount);

    if (amount !== amountConstructed) {
      console.warn(
        ...cl(`${label} Amount ordered: ${amount} Amount Constructed: ${amountConstructed}`),
      );
      // Bail out to not flood the log with garbage.
      if (amountConstructed === 0) {
        return 0;
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

    return amountConstructed;
  }
}
