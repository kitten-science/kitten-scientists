import { SettingLimited } from "../options/Settings";
import { clog } from "../tools/Log";
import { UserScript } from "../UserScript";
import { SettingUi } from "./SettingUi";

export class SettingLimitedUi {
  /**
   * Create a UI element for an option that can be limited.
   * This will result in an element with a checkbox that has a "Limited" label.
   *
   * @param host The userscript instance.
   * @param name A unique name for this option.
   * @param option The option model.
   * @param label The label for the option.
   * @param delimiter Should a delimiter be rendered after this element?
   * @param upgradeIndicator Should an indicator be rendered in front of the elemnt,
   * to indicate that this is an upgrade of a prior option?
   * @param handler Handlers to call when the option is checked or unchecked.
   * @param handler.onCheck Is called when the option is checked.
   * @param handler.onUnCheck Is called when the option is unchecked.
   * @param handler.onLimitedCheck Is called when the "Limited" checkbox is checked.
   * @param handler.onLimitedUnCheck Is called when the "Limited" checkbox is unchecked.
   * @returns The created element.
   */
  static make(
    host: UserScript,
    name: string,
    option: SettingLimited,
    label: string,
    delimiter = false,
    upgradeIndicator = false,
    handler: {
      onCheck?: () => void;
      onUnCheck?: () => void;
      onLimitedCheck?: () => void;
      onLimitedUnCheck?: () => void;
    } = {}
  ): JQuery<HTMLElement> {
    const element = SettingUi.make(host, name, option, label, delimiter, upgradeIndicator, handler);

    const labelElement = $("<label/>", {
      for: `toggle-limited-${name}`,
      text: host.i18n("ui.limit"),
    });

    const input = $("<input/>", {
      id: `toggle-limited-${name}`,
      type: "checkbox",
    }).data("option", option);
    option.$limited = input;

    input.on("change", () => {
      if (input.is(":checked") && option.limited === false) {
        if (handler.onLimitedCheck) {
          handler.onLimitedCheck();
          return;
        }

        host.updateOptions(() => (option.limited = true));
        clog("Unlogged action item");
      } else if (!input.is(":checked") && option.limited === true) {
        if (handler.onLimitedUnCheck) {
          handler.onLimitedUnCheck();
          return;
        }

        host.updateOptions(() => (option.limited = false));
        clog("Unlogged action item");
      }
    });

    element.append(input, labelElement);

    return element;
  }
}
