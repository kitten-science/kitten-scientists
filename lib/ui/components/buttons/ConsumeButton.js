import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { Icons } from "../../../images/Icons.js";
import { Button } from "../Button.js";
import stylesButton from "../Button.module.css";
import { Dialog } from "../Dialog.js";
export class ConsumeButton extends Button {
  setting;
  resourceName;
  constructor(host, setting, locale, resourceName, options) {
    super(host, "", Icons.DataUsage, {
      ...options,
      onClick: () => {
        Dialog.prompt(
          host,
          host.engine.i18n("resources.consume.prompt"),
          host.engine.i18n("resources.consume.promptTitle", [
            resourceName,
            host.renderPercentage(setting.consume, locale.selected, true),
          ]),
          host.renderPercentage(setting.consume),
          host.engine.i18n("resources.consume.promptExplainer"),
        )
          .then(value => {
            if (value === undefined) {
              return;
            }
            if (value === "" || value.startsWith("-")) {
              return;
            }
            setting.consume = host.parsePercentage(value);
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
    this.element.addClass(stylesButton.consumeButton);
    this.resourceName = resourceName;
    this.setting = setting;
  }
  refreshUi() {
    super.refreshUi();
    const consumeValue = this._host.renderPercentage(
      this.setting.consume,
      this._host.engine.settings.locale.selected,
      true,
    );
    const title =
      this.setting.consume === 0
        ? this._host.engine.i18n("resources.consume.titleZero", [this.resourceName])
        : this._host.engine.i18n("resources.consume.title", [consumeValue, this.resourceName]);
    this.updateTitle(title);
  }
}
//# sourceMappingURL=ConsumeButton.js.map
