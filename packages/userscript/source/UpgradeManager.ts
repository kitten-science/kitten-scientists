import { ScienceManager } from "./ScienceManager";
import { SpaceManager } from "./SpaceManager";
import { mustExist } from "./tools/Maybe";
import { BuildButton } from "./types";
import { UserScript } from "./UserScript";
import { WorkshopManager } from "./WorkshopManager";

export class UpgradeManager {
  private readonly _host: UserScript;
  readonly scienceManager: ScienceManager;
  readonly spaceManager: SpaceManager;
  readonly workshopManager: WorkshopManager;

  constructor(host: UserScript) {
    this._host = host;
    this.scienceManager = new ScienceManager(this._host);
    this.spaceManager = new SpaceManager(this._host);
    this.workshopManager = new WorkshopManager(this._host);
  }

  build(upgrade: { label: string }, variant: "policy" | "science" | "workshop"): void {
    const button = this.getBuildButton(upgrade, variant);

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

  getBuildButton(
    upgrade: { label: string },
    variant: "policy" | "science" | "workshop"
  ): BuildButton | null {
    let buttons;
    if (variant === "workshop") {
      buttons = this.workshopManager.manager.tab.buttons;
    } else if (variant === "policy") {
      buttons = this.scienceManager.manager.tab.policyPanel.children;
    } else if (variant === "science") {
      buttons = this.scienceManager.manager.tab.buttons;
    }

    for (const button of mustExist(buttons)) {
      if (button.model.name === upgrade.label) {
        return button;
      }
    }
    return null;
  }
}
