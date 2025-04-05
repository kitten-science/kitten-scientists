import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { InvalidOperationError } from "@oliversalzburg/js-utils/errors/InvalidOperationError.js";
import type { SupportedLocale } from "../../../Engine.js";
import { Icons } from "../../../images/Icons.js";
import {
  type SettingOptions,
  type SettingThreshold,
  SettingTrigger,
} from "../../../settings/Settings.js";
import { Button, type ButtonOptions } from "../Button.js";
import type { UiComponent } from "../UiComponent.js";

export type TriggerButtonBehavior = "integer" | "percentage";

export type TriggerButtonOptions = ThisType<TriggerButton> & ButtonOptions;

export class TriggerButton extends Button {
  declare readonly options: TriggerButtonOptions;
  readonly behavior: TriggerButtonBehavior;
  readonly setting: SettingTrigger | SettingThreshold;

  constructor(
    parent: UiComponent,
    setting: SettingTrigger | SettingThreshold,
    _locale: SettingOptions<SupportedLocale>,
    options?: TriggerButtonOptions,
  ) {
    super(parent, "", Icons.Trigger, options);

    this.behavior = setting instanceof SettingTrigger ? "percentage" : "integer";

    if (isNil(options?.onClick)) {
      throw new InvalidOperationError("Missing click handler on TriggerButton.");
    }

    this.setting = setting;
  }

  toString(): string {
    return `[${TriggerButton.name}#${this.componentId}]`;
  }

  refreshUi(): void {
    super.refreshUi();

    const triggerValue =
      this.behavior === "integer"
        ? this.host.renderAbsolute(this.setting.trigger, "invariant")
        : this.host.renderPercentage(this.setting.trigger, "invariant", true);

    this.updateTitle(this.host.engine.i18n("ui.trigger", [triggerValue]));
    this.updateLabel(triggerValue);
  }
}
