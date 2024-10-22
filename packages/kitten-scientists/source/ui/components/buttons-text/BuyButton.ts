import { KittenScientists } from "../../../KittenScientists.js";
import { SettingBuy } from "../../../settings/Settings.js";
import { TextButton } from "../TextButton.js";
import { UiComponent } from "../UiComponent.js";

export class BuyButton extends TextButton {
  readonly setting: SettingBuy;

  constructor(host: KittenScientists, setting: SettingBuy, handler: { onClick?: () => void } = {}) {
    super(host, undefined, {
      onClick: () => {
        const value = UiComponent.promptLimit(
          host.engine.i18n("blackcoin.buy.threshold"),
          setting.buy.toString(),
        );

        if (value !== null) {
          setting.buy = value;
          this.refreshUi();
        }

        if (handler.onClick) {
          handler.onClick();
        }
      },
      title: setting.buy.toFixed(3),
    });

    this.element.addClass("ks-buy-button");

    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    this.element.prop("title", this.setting.buy.toFixed(3));
    this.element.text(
      this._host.engine.i18n("ui.buy", [UiComponent.renderLimit(this.setting.buy, this._host)]),
    );
  }
}
