import { Setting } from "../../options/Settings";
import { UserScript } from "../../UserScript";

export class SettingListItem {
  readonly host: UserScript;
  readonly setting: Setting;
  readonly element: JQuery<HTMLElement>;
  readonly checkbox: JQuery<HTMLElement>;

  constructor(
    host: UserScript,
    id: string,
    label: string,
    setting: Setting,
    handler: {
      onCheck: () => void;
      onUnCheck: () => void;
    },
    delimiter = false,
    upgradeIndicator = false,
    additionalClasses = []
  ) {
    const element = $(`<li/>`);
    for (const cssClass of ["ks-setting", delimiter ? "ks-delimiter" : "", ...additionalClasses]) {
      element.addClass(cssClass);
    }

    const elementLabel = $("<label/>", {
      for: `toggle-${id}`,
      text: `${upgradeIndicator ? `⮤ ` : ""}${label}`,
    }).addClass("ks-label");

    const checkbox = $("<input/>", {
      id: `toggle-${id}`,
      type: "checkbox",
    }).addClass("ks-checkbox");

    checkbox.on("change", () => {
      if (checkbox.is(":checked") && setting.enabled === false) {
        handler.onCheck();
        host.updateOptions(() => (setting.enabled = true));
      } else if (!checkbox.is(":checked") && setting.enabled === true) {
        handler.onUnCheck();
        host.updateOptions(() => (setting.enabled = false));
      }
    });

    element.append(checkbox, elementLabel);

    setting.$enabled = this;

    this.checkbox = checkbox;
    this.element = element;
    this.host = host;
    this.setting = setting;
  }

  refreshUi() {
    this.checkbox.prop("checked", this.setting.enabled);
  }
}
