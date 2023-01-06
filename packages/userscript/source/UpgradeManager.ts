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

    this._host.gamePage.opts.noConfirm = true;
    const success = await UpgradeManager.skipConfirm(
      () =>
        new Promise(resolve => controller.buyItem(button.model, new MouseEvent("click"), resolve))
    );

    if (!success) {
      return false;
    }

    const label = upgrade.label;

    if (variant === "workshop") {
      this._host.engine.storeForSummary(label, 1, "upgrade");
      this._host.engine.iactivity("upgrade.upgrade", [label], "ks-upgrade");
    } else if (variant === "policy") {
      this._host.engine.iactivity("upgrade.policy", [label]);
    } else if (variant === "science") {
      this._host.engine.storeForSummary(label, 1, "research");
      this._host.engine.iactivity("upgrade.tech", [label], "ks-research");
    }

    return true;
  }

  /**
   * Run a piece of code that might invoke UI confirmation and
   * skip that UI confirmation.
   *
   * @param action The function to run without UI confirmation.
   * @returns Whatever `action` returns.
   */
  static async skipConfirm<T>(action: () => Promise<T>): Promise<T> {
    const originalConfirm = game.ui.confirm;
    try {
      game.ui.confirm = () => true;
      return await action();
    } finally {
      game.ui.confirm = originalConfirm;
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
