import { TabManager } from "./TabManager";
import { mustExist } from "./tools/Maybe";
import { BuildButton, ScienceTab } from "./types";
import { UserScript } from "./UserScript";

export abstract class UpgradeManager {
  protected readonly _host: UserScript;
  abstract manager: TabManager;

  constructor(host: UserScript) {
    this._host = host;
  }

  upgrade(upgrade: { label: string }, variant: "policy" | "science" | "workshop"): void {
    const button = this.getUpgradeButton(upgrade, variant);

    if (!button || !button.model.enabled) return;

    //need to simulate a click so the game updates everything properly
    button.domNode.click();
    const label = upgrade.label;

    if (variant === "workshop") {
      this._host.storeForSummary(label, 1, "upgrade");
      this._host.iactivity("upgrade.upgrade", [label], "ks-upgrade");
    } else if (variant === "policy") {
      this._host.iactivity("upgrade.policy", [label]);
    } else if (variant === "science") {
      this._host.storeForSummary(label, 1, "research");
      this._host.iactivity("upgrade.tech", [label], "ks-research");
    }
  }

  getUpgradeButton(
    upgrade: { label: string },
    variant: "policy" | "science" | "workshop"
  ): BuildButton | null {
    let buttons;
    if (variant === "workshop") {
      buttons = this.manager.tab.buttons;
    } else if (variant === "policy") {
      buttons = (this.manager.tab as ScienceTab).policyPanel.children;
    } else if (variant === "science") {
      buttons = this.manager.tab.buttons;
    }

    for (const button of mustExist(buttons)) {
      if (button.model.name === upgrade.label) {
        return button;
      }
    }
    return null;
  }
}
