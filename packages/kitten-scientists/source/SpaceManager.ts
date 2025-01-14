import { isNil, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { Automation, FrameContext } from "./Engine.js";
import { KittenScientists } from "./KittenScientists.js";
import { TabManager } from "./TabManager.js";
import { WorkshopManager } from "./WorkshopManager.js";
import { BulkPurchaseHelper } from "./helper/BulkPurchaseHelper.js";
import { SpaceBuildingSetting, SpaceSettings } from "./settings/SpaceSettings.js";
import { cwarn } from "./tools/Log.js";
import {
  BuildButton,
  ButtonModernController,
  ButtonModernModel,
  Mission,
  SpaceBuilding,
  SpaceBuildingInfo,
  SpaceTab,
} from "./types/index.js";

export class SpaceManager implements Automation {
  private readonly _host: KittenScientists;
  readonly settings: SpaceSettings;
  readonly manager: TabManager<SpaceTab>;
  private readonly _bulkManager: BulkPurchaseHelper;
  private readonly _workshopManager: WorkshopManager;

  constructor(
    host: KittenScientists,
    workshopManager: WorkshopManager,
    settings = new SpaceSettings(),
  ) {
    this._host = host;
    this.settings = settings;
    this.manager = new TabManager(this._host, "Space");

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
    const metaData: Partial<Record<SpaceBuilding, SpaceBuildingInfo>> = {};
    for (const build of Object.values(builds)) {
      metaData[build.building] = this.getBuild(build.building);
    }

    // Let the bulkmanager determine the builds we can make.
    const buildList = bulkManager.bulk(builds, metaData, sectionTrigger, "Space");

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

  autoUnlock(context: FrameContext) {
    if (!this._host.game.tabs[6].visible) {
      return;
    }

    const missions = this._host.game.space.meta[0].meta;
    missionLoop: for (let i = 0; i < missions.length; i++) {
      // If the mission is already purchased or not available yet, continue with the next one.
      if (
        0 < missions[i].val ||
        !missions[i].unlocked ||
        !this.settings.unlockMissions.missions[missions[i].name as Mission].enabled
      ) {
        continue;
      }

      const model = this.manager.tab.GCPanel?.children[i];
      if (isNil(model)) {
        return;
      }

      const prices = mustExist(model.model?.prices);
      for (const resource of prices) {
        // If we can't afford this resource price, continue with the next mission.
        if (this._workshopManager.getValueAvailable(resource.name) < resource.val) {
          continue missionLoop;
        }
      }

      // Start the mission by clicking the button.
      // TODO: Move this into the SpaceManager?
      model.domNode.click();
      context.requestGameUiRefresh = true;
      if (i === 7 || i === 12) {
        this._host.engine.iactivity("upgrade.space.mission", [missions[i].label], "ks-upgrade");
      } else {
        this._host.engine.iactivity("upgrade.space", [missions[i].label], "ks-upgrade");
      }
    }
  }

  build(name: SpaceBuilding, amount: number): number {
    const build = this.getBuild(name);

    const button = this._getBuildButton(name);

    if (!build.unlocked || !button?.model || !this.settings.buildings[name].enabled) {
      return 0;
    }

    if (!button.model.enabled) {
      return 0;
    }

    const amountTemp = amount;
    const label = build.label;
    amount = this._bulkManager.construct(button.model, button, amount);
    if (amount !== amountTemp) {
      cwarn(`${label} Amount ordered: ${amountTemp} Amount Constructed: ${amount}`);
    }
    this._host.engine.storeForSummary(label, amount, "build");

    if (amount === 1) {
      this._host.engine.iactivity("act.build", [label], "ks-build");
    } else {
      this._host.engine.iactivity(
        "act.builds",
        [label, this._host.renderAbsolute(amount)],
        "ks-build",
      );
    }

    return amount;
  }

  getBuild(name: SpaceBuilding): SpaceBuildingInfo {
    return this._host.game.space.getBuilding(name);
  }

  private _getBuildButton(
    id: string,
  ): BuildButton<string, ButtonModernModel, ButtonModernController> | null {
    const panels = this.manager.tab.planetPanels;

    if (isNil(panels)) {
      return null;
    }

    for (const panel of panels) {
      const button = panel.children.find(child => child.id === id);
      if (!isNil(button)) {
        return button as BuildButton<string, ButtonModernModel, ButtonModernController>;
      }
    }

    return null;
  }
}
