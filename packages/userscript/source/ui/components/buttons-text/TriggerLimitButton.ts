import { SettingTrigger } from "../../../settings/Settings";
import { UserScript } from "../../../UserScript";
import { SettingsSectionUi } from "../../SettingsSectionUi";
import { TriggerButtonBehavior } from "../buttons-icon/TriggerButton";
import { TextButton } from "../TextButton";

export class TriggerLimitButton extends TextButton {
  readonly behavior: TriggerButtonBehavior = "percentage";
  readonly setting: SettingTrigger;

  constructor(
    host: UserScript,
    label: string,
    setting: SettingTrigger,
    handler: { onClick?: () => void } = {}
  ) {
    super(host, label, setting.trigger.toFixed(), {
      onClick: () => {
        const value = SettingsSectionUi.promptLimit(
          host.engine.i18n("ui.trigger.setinteger", [label]),
          setting.trigger.toString()
        );

        if (value !== null) {
          setting.trigger = value;
          this.refreshUi();
        }

        if (handler.onClick) {
          handler.onClick();
        }
      },
    });

    this.element.addClass("ks-max-button");

    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    this.element.prop("title", this.setting.trigger.toFixed());
    this.element.text(
      this._host.engine.i18n("ui.trigger", [
        SettingsSectionUi.renderLimit(this.setting.trigger, this._host),
      ])
    );
  }
}
