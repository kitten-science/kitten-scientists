import type { SupportedLocale } from "../../../Engine.js";
import type { ResourcesSettingsItem } from "../../../settings/ResourcesSettings.js";
import type { SettingOptions } from "../../../settings/Settings.js";
import { Button, type ButtonOptions } from "../Button.js";
import stylesButton from "../Button.module.css";
import { Dialog } from "../Dialog.js";
import type { UiComponent } from "../UiComponent.js";

export type StockButtonOptions = ThisType<StockButton> & ButtonOptions;

export class StockButton extends Button {
  declare readonly options: StockButtonOptions;
  readonly setting: ResourcesSettingsItem;
  readonly resourceName: string;

  constructor(
    parent: UiComponent,
    setting: ResourcesSettingsItem,
    locale: SettingOptions<SupportedLocale>,
    resourceName: string,
    options: Omit<StockButtonOptions, "onClick">,
  ) {
    super(parent, "", null, {
      ...options,
      onClick: async () => {
        const value = await Dialog.prompt(
          parent,
          parent.host.engine.i18n("resources.stock.prompt"),
          parent.host.engine.i18n("resources.stock.promptTitle", [
            resourceName,
            parent.host.renderAbsolute(setting.stock, locale.selected),
          ]),
          parent.host.renderAbsolute(setting.stock),
          parent.host.engine.i18n("resources.stock.promptExplainer"),
        );
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

        setting.stock = parent.host.parseAbsolute(value) ?? setting.stock;
      },
    });

    this.element.addClass(stylesButton.stockButton);

    this.resourceName = resourceName;
    this.setting = setting;
  }

  toString(): string {
    return `[${StockButton.name}#${this.componentId}]`;
  }

  refreshUi() {
    super.refreshUi();

    const stockValue = this.host.renderAbsolute(this.setting.stock);
    const title =
      this.setting.stock < 0
        ? this.host.engine.i18n("resources.stock.titleInfinite", [this.resourceName])
        : this.setting.stock === 0
          ? this.host.engine.i18n("resources.stock.titleZero", [this.resourceName])
          : this.host.engine.i18n("resources.stock.title", [
              this.host.renderAbsolute(this.setting.stock),
              this.resourceName,
            ]);
    this.updateTitle(title);
    this.updateLabel(stockValue);
  }
}
