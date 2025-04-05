import type { SupportedLocale } from "../../../Engine.js";
import type { KittenScientists } from "../../../KittenScientists.js";
import type { SettingOptions, SettingSell } from "../../../settings/Settings.js";
import { Dialog } from "../Dialog.js";
import { TextButton, type TextButtonOptions } from "../TextButton.js";
import styles from "./SellButton.module.css";

export type SellButtonOptions = ThisType<SellButton> & TextButtonOptions;

export class SellButton extends TextButton {
  declare readonly _options: SellButtonOptions;
  readonly setting: SettingSell;

  constructor(
    host: KittenScientists,
    setting: SettingSell,
    locale: SettingOptions<SupportedLocale>,
    options?: SellButtonOptions,
  ) {
    super(host, undefined, {
      onClick: async () => {
        const value = await Dialog.prompt(
          host,
          host.engine.i18n("blackcoin.sell.prompt"),
          host.engine.i18n("blackcoin.sell.promptTitle", [
            host.renderAbsolute(setting.sell, locale.selected),
          ]),
          host.renderAbsolute(setting.sell),
          host.engine.i18n("blackcoin.sell.promptExplainer"),
        );

        if (value === undefined) {
          return;
        }

        if (value === "" || value.startsWith("-")) {
          setting.sell = -1;
          return;
        }

        setting.sell = host.parseAbsolute(value) ?? setting.sell;
      },
    });

    this.element.addClass(styles.sellButton);

    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    this.element.prop(
      "title",
      this._host.engine.i18n("blackcoin.sell.title", [
        this._host.renderAbsolute(this.setting.sell),
      ]),
    );
    this.element.text(
      this._host.engine.i18n("blackcoin.sell", [this._host.renderAbsolute(this.setting.sell)]),
    );
  }
}
