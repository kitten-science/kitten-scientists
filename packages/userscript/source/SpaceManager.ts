import { BulkManager } from "./BulkManager";
import { SpaceItem, SpaceSettingsItem } from "./options/SpaceSettings";
import { TabManager } from "./TabManager";
import { objectEntries } from "./tools/Entries";
import { BuildButton, SpaceBuildingInfo, SpaceBuildings, SpaceTab } from "./types";
import { UserScript } from "./UserScript";

export class SpaceManager {
  private readonly _host: UserScript;
  readonly manager: TabManager<SpaceTab>;
  private readonly _bulkManager: BulkManager;

  constructor(host: UserScript) {
    this._host = host;
    this.manager = new TabManager(this._host, "Space");
    this._bulkManager = new BulkManager(this._host);
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
