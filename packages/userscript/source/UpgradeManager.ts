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

  async upgrade(
    upgrade: { label: string },
    variant: "policy" | "science" | "workshop"
  ): Promise<boolean> {
    const button = this.getUpgradeButton(upgrade, variant);

    if (!button || !button.model.enabled) {
      return false;
    }

    const controller =
      variant === "policy"
        ? new classes.ui.PolicyBtnController(this._host.gamePage)
        : new com.nuclearunicorn.game.ui.TechButtonController(this._host.gamePage);

    // Ensure `noConfirm` is set for the purchasing, as that might invoke `confirm()`
    // in the game.
    const noConfirm = (this._host.gamePage.opts.noConfirm = true);
    this._host.gamePage.opts.noConfirm = true;
    const success = await new Promise(resolve =>
      controller.buyItem(button.model, undefined, resolve)
    );
    this._host.gamePage.opts.noConfirm = noConfirm;

    if (!success) {
      return false;
    }

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

    return true;
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
