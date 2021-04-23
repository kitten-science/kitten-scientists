import { BulkManager } from "./BulkManager";
import { CraftManager } from "./CraftManager";
import { TabManager } from "./TabManager";
import { BuildButton, Building, BuildingExt } from "./types";
import { UserScript } from "./UserScript";

export class BuildManager {
  private readonly _host: UserScript;
  private readonly _manager: TabManager;
  private readonly _crafts: CraftManager;
  private readonly _bulkManager: BulkManager;

  constructor(host: UserScript) {
    this._host = host;
    this._manager = new TabManager(this._host, "Bonfire");
    this._crafts = new CraftManager(this._host);
    this._bulkManager = new BulkManager(this._host);
  }

  build(name: Building, stage: number, amount: number): void {
    const build = this.getBuild(name);
    const button = this.getBuildButton(name, stage);

    if (!button || !button.model.enabled) return;
    const amountTemp = amount;
    const label = build.meta.label ? build.meta.label : build.meta.stages[stage].label;
    amount = this._bulkManager.construct(button.model, button, amount);
    if (amount !== amountTemp) {
      this._host.warning(`${label} Amount ordered: ${amountTemp} Amount Constructed: ${amount}`);
    }
    storeForSummary(label, amount, "build");

    if (amount === 1) {
      this._host.iactivity("act.build", [label], "ks-build");
    } else {
      this._host.iactivity("act.builds", [label, amount], "ks-build");
    }
  }

  getBuild(name: Building): BuildingExt {
    return this._host.gamePage.bld.getBuildingExt(name);
  }

  getBuildButton(name: Building, stage: number | undefined = undefined): BuildButton | null {
    const buttons = this._manager.tab.children;
    const build = this.getBuild(name);
    const label = typeof stage !== "undefined" ? build.meta.stages[stage].label : build.meta.label;

    for (const i in buttons) {
      const haystack = buttons[i].model.name;
      if (haystack.indexOf(label) !== -1) {
        return buttons[i];
      }
    }

    return null;
  }
}
