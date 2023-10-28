import { SettingSell } from "../../../settings/Settings.js";
import { UserScript } from "../../../UserScript.js";
import { SettingsSectionUi } from "../../SettingsSectionUi.js";
import { TextButton } from "../TextButton.js";

export class SellButton extends TextButton {
  readonly setting: SettingSell;

  constructor(
    host: UserScript,
    label: string,
    setting: SettingSell,
    handler: { onClick?: () => void } = {},
  ) {
    super(host, label, {
      onClick: () => {
        const value = SettingsSectionUi.promptFloat(
          host.engine.i18n("blackcoin.sell.threshold"),
          setting.sell.toString(),
        );

        if (value !== null) {
          setting.sell = value;
          this.refreshUi();
        }

        if (handler.onClick) {
          handler.onClick();
        }
      },
      title: setting.sell.toFixed(3),
    });

    this.element.addClass("ks-sell-button");

    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    this.element.prop("title", this.setting.sell.toFixed(3));
    this.element.text(
      this._host.engine.i18n("ui.sell", [SettingsSectionUi.renderFloat(this.setting.sell)]),
    );
  }
}
