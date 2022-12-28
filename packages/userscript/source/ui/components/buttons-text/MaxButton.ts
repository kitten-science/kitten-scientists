import { SettingMax } from "../../../settings/Settings";
import { UserScript } from "../../../UserScript";
import { SettingsSectionUi } from "../../SettingsSectionUi";
import { TextButton } from "../TextButton";

export class MaxButton extends TextButton {
  readonly setting: SettingMax;

  constructor(
    host: UserScript,
    label: string,
    setting: SettingMax,
    handler: { onClick?: () => void } = {}
  ) {
    super(host, label, setting.max.toFixed(), {
      onClick: () => {
        const value = SettingsSectionUi.promptLimit(
          host.engine.i18n("ui.max.set", [label]),
          setting.max.toString()
        );

        if (value !== null) {
          setting.max = value;
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

    this.element.prop("title", this.setting.max.toFixed());
    this.element.text(
      this._host.engine.i18n("ui.max", [
        SettingsSectionUi.renderLimit(this.setting.max, this._host),
      ])
    );
  }
}
