import { UserScript } from "../../UserScript";
import { SettingsSectionUi } from "../SettingsSectionUi";
import { UiComponent } from "./UiComponent";

export type SettingWithStock = { stock: number };

export class StockButton extends UiComponent {
  readonly setting: SettingWithStock;
  readonly element: JQuery<HTMLElement>;

  constructor(
    host: UserScript,
    label: string,
    setting: SettingWithStock,
    handler: { onClick?: () => void } = {}
  ) {
    super(host);

    const element = $("<div/>").addClass("ks-label").addClass("ks-text-button");

    element.on("click", () => {
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
    });

    this.element = element;
    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    this.element[0].title = this.setting.stock.toString();
    this.element.text(
      this._host.engine.i18n("resources.stock", [
        SettingsSectionUi.renderLimit(this.setting.stock, this._host),
      ])
    );
  }
}
