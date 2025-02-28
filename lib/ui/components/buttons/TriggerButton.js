import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { InvalidOperationError } from "@oliversalzburg/js-utils/errors/InvalidOperationError.js";
import { Icons } from "../../../images/Icons.js";
import { SettingTrigger } from "../../../settings/Settings.js";
import { Button } from "../Button.js";
export class TriggerButton extends Button {
  behavior;
  setting;
  _onRefreshTitle;
  constructor(host, setting, _locale, options) {
    super(host, "", Icons.Trigger, options);
    this._onRefreshTitle = options?.onRefreshTitle;
    this.behavior = setting instanceof SettingTrigger ? "percentage" : "integer";
    if (isNil(options?.onClick)) {
      throw new InvalidOperationError("Missing click handler on TriggerButton.");
    }
    this.setting = setting;
  }
  refreshUi() {
    super.refreshUi();
    if (this._onRefreshTitle) {
      this._onRefreshTitle(this);
      return;
    }
    const triggerValue =
      this.behavior === "integer"
        ? this._host.renderAbsolute(this.setting.trigger, "invariant")
        : this._host.renderPercentage(this.setting.trigger, "invariant", true);
    this.updateTitle(this._host.engine.i18n("ui.trigger", [triggerValue]));
    this.updateLabel(triggerValue);
  }
}
//# sourceMappingURL=TriggerButton.js.map
