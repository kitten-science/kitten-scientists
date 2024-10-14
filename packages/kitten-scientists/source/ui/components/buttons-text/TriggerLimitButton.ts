import { KittenScientists } from "../../../KittenScientists.js";
import { SettingTrigger } from "../../../settings/Settings.js";
import { AbstractBuildSettingsPanel } from "../../SettingsSectionUi.js";
import { TriggerButtonBehavior } from "../buttons-icon/TriggerButton.js";
import { TextButton } from "../TextButton.js";

export class TriggerLimitButton extends TextButton {
  readonly behavior: TriggerButtonBehavior = "percentage";
  readonly setting: SettingTrigger;

  constructor(
    host: KittenScientists,
    label: string,
    setting: SettingTrigger,
    handler: { onClick?: () => void } = {},
  ) {
    super(host, label, {
      onClick: () => {
        const value = AbstractBuildSettingsPanel.promptLimit(
          host.engine.i18n("ui.trigger.setinteger", [label]),
          setting.trigger.toString(),
        );

        if (value !== null) {
          setting.trigger = value;
          this.refreshUi();
        }

        if (handler.onClick) {
          handler.onClick();
        }
      },
      title: setting.trigger.toFixed(),
    });

    this.element.addClass("ks-max-button");

    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    this.element.prop("title", this.setting.trigger.toFixed());
    this.element.text(
      this._host.engine.i18n("ui.trigger", [
        AbstractBuildSettingsPanel.renderLimit(this.setting.trigger, this._host),
      ]),
    );
  }
}
