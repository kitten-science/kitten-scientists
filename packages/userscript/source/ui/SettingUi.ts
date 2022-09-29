import { Setting } from "../options/Settings";
import { clog } from "../tools/Log";
import { UserScript } from "../UserScript";

export class SettingUi {
  private static _provisionedOptionElements = new Map<string, JQuery<HTMLElement>>();

  /**
   * Construct a new option element.
   * This is a simple checkbox with a label.
   *
   * @param host The userscript instance.
   * @param name The internal ID of this option. Should be unique throughout the script.
   * @param option The option this element is linked to.
   * @param i18nName The label on the option element.
   * @param delimiter Should there be additional padding below this element?
   * @param upgradeIndicator Should an indicator be rendered in front of the elemnt,
   * to indicate that this is an upgrade of a prior option?
   * @param handler The event handlers for this option element.
   * @param handler.onCheck Will be invoked when the user checks the checkbox.
   * @param handler.onUnCheck Will be invoked when the user unchecks the checkbox.
   * @returns The constructed option element.
   */
  static make(
    host: UserScript,
    name: string,
    option: Setting,
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
        `Duplicate option ID requested! The option ID '${name}' has already been assigned to a previously provisoned element.`
      );
    }
    const element = $("<li/>");
    const elementLabel = `${upgradeIndicator ? `⮤ ` : ""}${i18nName}`;

    const label = $("<label/>", {
      for: `toggle-${name}`,
      text: elementLabel,
      css: {
        display: "inline-block",
        marginBottom: delimiter ? "10px" : undefined,
        minWidth: "100px",
      },
    });

    const input = $("<input/>", {
      id: `toggle-${name}`,
      type: "checkbox",
    }).data("option", option);
    option.$enabled = input;

    input.on("change", () => {
      if (input.is(":checked") && option.enabled === false) {
        if (handler.onCheck) {
          handler.onCheck();
          return;
        }

        host.updateOptions(() => (option.enabled = true));
        clog("Unlogged action item");
      } else if (!input.is(":checked") && option.enabled === true) {
        if (handler.onUnCheck) {
          handler.onUnCheck();
          return;
        }

        host.updateOptions(() => (option.enabled = false));
        clog("Unlogged action item");
      }
    });

    element.append(input, label);

    SettingUi._provisionedOptionElements.set(name, element);

    return element;
  }
}
