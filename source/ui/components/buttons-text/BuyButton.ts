import type { SupportedLocale } from "../../../Engine.js";
import type { SettingBuy, SettingOptions } from "../../../settings/Settings.js";
import { Dialog } from "../Dialog.js";
import { TextButton, type TextButtonOptions } from "../TextButton.js";
import type { UiComponent } from "../UiComponent.js";
import styles from "./BuyButton.module.css";

export type BuyButtonOptions = ThisType<BuyButton> & TextButtonOptions;

export class BuyButton extends TextButton {
  declare readonly options: BuyButtonOptions;
  readonly setting: SettingBuy;

  constructor(
    parent: UiComponent,
    setting: SettingBuy,
    locale: SettingOptions<SupportedLocale>,
    options?: BuyButtonOptions,
  ) {
    super(parent, undefined, {
      onClick: async () => {
        const value = await Dialog.prompt(
          parent,
          parent.host.engine.i18n("blackcoin.buy.prompt"),
          parent.host.engine.i18n("blackcoin.buy.promptTitle", [
            parent.host.renderAbsolute(setting.buy, locale.selected),
          ]),
          parent.host.renderAbsolute(setting.buy),
          parent.host.engine.i18n("blackcoin.buy.promptExplainer"),
        );

        if (value === undefined) {
          return;
        }

        if (value === "" || value.startsWith("-")) {
          setting.buy = -1;
          return;
        }

        setting.buy = parent.host.parseAbsolute(value) ?? setting.buy;
      },
      onRefresh: () => {
        this.element.prop(
          "title",
          this.host.engine.i18n("blackcoin.buy.title", [
            this.host.renderAbsolute(this.setting.buy),
          ]),
        );
        this.element.text(
          this.host.engine.i18n("blackcoin.buy", [this.host.renderAbsolute(this.setting.buy)]),
        );

        options?.onRefresh?.call(this);
      },
    });

    this.element.addClass(styles.buyButton);

    this.setting = setting;
  }

  toString(): string {
    return `[${BuyButton.name}#${this.componentId}]`;
  }
}
