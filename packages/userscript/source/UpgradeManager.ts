import { BulkManager } from "./BulkManager";
import { CraftManager } from "./CraftManager";
import { TabManager } from "./TabManager";
import { BuildButton } from "./types";
import { UserScript } from "./UserScript";

export class UpgradeManager {
  private readonly _host: UserScript;
  readonly scienceManager: TabManager;
  readonly spaceManager: TabManager;
  readonly workshopManager: TabManager;
  private readonly _crafts: CraftManager;
  private readonly _bulkManager: BulkManager;

  constructor(host: UserScript) {
    this._host = host;
    this.scienceManager = new TabManager(this._host, "Science");
    this.spaceManager = new TabManager(this._host, "Space");
    this.workshopManager = new TabManager(this._host, "Workshop");
    this._crafts = new CraftManager(this._host);
    this._bulkManager = new BulkManager(this._host);
  }

  build(upgrade: { label: string }, variant: "science" | "workshop"): void {
    const button = this.getBuildButton(upgrade, variant);

    if (!button || !button.model.enabled) return;

    //need to simulate a click so the game updates everything properly
    button.domNode.click();
    const label = upgrade.label;

    if (variant === "workshop") {
      this._host.storeForSummary(label, 1, "upgrade");
      this._host.iactivity("upgrade.upgrade", [label], "ks-upgrade");
    } else {
      this._host.storeForSummary(label, 1, "research");
      this._host.iactivity("upgrade.tech", [label], "ks-research");
    }
  }

  getBuildButton(upgrade: { label: string }, variant: "science" | "workshop"): BuildButton | null {
    let buttons;
    if (variant === "workshop") {
      buttons = this.workshopManager.tab.buttons;
    } else if (variant === "science") {
      buttons = this.scienceManager.tab.buttons;
    } else {
      throw new Error(`Unexpected variant '${variant}'`);
    }

    for (const i in buttons) {
      const haystack = buttons[i].model.name;
      if (haystack === upgrade.label) {
        return buttons[i];
      }
    }
    return null;
  }
}
