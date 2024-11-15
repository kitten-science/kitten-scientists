import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { KittenScientists } from "../../../KittenScientists.js";
import { SettingBuy } from "../../../settings/Settings.js";
import { Dialog } from "../Dialog.js";
import { TextButton } from "../TextButton.js";
import { UiComponent } from "../UiComponent.js";
import styles from "./BuyButton.module.css";

export class BuyButton extends TextButton {
  readonly setting: SettingBuy;

  constructor(host: KittenScientists, setting: SettingBuy, handler: { onClick?: () => void } = {}) {
    super(host, undefined, {
      onClick: () => {
        Dialog.prompt(
          host,
          host.engine.i18n("blackcoin.buy.prompt"),
          host.engine.i18n("blackcoin.buy.promptTitle", [
            UiComponent.renderAbsolute(setting.buy, host),
          ]),
          setting.buy.toString(),
          host.engine.i18n("blackcoin.buy.promptExplainer"),
        )
          .then(value => {
            if (value === undefined) {
              return;
            }

            if (value === "" || value.startsWith("-")) {
              setting.buy = -1;
              return;
            }

            setting.buy = UiComponent.parseAbsolute(value) ?? setting.buy;
          })
          .then(() => {
            this.refreshUi();

            if (handler.onClick) {
              handler.onClick();
            }
          })
          .catch(redirectErrorsToConsole(console));
      },
    });

    this.element.addClass(styles.buyButton);

    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    this.element.prop(
      "title",
      this._host.engine.i18n("blackcoin.buy.title", [
        UiComponent.renderAbsolute(this.setting.buy, this._host),
      ]),
    );
    this.element.text(
      this._host.engine.i18n("blackcoin.buy", [
        UiComponent.renderAbsolute(this.setting.buy, this._host),
      ]),
    );
  }
}
