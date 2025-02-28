import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { Button } from "../Button.js";
import stylesButton from "../Button.module.css";
import { Dialog } from "../Dialog.js";
export class StockButton extends Button {
  setting;
  resourceName;
  constructor(host, setting, locale, resourceName, options) {
    super(host, "", null, {
      ...options,
      onClick: () => {
        Dialog.prompt(
          host,
          host.engine.i18n("resources.stock.prompt"),
          host.engine.i18n("resources.stock.promptTitle", [
            resourceName,
            host.renderAbsolute(setting.stock, locale.selected),
          ]),
          host.renderAbsolute(setting.stock),
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
            setting.stock = host.parseAbsolute(value) ?? setting.stock;
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
    const stockValue = this._host.renderAbsolute(this.setting.stock);
    const title =
      this.setting.stock < 0
        ? this._host.engine.i18n("resources.stock.titleInfinite", [this.resourceName])
        : this.setting.stock === 0
          ? this._host.engine.i18n("resources.stock.titleZero", [this.resourceName])
          : this._host.engine.i18n("resources.stock.title", [
              this._host.renderAbsolute(this.setting.stock),
              this.resourceName,
            ]);
    this.updateTitle(title);
    this.updateLabel(stockValue);
  }
}
//# sourceMappingURL=StockButton.js.map
