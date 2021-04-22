import { BulkManager } from "./BulkManager";
import { CraftManager } from "./CraftManager";
import { TabManager } from "./TabManager";
import { BuildButton } from "./types";
import { UserScript } from "./UserScript";

export class ReligionManager {
  private readonly _host: UserScript;
  private readonly _manager: TabManager;
  private readonly _crafts: CraftManager;
  private readonly _bulkManager: BulkManager;

  constructor(host: UserScript) {
    this._host = host;
    this._manager = new TabManager(this._host, "Religion");
    this._crafts = new CraftManager(this._host);
    this._bulkManager = new BulkManager(this._host);
  }

  build(name: string, variant: "c" | "s" | "z", amount: number): void {
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

    if (variant === "s") {
      storeForSummary(label, amount, "faith");
      if (amount === 1) {
        this._host.iactivity("act.sun.discover", [label], "ks-faith");
      } else {
        this._host.iactivity("act.sun.discovers", [label, amount], "ks-faith");
      }
    } else {
      storeForSummary(label, amount, "build");
      if (amount === 1) {
        this._host.iactivity("act.build", [label], "ks-build");
      } else {
        this._host.iactivity("act.builds", [label, amount], "ks-build");
      }
    }
  }

  getBuild(name: string, variant: "c" | "s" | "z"): unknown {
    switch (variant) {
      case "z":
        return this._host.gamePage.religion.getZU(name);
      case "s":
        return this._host.gamePage.religion.getRU(name);
      case "c":
        return this._host.gamePage.religion.getTU(name);
    }
  }

  getBuildButton(name: string, variant: "c" | "s" | "z"): BuildButton | null {
    let buttons;
    switch (variant) {
      case "z":
        buttons = this._manager.tab.zgUpgradeButtons;
        break;
      case "s":
        buttons = this._manager.tab.rUpgradeButtons;
        break;
      case "c":
        buttons = this._manager.tab.children[0].children[0].children;
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
