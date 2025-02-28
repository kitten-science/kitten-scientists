import { cwarn } from "./tools/Log.js";
export class UpgradeManager {
  _host;
  constructor(host) {
    this._host = host;
  }
  async upgrade(upgrade, variant) {
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
          controller.buyItem(button.model, new MouseEvent("click"), resolve);
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
  static async skipConfirm(action) {
    const originalConfirm = game.ui.confirm;
    try {
      game.ui.confirm = () => true;
      return await action();
    } finally {
      game.ui.confirm = originalConfirm;
    }
  }
  _getUpgradeButton(upgrade, variant) {
    let buttons;
    if (variant === "workshop") {
      buttons = this.manager.tab.buttons;
    } else if (variant === "policy") {
      buttons = this.manager.tab.policyPanel.children;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (variant === "science") {
      buttons = this.manager.tab.buttons;
    }
    return buttons?.find(button => button.model?.name === upgrade.label) ?? null;
  }
}
//# sourceMappingURL=UpgradeManager.js.map
