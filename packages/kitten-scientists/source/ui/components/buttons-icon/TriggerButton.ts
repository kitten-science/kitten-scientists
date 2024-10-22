import { Icons } from "../../../images/Icons.js";
import { KittenScientists } from "../../../KittenScientists.js";
import { SettingThreshold, SettingTrigger } from "../../../settings/Settings.js";
import { IconButton } from "../IconButton.js";
import { UiComponent, UiComponentOptions } from "../UiComponent.js";

export type TriggerButtonBehavior = "integer" | "percentage";

export class TriggerButton extends IconButton {
  readonly behavior: TriggerButtonBehavior;
  readonly setting: SettingTrigger | SettingThreshold;

  constructor(
    host: KittenScientists,
    label: string,
    setting: SettingTrigger | SettingThreshold,
    options?: Partial<UiComponentOptions>,
  ) {
    super(host, Icons.Trigger, "", options);

    this.behavior = setting instanceof SettingTrigger ? "percentage" : "integer";

    this.element.on("click", () => {
      const value =
        this.setting instanceof SettingTrigger
          ? UiComponent.promptPercentage(
              host.engine.i18n("ui.trigger.setpercentage", [label]),
              setting.trigger,
            )
          : UiComponent.promptLimit(
              host.engine.i18n("ui.trigger.setinteger", [label]),
              setting.trigger.toFixed(),
            );

      if (value !== null) {
        setting.trigger = value;
        this.refreshUi();
      }

      this.click();
    });
    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    this.element[0].title = this._host.engine.i18n("ui.trigger", [
      this.behavior === "percentage"
        ? `${UiComponent.renderPercentage(this.setting.trigger)}%`
        : UiComponent.renderLimit(this.setting.trigger, this._host),
    ]);
  }
}
