import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { InvalidOperationError } from "@oliversalzburg/js-utils/errors/InvalidOperationError.js";
import { Icons } from "../../../images/Icons.js";
import { KittenScientists } from "../../../KittenScientists.js";
import { SettingThreshold, SettingTrigger } from "../../../settings/Settings.js";
import { Button, ButtonOptions } from "../Button.js";
import { UiComponent } from "../UiComponent.js";

export type TriggerButtonBehavior = "integer" | "percentage";

export type TriggerButtonOptions = ButtonOptions & {
  readonly onRefreshTitle: (subject: TriggerButton) => void;
};

export class TriggerButton extends Button {
  readonly behavior: TriggerButtonBehavior;
  readonly setting: SettingTrigger | SettingThreshold;
  protected readonly _onRefreshTitle?: (subject: TriggerButton) => void;

  constructor(
    host: KittenScientists,
    setting: SettingTrigger | SettingThreshold,
    options?: Partial<TriggerButtonOptions>,
  ) {
    super(host, "", Icons.Trigger, { ...options, onClick: undefined });

    this._onRefreshTitle = options?.onRefreshTitle;

    this.behavior = setting instanceof SettingTrigger ? "percentage" : "integer";

    if (isNil(options?.onClick)) {
      throw new InvalidOperationError("Missing click handler on TriggerButton.");
    }

    this.element.on("click", () => {
      options.onClick?.(this);
    });
    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    if (this._onRefreshTitle) {
      this._onRefreshTitle(this);
      return;
    }

    const triggerValue =
      this.behavior === "percentage"
        ? this.setting.trigger < 0
          ? this._host.engine.i18n("ui.infinity")
          : `${UiComponent.renderPercentage(this.setting.trigger)}%`
        : UiComponent.renderAbsolute(this.setting.trigger, this._host);

    this.element[0].title = this._host.engine.i18n("ui.trigger", [triggerValue]);
    this.updateLabel(triggerValue);
  }
}
