import { mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { InvalidArgumentError } from "@oliversalzburg/js-utils/errors/InvalidArgumentError.js";
import type { KittenScientists } from "./KittenScientists.js";
import type { TabManager } from "./TabManager.js";
import { cwarn } from "./tools/Log.js";
import type { BuildingResearchBtn, UnsafeBuildingBtnModel } from "./types/core.js";
import type { Policy, Technology, Upgrade } from "./types/index.js";
import type {
  Library,
  PolicyBtnController,
  PolicyPanel,
  TechButtonController,
  UnsafePolicy,
} from "./types/science.js";
import type { Workshop } from "./types/workshop.js";

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
    const button =
      variant === "policy"
        ? this._getUpgradeButtonPolicy(upgrade.name as Policy)
        : variant === "science"
          ? this._getUpgradeButtonScience(upgrade.name as Technology)
          : this._getUpgradeButtonWorkshop(upgrade.name as Upgrade);

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
        ? (new classes.ui.PolicyBtnController(this._host.game) as PolicyBtnController)
        : (new com.nuclearunicorn.game.ui.TechButtonController(
            this._host.game,
          ) as TechButtonController);

    this._host.game.opts.noConfirm = true;
    const success = UpgradeManager.skipConfirm(() =>
      controller.buyItem(mustExist(button.model), new MouseEvent("click")),
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

  private _getUpgradeButtonScience(upgrade: Technology) {
    return mustExist((this.manager.tab as Library).buttons?.find(button => button.id === upgrade));
  }
  private _getUpgradeButtonPolicy(upgrade: Policy) {
    return (
      (this.manager.tab as Library).policyPanel?.children?.find(button => button.id === upgrade) ??
      null
    );
  }
  private _getUpgradeButtonWorkshop(upgrade: Upgrade) {
    return (this.manager.tab as Workshop).buttons?.find(button => button.id === upgrade) ?? null;
  }
}
