import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { InvalidOperationError } from "@oliversalzburg/js-utils/errors/InvalidOperationError.js";
import type { SupportedLocale } from "../../../Engine.js";
import type { KittenScientists } from "../../../KittenScientists.js";
import { Icons } from "../../../images/Icons.js";
import {
  type SettingOptions,
  type SettingThreshold,
  SettingTrigger,
} from "../../../settings/Settings.js";
import { Button, type ButtonOptions } from "../Button.js";

export type TriggerButtonBehavior = "integer" | "percentage";

export type TriggerButtonOptions = ThisType<TriggerButton> &
  ButtonOptions & {
    readonly onRefreshTitle?: () => void;
  };

export class TriggerButton extends Button {
  declare readonly _options: TriggerButtonOptions;
  readonly behavior: TriggerButtonBehavior;
  readonly setting: SettingTrigger | SettingThreshold;

  constructor(
    host: KittenScientists,
    setting: SettingTrigger | SettingThreshold,
    _locale: SettingOptions<SupportedLocale>,
    options?: TriggerButtonOptions,
  ) {
    super(host, "", Icons.Trigger, options);

    this.behavior = setting instanceof SettingTrigger ? "percentage" : "integer";

    if (isNil(options?.onClick)) {
      throw new InvalidOperationError("Missing click handler on TriggerButton.");
    }

    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    if (this._options?.onRefreshTitle) {
      this._options?.onRefreshTitle?.call(this);
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
