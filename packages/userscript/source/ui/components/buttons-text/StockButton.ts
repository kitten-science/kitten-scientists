import { UserScript } from "../../../UserScript";
import { SettingsSectionUi } from "../../SettingsSectionUi";
import { TextButton } from "../TextButton";

export type SettingWithStock = { stock: number };

export class StockButton extends TextButton {
  readonly setting: SettingWithStock;

  constructor(
    host: UserScript,
    label: string,
    setting: SettingWithStock,
    handler: { onClick?: () => void } = {}
  ) {
    super(host, label, setting.stock.toString(), {
      onClick: () => {
        const value = SettingsSectionUi.promptLimit(
          this._host.engine.i18n("resources.stock.set", [label]),
          setting.stock.toString()
        );

        if (value !== null) {
          setting.stock = value;
          this.refreshUi();
        }

        if (handler.onClick) {
          handler.onClick();
        }
      },
    });

    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    this.element.prop("title", this.setting.stock.toString());
    this.element.text(
      this._host.engine.i18n("resources.stock", [
        SettingsSectionUi.renderLimit(this.setting.stock, this._host),
      ])
    );
  }
}
