import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { KittenScientists } from "../../../KittenScientists.js";
import { SettingSell } from "../../../settings/Settings.js";
import { Dialog } from "../Dialog.js";
import { TextButton } from "../TextButton.js";
import { UiComponent } from "../UiComponent.js";
import styles from "./SellButton.module.css";

export class SellButton extends TextButton {
  readonly setting: SettingSell;

  constructor(
    host: KittenScientists,
    setting: SettingSell,
    handler: { onClick?: () => void } = {},
  ) {
    super(host, undefined, {
      onClick: () => {
        Dialog.prompt(
          host,
          host.engine.i18n("blackcoin.sell.prompt"),
          host.engine.i18n("blackcoin.sell.promptTitle", [
            UiComponent.renderAbsolute(setting.sell, host),
          ]),
          setting.sell.toString(),
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

            setting.sell = UiComponent.parseAbsolute(value) ?? setting.sell;
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
        UiComponent.renderAbsolute(this.setting.sell, this._host),
      ]),
    );
    this.element.text(
      this._host.engine.i18n("blackcoin.sell", [
        UiComponent.renderAbsolute(this.setting.sell, this._host),
      ]),
    );
  }
}
