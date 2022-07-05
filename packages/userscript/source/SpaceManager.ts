import { BulkManager } from "./BulkManager";
import { SpaceItem, SpaceSettingsItem } from "./options/SpaceSettings";
import { TabManager } from "./TabManager";
import { objectEntries } from "./tools/Entries";
import { BuildButton, SpaceBuildingInfo, SpaceBuildings, SpaceTab } from "./types";
import { UserScript } from "./UserScript";
import { WorkshopManager } from "./WorkshopManager";

export class SpaceManager {
  private readonly _host: UserScript;
  readonly manager: TabManager<SpaceTab>;
  private readonly _bulkManager: BulkManager;
  private readonly _workshopManager: WorkshopManager;

  constructor(host: UserScript) {
    this._host = host;
    this.manager = new TabManager(this._host, "Space");
    this._bulkManager = new BulkManager(this._host);
    this._workshopManager = new WorkshopManager(this._host);
  }

  /**
   * Try to build as many of the passed buildings as possible.
   * Usually, this is called at each iteration of the automation engine to
   * handle the building of items on the Space tab.
   *
   * @param builds The buildings to build.
   */
  autoBuild(
    builds: Partial<Record<SpaceItem, SpaceSettingsItem>> = this._host.options.auto.space.items
  ) {
    // TODO: Refactor. See BonfireManager.autoBuild
    const bulkManager = this._bulkManager;
    const trigger = this._host.options.auto.space.trigger;

    // Render the tab to make sure that the buttons actually exist in the DOM.
    // TODO: Is this really required?
    this.manager.render();

    // Get the current metadata for all the referenced buildings.
    const metaData: Partial<Record<SpaceItem, SpaceBuildingInfo>> = {};
    for (const [name] of objectEntries(builds)) {
      metaData[name] = this.getBuild(name);
    }

    // Let the bulkmanager determine the builds we can make.
    const buildList = bulkManager.bulk(builds, metaData, trigger, "space");

    let refreshRequired = false;
    // Build all entries in the build list, where we can build any items.
    for (const build of buildList) {
      if (build.count > 0) {
        this.build(build.id as SpaceBuildings, build.count);
        refreshRequired = true;
      }
    }

    if (refreshRequired) {
      this._host.gamePage.ui.render();
    }
  }

  autoUnlock() {
    this.manager.render();

    const missions = this._host.gamePage.space.meta[0].meta;
    missionLoop: for (let i = 0; i < missions.length; i++) {
      // If the mission is already purchased or not available yet, continue with the next one.
      if (0 < missions[i].val || !missions[i].unlocked) {
        continue;
      }

      const model = this.manager.tab.GCPanel.children[i];
      const prices = model.model.prices;
      for (const resource of prices) {
        // If we can't afford this resource price, continue with the next mission.
        if (this._workshopManager.getValueAvailable(resource.name, true) < resource.val) {
          continue missionLoop;
        }
      }

      // Start the mission by clicking the button.
      // TODO: Move this into the SpaceManager?
      model.domNode.click();
      if (i === 7 || i === 12) {
        this._host.iactivity("upgrade.space.mission", [missions[i].label], "ks-upgrade");
      } else {
        this._host.iactivity("upgrade.space", [missions[i].label], "ks-upgrade");
      }
    }
  }

  build(name: SpaceItem, amount: number): void {
    const build = this.getBuild(name);
    const button = this.getBuildButton(name);

    if (
      !build.unlocked ||
      !button ||
      !button.model.enabled ||
      !this._host.options.auto.space.items[name].enabled
    ) {
      return;
    }

    const amountTemp = amount;
    const label = build.label;
    amount = this._bulkManager.construct(button.model, button, amount);
    if (amount !== amountTemp) {
      this._host.warning(`${label} Amount ordered: ${amountTemp} Amount Constructed: ${amount}`);
    }
    this._host.storeForSummary(label, amount, "build");

    if (amount === 1) {
      this._host.iactivity("act.build", [label], "ks-build");
    } else {
      this._host.iactivity("act.builds", [label, amount], "ks-build");
    }
  }

  getBuild(name: SpaceItem): SpaceBuildingInfo {
    return this._host.gamePage.space.getBuilding(name);
  }

  getBuildButton(name: string): BuildButton | null {
    const panels = this.manager.tab.planetPanels;

    for (const panel of panels) {
      for (const child of panel.children) {
        if (child.id === name) return child;
      }
    }

    return null;
  }
}
