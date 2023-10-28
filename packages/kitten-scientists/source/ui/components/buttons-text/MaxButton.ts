import { SettingMax } from "../../../settings/Settings.js";
import { UserScript } from "../../../UserScript.js";
import { SettingsSectionUi } from "../../SettingsSectionUi.js";
import { TextButton } from "../TextButton.js";

export class MaxButton extends TextButton {
  readonly setting: SettingMax;

  constructor(
    host: UserScript,
    label: string,
    setting: SettingMax,
    handler: { onClick?: () => void } = {},
  ) {
    super(host, label, {
      onClick: () => {
        const value = SettingsSectionUi.promptLimit(
          host.engine.i18n("ui.max.set", [label]),
          setting.max.toString(),
        );

        if (value !== null) {
          setting.max = value;
          this.refreshUi();
        }

        if (handler.onClick) {
          handler.onClick();
        }
      },
      title: setting.max.toFixed(),
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
      ]),
    );
  }
}
