import { Icons } from "../../../images/Icons.js";
import type { SettingLimited } from "../../../settings/Settings.js";
import { Button, type ButtonOptions } from "../Button.js";
import stylesButton from "../Button.module.css";
import type { UiComponent } from "../UiComponent.js";

export type LimitedButtonOptions = ThisType<LimitedButton> &
  ButtonOptions & {
    readonly onLimitedCheck?: () => void;
    readonly onLimitedUnCheck?: () => void;
  };

export class LimitedButton extends Button {
  declare readonly options: LimitedButtonOptions;
  readonly setting: SettingLimited;

  constructor(parent: UiComponent, setting: SettingLimited, options?: LimitedButtonOptions) {
    super(parent, "", Icons.Eco, { ...options, border: false, classes: [] });

    this.setting = setting;
    this.element.on("click", () => {
      this.setting.limited = !this.setting.limited;

      if (this.setting.limited) {
        options?.onLimitedCheck?.call(this);
      } else {
        options?.onLimitedUnCheck?.call(this);
      }

      this.refreshUi();
    });

    for (const className of options?.classes ?? []) {
      this.element.addClass(className);
    }
  }

  toString(): string {
    return `[${LimitedButton.name}#${this.componentId}]`;
  }

  refreshUi() {
    super.refreshUi();

    this.updateTitle(
      this.host.engine.i18n(this.setting.limited ? "ui.limited.on" : "ui.limited.off"),
    );
    if (this.setting.limited && !this.inactive) {
      this.element.removeClass(stylesButton.inactive);
    } else {
      this.element.addClass(stylesButton.inactive);
    }
  }
}
