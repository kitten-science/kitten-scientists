import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import type { SupportedLocale } from "packages/kitten-scientists/source/Engine.js";
import type { KittenScientists } from "../../../KittenScientists.js";
import type { SettingBuy, SettingOptions } from "../../../settings/Settings.js";
import { Dialog } from "../Dialog.js";
import { TextButton } from "../TextButton.js";
import styles from "./BuyButton.module.css";

export class BuyButton extends TextButton {
  readonly setting: SettingBuy;

  constructor(
    host: KittenScientists,
    setting: SettingBuy,
    locale: SettingOptions<SupportedLocale>,
    handler: { onClick?: () => void } = {},
  ) {
    super(host, undefined, {
      onClick: () => {
        Dialog.prompt(
          host,
          host.engine.i18n("blackcoin.buy.prompt"),
          host.engine.i18n("blackcoin.buy.promptTitle", [
            host.renderAbsolute(setting.buy, locale.selected),
          ]),
          host.renderAbsolute(setting.buy),
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

            setting.buy = host.parseAbsolute(value) ?? setting.buy;
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
      this._host.engine.i18n("blackcoin.buy.title", [this._host.renderAbsolute(this.setting.buy)]),
    );
    this.element.text(
      this._host.engine.i18n("blackcoin.buy", [this._host.renderAbsolute(this.setting.buy)]),
    );
  }
}
