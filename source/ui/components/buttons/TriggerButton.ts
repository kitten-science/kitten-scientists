import type { SupportedLocale } from "../../../Engine.js";
import { Icons } from "../../../images/Icons.js";
import {
  type SettingOptions,
  type SettingThreshold,
  SettingTrigger,
} from "../../../settings/Settings.js";
import { Button, type ButtonOptions } from "../Button.js";
import stylesButton from "../Button.module.css";
import type { UiComponent } from "../UiComponent.js";

export type TriggerButtonBehavior = "integer" | "percentage";

export type TriggerButtonOptions = ThisType<TriggerButton> &
  ButtonOptions & {
    readonly renderLabel?: boolean;
  };

export class TriggerButton extends Button {
  declare readonly options: TriggerButtonOptions;
  readonly behavior: TriggerButtonBehavior;
  readonly setting: SettingTrigger | SettingThreshold;

  constructor(
    parent: UiComponent,
    setting: SettingTrigger | SettingThreshold,
    _locale: SettingOptions<SupportedLocale>,
    options: TriggerButtonOptions,
  ) {
    super(parent, "", Icons.Trigger, {
      ...options,
      onRefresh: () => {
        const triggerValue =
          this.behavior === "integer"
            ? this.host.renderAbsolute(this.setting.trigger, "invariant")
            : this.host.renderPercentage(this.setting.trigger, "invariant", true);

        this.updateTitle(this.host.engine.i18n("ui.trigger", [triggerValue]));
        if (this.options?.renderLabel ?? true) {
          this.updateLabel(triggerValue);
        }

        if (!this.inactive) {
          this.element.removeClass(stylesButton.inactive);
        } else {
          this.element.addClass(stylesButton.inactive);
        }

        options?.onRefresh?.call(this);
      },
    });

    this.behavior = setting instanceof SettingTrigger ? "percentage" : "integer";

    this.setting = setting;
  }

  toString(): string {
    return `[${TriggerButton.name}#${this.componentId}]`;
  }
}
