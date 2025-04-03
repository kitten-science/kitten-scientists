import type { KittenScientists } from "../../../KittenScientists.js";
import { Icons } from "../../../images/Icons.js";
import type { SettingLimited } from "../../../settings/Settings.js";
import { Button, type ButtonOptions } from "../Button.js";
import stylesButton from "../Button.module.css";

export type LimitedButtonOptions = ButtonOptions & {
  readonly onLimitedCheck?: () => void;
  readonly onLimitedUnCheck?: () => void;
};

export class LimitedButton extends Button {
  readonly setting: SettingLimited;

  constructor(host: KittenScientists, setting: SettingLimited, options?: LimitedButtonOptions) {
    super(host, "", Icons.Eco, { ...options, border: false, classes: [] });

    this.setting = setting;
    this.element.on("click", () => {
      this.setting.limited = !this.setting.limited;

      if (this.setting.limited) {
        options?.onLimitedCheck?.();
      } else {
        options?.onLimitedUnCheck?.();
      }

      this.refreshUi();
    });

    for (const className of options?.classes ?? []) {
      this.element.addClass(className);
    }
  }

  refreshUi() {
    super.refreshUi();

    this.updateTitle(
      this._host.engine.i18n(this.setting.limited ? "ui.limited.on" : "ui.limited.off"),
    );
    if (this.setting.limited && !this.inactive) {
      this.element.removeClass(stylesButton.inactive);
    } else {
      this.element.addClass(stylesButton.inactive);
    }
  }
}
