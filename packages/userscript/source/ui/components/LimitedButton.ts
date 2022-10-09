import { SettingLimited } from "../../options/Settings";
import { UserScript } from "../../UserScript";
import { UiComponent } from "./UiComponent";

export class LimitedButton extends UiComponent {
  readonly setting: SettingLimited;
  readonly element: JQuery<HTMLElement>;
  readonly checkbox: JQuery<HTMLElement>;

  constructor(
    host: UserScript,
    id: string,
    setting: SettingLimited,
    handler: { onLimitedCheck: () => void; onLimitedUnCheck: () => void }
  ) {
    super(host);
    const element = $(`<span/>`);
    const elementLabel = $("<label/>", {
      for: `toggle-limited-${id}`,
      text: host.engine.i18n("ui.limit"),
    });

    const checkbox = $("<input/>", {
      id: `toggle-limited-${id}`,
      type: "checkbox",
    });

    checkbox.on("change", () => {
      if (checkbox.is(":checked") && setting.limited === false) {
        setting.limited = true;
        host.updateOptions();
        handler.onLimitedCheck();
      } else if (!checkbox.is(":checked") && setting.limited === true) {
        setting.limited = false;
        host.updateOptions();
        handler.onLimitedUnCheck();
      }
    });

    element.append(checkbox, elementLabel);

    setting.$limited = this;

    this.checkbox = checkbox;
    this.element = element;
    this.setting = setting;
  }

  refreshUi() {
    this.checkbox.prop("checked", this.setting.limited);
  }
}
