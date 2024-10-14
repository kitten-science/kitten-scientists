import { KittenScientists } from "../../../KittenScientists.js";
import { SettingSell } from "../../../settings/Settings.js";
import { AbstractBuildSettingsPanel } from "../../SettingsSectionUi.js";
import { TextButton } from "../TextButton.js";

export class SellButton extends TextButton {
  readonly setting: SettingSell;

  constructor(
    host: KittenScientists,
    setting: SettingSell,
    handler: { onClick?: () => void } = {},
  ) {
    super(host, undefined, {
      onClick: () => {
        const value = AbstractBuildSettingsPanel.promptLimit(
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
      this._host.engine.i18n("ui.sell", [
        AbstractBuildSettingsPanel.renderLimit(this.setting.sell, this._host),
      ]),
    );
  }
}
