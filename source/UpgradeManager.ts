import type { KittenScientists } from "./KittenScientists.js";
import type { TabManager } from "./TabManager.js";
import { cwarn } from "./tools/Log.js";
import type { BuildButton, Policy, ScienceTab, Technology, Upgrade, UpgradeInfo } from "./types/index.js";

export abstract class UpgradeManager {
  protected readonly _host: KittenScientists;
  abstract manager: TabManager;

  constructor(host: KittenScientists) {
    this._host = host;
  }

  async upgrade(
    upgrade: { label: string; name: Policy | Upgrade | Technology },
    variant: "policy" | "science" | "workshop",
  ): Promise<boolean> {
    const button = this._getUpgradeButton(upgrade, variant);

    if (!button || !button.model) {
      return false;
    }

    if (!button.model.enabled) {
      cwarn(`${button.model.name} Upgrade request on disabled button!`);
      button.render();
      return false;
    }

    const controller =
      variant === "policy"
        ? new classes.ui.PolicyBtnController(this._host.game)
        : new com.nuclearunicorn.game.ui.TechButtonController(this._host.game);

    this._host.game.opts.noConfirm = true;
    const success = await UpgradeManager.skipConfirm(
      () =>
        new Promise(resolve => {
          const buyResult = controller.buyItem(button.model, new MouseEvent("click"));

          if (buyResult.def !== undefined) {
            buyResult.def.then(resolve);
          } else {
            resolve(buyResult.itemBought);
          }
        }),
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
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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

  private _getUpgradeButton(
    upgrade: { name: Policy | Upgrade | Technology },
    variant: "policy" | "science" | "workshop",
  ): BuildButton | null {
    let buttons: Array<BuildButton> | undefined;
    if (variant === "workshop") {
      buttons = this.manager.tab.buttons;
    } else if (variant === "policy") {
      buttons = (this.manager.tab as ScienceTab).policyPanel.children;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (variant === "science") {
      buttons = this.manager.tab.buttons;
    }

    return (buttons?.find(button => button.id === upgrade.name) ?? null) as BuildButton | null;
  }
}
