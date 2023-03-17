import { SettingLimited } from "../../settings/Settings";
import { UserScript } from "../../UserScript";
import { UiComponent, UiComponentOptions } from "./UiComponent";

export type LimitedButtonOptions = UiComponentOptions & {
  readonly onLimitedCheck: () => void;
  readonly onLimitedUnCheck: () => void;
};

export class LimitedButton extends UiComponent {
  readonly setting: SettingLimited;
  readonly element: JQuery<HTMLElement>;
  readonly checkbox: JQuery<HTMLElement>;

  constructor(host: UserScript, setting: SettingLimited, options?: Partial<LimitedButtonOptions>) {
    super(host, options);

    const element = $("<div/>").addClass("ks-text-button");

    const elementLabel = $("<label/>", {
      text: host.engine.i18n("ui.limit"),
    });

    const checkbox = $("<input/>", {
      type: "checkbox",
    });

    checkbox.on("change", () => {
      if (checkbox.is(":checked") && setting.limited === false) {
        setting.limited = true;
        options?.onLimitedCheck?.();
      } else if (!checkbox.is(":checked") && setting.limited === true) {
        setting.limited = false;
        options?.onLimitedUnCheck?.();
      }
    });

    elementLabel.prepend(checkbox);
    element.append(elementLabel);

    this.checkbox = checkbox;
    this.element = element;
    this.addChildren(options?.children);
    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    this.checkbox.prop("checked", this.setting.limited);
  }
}
