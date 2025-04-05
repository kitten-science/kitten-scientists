import type { SupportedLocale } from "../../../Engine.js";
import type { SettingOptions, SettingSell } from "../../../settings/Settings.js";
import { Dialog } from "../Dialog.js";
import { TextButton, type TextButtonOptions } from "../TextButton.js";
import type { UiComponent } from "../UiComponent.js";
import styles from "./SellButton.module.css";

export type SellButtonOptions = ThisType<SellButton> & TextButtonOptions;

export class SellButton extends TextButton {
  declare readonly options: SellButtonOptions;
  readonly setting: SettingSell;

  constructor(
    parent: UiComponent,
    setting: SettingSell,
    locale: SettingOptions<SupportedLocale>,
    options?: SellButtonOptions,
  ) {
    super(parent, undefined, {
      onClick: async () => {
        const value = await Dialog.prompt(
          parent,
          parent.host.engine.i18n("blackcoin.sell.prompt"),
          parent.host.engine.i18n("blackcoin.sell.promptTitle", [
            parent.host.renderAbsolute(setting.sell, locale.selected),
          ]),
          parent.host.renderAbsolute(setting.sell),
          parent.host.engine.i18n("blackcoin.sell.promptExplainer"),
        );

        if (value === undefined) {
          return;
        }

        if (value === "" || value.startsWith("-")) {
          setting.sell = -1;
          return;
        }

        setting.sell = parent.host.parseAbsolute(value) ?? setting.sell;
      },
    });

    this.element.addClass(styles.sellButton);

    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    this.element.prop(
      "title",
      this.host.engine.i18n("blackcoin.sell.title", [this.host.renderAbsolute(this.setting.sell)]),
    );
    this.element.text(
      this.host.engine.i18n("blackcoin.sell", [this.host.renderAbsolute(this.setting.sell)]),
    );
  }
}
