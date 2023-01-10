import { SettingBuy } from "../../../settings/Settings";
import { UserScript } from "../../../UserScript";
import { SettingsSectionUi } from "../../SettingsSectionUi";
import { TextButton } from "../TextButton";

export class BuyButton extends TextButton {
  readonly setting: SettingBuy;

  constructor(
    host: UserScript,
    label: string,
    setting: SettingBuy,
    handler: { onClick?: () => void } = {}
  ) {
    super(host, label, setting.buy.toFixed(3), {
      onClick: () => {
        const value = SettingsSectionUi.promptFloat(
          host.engine.i18n("blackcoin.buy.threshold"),
          setting.buy.toString()
        );

        if (value !== null) {
          setting.buy = value;
          this.refreshUi();
        }

        if (handler.onClick) {
          handler.onClick();
        }
      },
    });

    this.element.addClass("ks-buy-button");

    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    this.element.prop("title", this.setting.buy.toFixed(3));
    this.element.text(
      this._host.engine.i18n("ui.buy", [
        SettingsSectionUi.renderFloat(this.setting.buy, this._host),
      ])
    );
  }
}
