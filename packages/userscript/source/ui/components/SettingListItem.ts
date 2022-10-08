import { Setting } from "../../options/Settings";
import { UserScript } from "../../UserScript";

export class SettingListItem {
  private static _provisionedOptionElements = new Map<string, SettingListItem>();

  readonly host: UserScript;
  readonly setting: Setting;
  readonly element: JQuery<HTMLElement>;
  readonly checkbox: JQuery<HTMLElement>;

  /**
   * Construct a new setting element.
   * This is a simple checkbox with a label.
   *
   * @param host The userscript instance.
   * @param id The internal ID of this setting. Should be unique throughout the script.
   * @param label The label on the setting element.
   * @param setting The setting this element is linked to.
   * @param handler The event handlers for this setting element.
   * @param handler.onCheck Will be invoked when the user checks the checkbox.
   * @param handler.onUnCheck Will be invoked when the user unchecks the checkbox.
   * @param delimiter Should there be additional padding below this element?
   * @param upgradeIndicator Should an indicator be rendered in front of the elemnt,
   * to indicate that this is an upgrade of a prior setting?
   * @param additionalClasses A list of CSS classes to attach to the element.
   */
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
    if (SettingListItem._provisionedOptionElements.has(id)) {
      throw new Error(
        `Duplicate setting ID requested! The setting ID '${id}' has already been assigned to a previously provisoned element.`
      );
    }

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

    SettingListItem._provisionedOptionElements.set(id, this);
  }

  refreshUi() {
    this.checkbox.prop("checked", this.setting.enabled);
  }
}
