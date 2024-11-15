import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { ResourcesSettingsItem } from "packages/kitten-scientists/source/settings/ResourcesSettings.js";
import { Icons } from "../../../images/Icons.js";
import { KittenScientists } from "../../../KittenScientists.js";
import { Button, ButtonOptions } from "../Button.js";
import stylesButton from "../Button.module.css";
import { Dialog } from "../Dialog.js";
import { UiComponent } from "../UiComponent.js";

export class ConsumeButton extends Button {
  readonly setting: ResourcesSettingsItem;
  readonly resourceName: string;

  constructor(
    host: KittenScientists,
    resourceName: string,
    setting: ResourcesSettingsItem,
    options?: Partial<ButtonOptions>,
  ) {
    super(host, "", Icons.DataUsage, {
      ...options,
      onClick: () => {
        Dialog.prompt(
          host,
          host.engine.i18n("resources.consume.prompt"),
          host.engine.i18n("resources.consume.promptTitle", [
            resourceName,
            `${UiComponent.renderPercentage(setting.consume)}%`,
          ]),
          UiComponent.renderPercentage(setting.consume),
          host.engine.i18n("resources.consume.promptExplainer"),
        )
          .then(value => {
            if (value === undefined) {
              return;
            }

            if (value === "" || value.startsWith("-")) {
              return;
            }

            setting.consume = UiComponent.parsePercentage(value);
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

    const consumeValue = `${UiComponent.renderPercentage(this.setting.consume)}%`;
    const title =
      this.setting.consume === 0
        ? this._host.engine.i18n("resources.consume.titleZero", [this.resourceName])
        : this._host.engine.i18n("resources.consume.title", [consumeValue, this.resourceName]);
    this.updateTitle(title);
  }
}
