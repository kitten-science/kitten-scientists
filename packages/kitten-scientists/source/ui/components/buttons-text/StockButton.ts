import { UserScript } from "../../../UserScript.js";
import { SettingsSectionUi } from "../../SettingsSectionUi.js";
import { TextButton } from "../TextButton.js";

export type SettingWithStock = { stock: number };

export class StockButton extends TextButton {
  readonly setting: SettingWithStock;

  constructor(
    host: UserScript,
    label: string,
    setting: SettingWithStock,
    handler: { onClick?: () => void } = {},
  ) {
    super(host, label, {
      onClick: () => {
        const value = SettingsSectionUi.promptLimit(
          this._host.engine.i18n("resources.stock.set", [label]),
          setting.stock.toString(),
        );

        if (value !== null) {
          setting.stock = value;
          this.refreshUi();
        }

        if (handler.onClick) {
          handler.onClick();
        }
      },
      title: setting.stock.toString(),
    });

    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    this.element.prop("title", this.setting.stock.toString());
    this.element.text(
      this._host.engine.i18n("resources.stock", [
        SettingsSectionUi.renderLimit(this.setting.stock, this._host),
      ]),
    );
  }
}
