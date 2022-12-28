import { SettingLimited } from "../../settings/Settings";
import { UserScript } from "../../UserScript";
import { UiComponent } from "./UiComponent";

export class LimitedButton extends UiComponent {
  readonly setting: SettingLimited;
  readonly element: JQuery<HTMLElement>;
  readonly checkbox: JQuery<HTMLElement>;

  constructor(
    host: UserScript,
    setting: SettingLimited,
    handler: { onLimitedCheck: () => void; onLimitedUnCheck: () => void }
  ) {
    super(host);

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
        handler.onLimitedCheck();
      } else if (!checkbox.is(":checked") && setting.limited === true) {
        setting.limited = false;
        handler.onLimitedUnCheck();
      }
    });

    elementLabel.prepend(checkbox);
    element.append(elementLabel);

    this.checkbox = checkbox;
    this.element = element;
    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    this.checkbox.prop("checked", this.setting.limited);
  }
}
