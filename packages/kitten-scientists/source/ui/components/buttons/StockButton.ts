import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { KittenScientists } from "../../../KittenScientists.js";
import { ResourcesSettingsItem } from "../../../settings/ResourcesSettings.js";
import { Button, ButtonOptions } from "../Button.js";
import stylesButton from "../Button.module.css";
import { Dialog } from "../Dialog.js";
import { UiComponent } from "../UiComponent.js";

export class StockButton extends Button {
  readonly setting: ResourcesSettingsItem;
  readonly resourceName: string;

  constructor(
    host: KittenScientists,
    resourceName: string,
    setting: ResourcesSettingsItem,
    options?: Partial<ButtonOptions>,
  ) {
    super(host, UiComponent.renderAbsolute(setting.stock, host), null, {
      ...options,
      onClick: () => {
        Dialog.prompt(
          host,
          host.engine.i18n("resources.stock.prompt"),
          host.engine.i18n("resources.stock.promptTitle", [
            resourceName,
            UiComponent.renderAbsolute(setting.stock, host),
          ]),
          setting.stock.toString(),
          host.engine.i18n("resources.stock.promptExplainer"),
        )
          .then(value => {
            if (value === undefined) {
              return;
            }

            if (value === "" || value.startsWith("-")) {
              setting.stock = -1;
              return;
            }

            if (value === "0") {
              setting.enabled = false;
            }

            setting.stock = UiComponent.parseAbsolute(value) ?? setting.stock;
          })
          .then(() => {
            this.refreshUi();

            if (options?.onClick) {
              options.onClick(this);
            }
          })
          .catch(redirectErrorsToConsole(console));
      },
    });

    this.element.addClass(stylesButton.stockButton);

    this.resourceName = resourceName;
    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    const stockValue = UiComponent.renderAbsolute(this.setting.stock, this._host);
    const title =
      this.setting.stock < 0
        ? this._host.engine.i18n("resources.stock.titleInfinite", [this.resourceName])
        : this.setting.stock === 0
          ? this._host.engine.i18n("resources.stock.titleZero", [this.resourceName])
          : this._host.engine.i18n("resources.stock.title", [stockValue, this.resourceName]);
    this.updateTitle(title);
    this.updateLabel(stockValue);
  }
}
