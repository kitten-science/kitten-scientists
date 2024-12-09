import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { SupportedLocale } from "packages/kitten-scientists/source/Engine.js";
import { KittenScientists } from "../../../KittenScientists.js";
import { SettingOptions, SettingSell } from "../../../settings/Settings.js";
import { Dialog } from "../Dialog.js";
import { TextButton } from "../TextButton.js";
import styles from "./SellButton.module.css";

export class SellButton extends TextButton {
  readonly setting: SettingSell;

  constructor(
    host: KittenScientists,
    setting: SettingSell,
    locale: SettingOptions<SupportedLocale>,
    handler: { onClick?: () => void } = {},
  ) {
    super(host, undefined, {
      onClick: () => {
        Dialog.prompt(
          host,
          host.engine.i18n("blackcoin.sell.prompt"),
          host.engine.i18n("blackcoin.sell.promptTitle", [
            host.renderAbsolute(setting.sell, locale.selected),
          ]),
          host.renderAbsolute(setting.sell),
          host.engine.i18n("blackcoin.sell.promptExplainer"),
        )
          .then(value => {
            if (value === undefined) {
              return;
            }

            if (value === "" || value.startsWith("-")) {
              setting.sell = -1;
              return;
            }

            setting.sell = host.parseAbsolute(value) ?? setting.sell;
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
