import { Setting } from "../options/Settings";
import { clog } from "../tools/Log";
import { UserScript } from "../UserScript";

export class SettingUi {
  private static _provisionedOptionElements = new Map<string, JQuery<HTMLElement>>();

  /**
   * Construct a new setting element.
   * This is a simple checkbox with a label.
   *
   * @param host The userscript instance.
   * @param name The internal ID of this setting. Should be unique throughout the script.
   * @param setting The setting this element is linked to.
   * @param i18nName The label on the setting element.
   * @param delimiter Should there be additional padding below this element?
   * @param upgradeIndicator Should an indicator be rendered in front of the elemnt,
   * to indicate that this is an upgrade of a prior setting?
   * @param handler The event handlers for this setting element.
   * @param handler.onCheck Will be invoked when the user checks the checkbox.
   * @param handler.onUnCheck Will be invoked when the user unchecks the checkbox.
   * @returns The constructed setting element.
   */
  static make(
    host: UserScript,
    name: string,
    setting: Setting,
    i18nName: string,
    delimiter = false,
    upgradeIndicator = false,
    handler: {
      onCheck?: () => void;
      onUnCheck?: () => void;
    } = {}
  ): JQuery<HTMLElement> {
    if (SettingUi._provisionedOptionElements.has(name)) {
      throw new Error(
        `Duplicate setting ID requested! The setting ID '${name}' has already been assigned to a previously provisoned element.`
      );
    }
    const element = $(`<li class="${delimiter ? "ks-delimiter" : ""}"/>`);
    const elementLabel = `${upgradeIndicator ? `⮤ ` : ""}${i18nName}`;

    const label = $("<label/>", {
      for: `toggle-${name}`,
      text: elementLabel,
      css: {
        display: "inline-block",
        minWidth: "100px",
      },
    });

    const input = $("<input/>", {
      id: `toggle-${name}`,
      type: "checkbox",
    }).data("option", setting);
    setting.$enabled = input;

    input.on("change", () => {
      if (input.is(":checked") && setting.enabled === false) {
        if (handler.onCheck) {
          handler.onCheck();
          return;
        }

        host.updateOptions(() => (setting.enabled = true));
        clog("Unlogged action item");
      } else if (!input.is(":checked") && setting.enabled === true) {
        if (handler.onUnCheck) {
          handler.onUnCheck();
          return;
        }

        host.updateOptions(() => (setting.enabled = false));
        clog("Unlogged action item");
      }
    });

    element.append(input, label);

    SettingUi._provisionedOptionElements.set(name, element);

    return element;
  }
}
