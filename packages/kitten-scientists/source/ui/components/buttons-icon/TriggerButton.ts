import { Icons } from "../../../images/Icons.js";
import { KittenScientists } from "../../../KittenScientists.js";
import { SettingThreshold, SettingTrigger } from "../../../settings/Settings.js";
import { AbstractBuildSettingsPanel } from "../../SettingsSectionUi.js";
import { IconButton } from "../IconButton.js";
import { UiComponentOptions } from "../UiComponent.js";

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
          ? AbstractBuildSettingsPanel.promptPercentage(
              host.engine.i18n("ui.trigger.setpercentage", [label]),
              setting.trigger,
            )
          : AbstractBuildSettingsPanel.promptLimit(
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
        ? `${AbstractBuildSettingsPanel.renderPercentage(this.setting.trigger)}%`
        : AbstractBuildSettingsPanel.renderLimit(this.setting.trigger, this._host),
    ]);
  }
}
