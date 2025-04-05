import type { SupportedLocale } from "../../../Engine.js";
import { Icons } from "../../../images/Icons.js";
import type { ResourcesSettingsItem } from "../../../settings/ResourcesSettings.js";
import type { SettingOptions } from "../../../settings/Settings.js";
import { Button, type ButtonOptions } from "../Button.js";
import stylesButton from "../Button.module.css";
import { Dialog } from "../Dialog.js";
import type { UiComponent } from "../UiComponent.js";

export type ConsumeButtonOptions = ThisType<ConsumeButton> & ButtonOptions;

export class ConsumeButton extends Button {
  declare readonly options: ConsumeButtonOptions;
  readonly setting: ResourcesSettingsItem;
  readonly resourceName: string;

  constructor(
    parent: UiComponent,
    setting: ResourcesSettingsItem,
    locale: SettingOptions<SupportedLocale>,
    resourceName: string,
    options?: ConsumeButtonOptions,
  ) {
    super(parent, "", Icons.DataUsage, {
      ...options,
      onClick: async () => {
        const value = await Dialog.prompt(
          parent,
          parent.host.engine.i18n("resources.consume.prompt"),
          parent.host.engine.i18n("resources.consume.promptTitle", [
            resourceName,
            parent.host.renderPercentage(setting.consume, locale.selected, true),
          ]),
          parent.host.renderPercentage(setting.consume),
          parent.host.engine.i18n("resources.consume.promptExplainer"),
        );

        if (value === undefined) {
          return;
        }

        if (value === "" || value.startsWith("-")) {
          return;
        }

        setting.consume = parent.host.parsePercentage(value);
      },
    });

    this.element.addClass(stylesButton.consumeButton);

    this.resourceName = resourceName;
    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    const consumeValue = this.host.renderPercentage(
      this.setting.consume,
      this.host.engine.settings.locale.selected,
      true,
    );
    const title =
      this.setting.consume === 0
        ? this.host.engine.i18n("resources.consume.titleZero", [this.resourceName])
        : this.host.engine.i18n("resources.consume.title", [consumeValue, this.resourceName]);
    this.updateTitle(title);
  }
}
