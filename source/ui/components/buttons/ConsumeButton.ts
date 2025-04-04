import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import type { SupportedLocale } from "../../../Engine.js";
import type { KittenScientists } from "../../../KittenScientists.js";
import { Icons } from "../../../images/Icons.js";
import type { ResourcesSettingsItem } from "../../../settings/ResourcesSettings.js";
import type { SettingOptions } from "../../../settings/Settings.js";
import { Button, type ButtonOptions } from "../Button.js";
import stylesButton from "../Button.module.css";
import { Dialog } from "../Dialog.js";

export type ConsumeButtonOptions = ThisType<ConsumeButton> & ButtonOptions;

export class ConsumeButton extends Button {
  declare readonly _options: ConsumeButtonOptions;
  readonly setting: ResourcesSettingsItem;
  readonly resourceName: string;

  constructor(
    host: KittenScientists,
    setting: ResourcesSettingsItem,
    locale: SettingOptions<SupportedLocale>,
    resourceName: string,
    options?: ConsumeButtonOptions,
  ) {
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
            options?.onClick?.();
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
