import { BulkManager } from "./BulkManager";
import { BonfireItem, BonfireSettingsItem } from "./options/BonfireSettings";
import { TabManager } from "./TabManager";
import { objectEntries } from "./tools/Entries";
import { isNil, mustExist } from "./tools/Maybe";
import { BuildButton, Building, BuildingExt, BuildingMeta, GameTab } from "./types";
import { UserScript } from "./UserScript";

export type BonfireTab = GameTab;

export class BonfireManager {
  private readonly _host: UserScript;
  readonly manager: TabManager<BonfireTab>;
  private readonly _bulkManager: BulkManager;

  constructor(host: UserScript) {
    this._host = host;
    this.manager = new TabManager<BonfireTab>(this._host, "Bonfire");
    this._bulkManager = new BulkManager(this._host);
  }

  /**
   * Try to build as many of the passed buildings as possible.
   * Usually, this is called at each iteration of the automation engine to
   * handle the building of items on the Bonfire tab.
   *
   * @param builds The buildings to build.
   */
  autoBuild(
    builds: Partial<Record<BonfireItem, BonfireSettingsItem>> = this._host.options.auto.build.items
  ) {
    // TODO: Refactor. See SpaceManager.autoBuild
    const bulkManager = this._bulkManager;
    const trigger = this._host.options.auto.build.trigger;

    // Render the tab to make sure that the buttons actually exist in the DOM.
    // TODO: Is this really required?
    this.manager.render();

    // Get the current metadata for all the referenced buildings.
    const metaData: Partial<Record<BonfireItem, BuildingMeta>> = {};
    for (const [name, build] of objectEntries(builds)) {
      metaData[name] = this.getBuild((build.name ?? name) as Building).meta;
    }

    // Let the bulkmanager determine the builds we can make.
    const buildList = bulkManager.bulk(builds, metaData, trigger, "bonfire");

    let refreshRequired = false;
    // Build all entries in the build list, where we can build any items.
    for (const build of buildList) {
      if (build.count > 0) {
        this.build((build.name || build.id) as Building, build.stage, build.count);
        refreshRequired = true;
      }
    }

    if (refreshRequired) {
      this._host.gamePage.ui.render();
    }
  }

  build(name: Building, stage: number | undefined, amount: number): void {
    const build = this.getBuild(name);
    const button = this.getBuildButton(name, stage);

    if (!button || !button.model.enabled) {
      return;
    }
    const amountTemp = amount;
    const label = this._getBuildLabel(build.meta, stage);
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

  private _getBuildLabel(meta: BuildingMeta, stage?: number): string {
    return meta.stages && !isNil(stage) ? meta.stages[stage].label : mustExist(meta.label);
  }

  getBuild(name: Building): BuildingExt {
    return this._host.gamePage.bld.getBuildingExt(name);
  }

  getBuildButton(name: Building, stage?: number): BuildButton | null {
    const buttons = this.manager.tab.children;
    const build = this.getBuild(name);
    const label = this._getBuildLabel(build.meta, stage);

    for (const button of buttons) {
      const haystack = button.model.name;
      if (haystack.indexOf(label) !== -1) {
        return button;
      }
    }

    return null;
  }
}
