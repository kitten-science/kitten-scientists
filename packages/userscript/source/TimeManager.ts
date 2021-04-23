import { BulkManager } from "./BulkManager";
import { CraftManager } from "./CraftManager";
import { TabManager } from "./TabManager";
import { BuildButton } from "./types";
import { UserScript } from "./UserScript";

export class TimeManager {
  private readonly _host: UserScript;
  readonly manager: TabManager;
  private readonly _crafts: CraftManager;
  private readonly _bulkManager: BulkManager;

  constructor(host: UserScript) {
    this._host = host;
    this.manager = new TabManager(this._host, "Time");
    this._crafts = new CraftManager(this._host);
    this._bulkManager = new BulkManager(this._host);
  }

  build(name: string, variant: unknown, amount: number): void {
    const build = this.getBuild(name, variant);
    const button = this.getBuildButton(name, variant);

    if (!button || !button.model.enabled) return;

    const amountTemp = amount;
    const label = build.label;
    amount = this._bulkManager.construct(button.model, button, amount);
    if (amount !== amountTemp) {
      this._host.warning(
        label + " Amount ordered: " + amountTemp + " Amount Constructed: " + amount
      );
    }
    this._host.storeForSummary(label, amount, "build");

    if (amount === 1) {
      this._host.iactivity("act.build", [label], "ks-build");
    } else {
      this._host.iactivity("act.builds", [label, amount], "ks-build");
    }
  }

  getBuild(name: string, variant: unknown): unknown {
    if (variant === "chrono") {
      return this._host.gamePage.time.getCFU(name);
    } else {
      return this._host.gamePage.time.getVSU(name);
    }
  }

  getBuildButton(name: string, variant: unknown): BuildButton | null {
    let buttons;
    if (variant === "chrono") {
      buttons = this.manager.tab.children[2].children[0].children;
    } else {
      buttons = this.manager.tab.children[3].children[0].children;
    }
    const build = this.getBuild(name, variant);
    for (const i in buttons) {
      const haystack = buttons[i].model.name;
      if (haystack.indexOf(build.label) !== -1) {
        return buttons[i];
      }
    }
    return null;
  }
}
