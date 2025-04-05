import type { SupportedLocale } from "../../../Engine.js";
import type { KittenScientists } from "../../../KittenScientists.js";
import type { SettingBuy, SettingOptions } from "../../../settings/Settings.js";
import { Dialog } from "../Dialog.js";
import { TextButton, type TextButtonOptions } from "../TextButton.js";
import styles from "./BuyButton.module.css";

export type BuyButtonOptions = ThisType<BuyButton> & TextButtonOptions;

export class BuyButton extends TextButton {
  declare readonly _options: BuyButtonOptions;
  readonly setting: SettingBuy;

  constructor(
    host: KittenScientists,
    setting: SettingBuy,
    locale: SettingOptions<SupportedLocale>,
    options?: BuyButtonOptions,
  ) {
    super(host, undefined, {
      onClick: async () => {
        const value = await Dialog.prompt(
          host,
          host.engine.i18n("blackcoin.buy.prompt"),
          host.engine.i18n("blackcoin.buy.promptTitle", [
            host.renderAbsolute(setting.buy, locale.selected),
          ]),
          host.renderAbsolute(setting.buy),
          host.engine.i18n("blackcoin.buy.promptExplainer"),
        );

        if (value === undefined) {
          return;
        }

        if (value === "" || value.startsWith("-")) {
          setting.buy = -1;
          return;
        }

        setting.buy = host.parseAbsolute(value) ?? setting.buy;
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
