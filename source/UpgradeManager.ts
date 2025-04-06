import type { KittenScientists } from "./KittenScientists.js";
import type { TabManager } from "./TabManager.js";
import type { Policy, Technology, Upgrade } from "./types/index.js";
import type { PolicyBtnController, TechButtonController } from "./types/science.js";
import type { UpgradeButtonController } from "./types/workshop.js";

export abstract class UpgradeManager {
  protected readonly _host: KittenScientists;
  abstract manager: TabManager;

  constructor(host: KittenScientists) {
    this._host = host;
  }

  upgrade(
    upgrade: { label: string; name: Policy | Upgrade | Technology },
    variant: "policy" | "science" | "workshop",
  ): boolean {
    let success = false;
    if (variant === "policy") {
      const itemMetaRaw = game.getUnlockByName(upgrade.name, "policies");
      const controller = new classes.ui.PolicyBtnController(this._host.game) as PolicyBtnController;
      const model = controller.fetchModel({ controller, id: itemMetaRaw.name });
      success = UpgradeManager.skipConfirm(() => controller.buyItem(model)).itemBought;
    } else if (variant === "science") {
      const itemMetaRaw = game.getUnlockByName(upgrade.name, "tech");
      const controller = new com.nuclearunicorn.game.ui.TechButtonController(
        this._host.game,
      ) as TechButtonController;
      const model = controller.fetchModel({ controller, id: itemMetaRaw.name });
      success = UpgradeManager.skipConfirm(() => controller.buyItem(model)).itemBought;
    } else {
      const itemMetaRaw = game.getUnlockByName(upgrade.name, "upgrades");
      const controller = new com.nuclearunicorn.game.ui.UpgradeButtonController(
        this._host.game,
      ) as UpgradeButtonController;
      const model = controller.fetchModel({ controller, id: itemMetaRaw.name });
      success = UpgradeManager.skipConfirm(() => controller.buyItem(model)).itemBought;
    }

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
  static async skipConfirmAsync<T>(action: () => Promise<T>): Promise<T> {
    const originalConfirm = game.ui.confirm;
    try {
      game.ui.confirm = () => true;
      return await action();
    } finally {
      game.ui.confirm = originalConfirm;
    }
  }
  static skipConfirm<T>(action: () => T): T {
    const originalConfirm = game.ui.confirm;
    try {
      game.ui.confirm = () => true;
      return action();
    } finally {
      game.ui.confirm = originalConfirm;
    }
  }
}
