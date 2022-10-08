import { SettingLimited } from "../options/Settings";
import { clog } from "../tools/Log";
import { UserScript } from "../UserScript";
import { SettingUi } from "./SettingUi";

export class SettingLimitedUi {
  /**
   * Create a UI element for a setting that can be limited.
   * This will result in an element with a checkbox that has a "Limited" label.
   *
   * @param host The userscript instance.
   * @param name A unique name for this setting.
   * @param setting The setting model.
   * @param label The label for the setting.
   * @param handler Handlers to call when the setting is checked or unchecked.
   * @param handler.onCheck Is called when the setting is checked.
   * @param handler.onUnCheck Is called when the setting is unchecked.
   * @param handler.onLimitedCheck Is called when the "Limited" checkbox is checked.
   * @param handler.onLimitedUnCheck Is called when the "Limited" checkbox is unchecked.
   * @param delimiter Should a delimiter be rendered after this element?
   * @param upgradeIndicator Should an indicator be rendered in front of the elemnt,
   * to indicate that this is an upgrade of a prior setting?
   * @returns The created element.
   */
  static make(
    host: UserScript,
    name: string,
    setting: SettingLimited,
    label: string,
    handler: {
      onCheck: () => void;
      onUnCheck: () => void;
      onLimitedCheck?: () => void;
      onLimitedUnCheck?: () => void;
    },
    delimiter = false,
    upgradeIndicator = false
  ): JQuery<HTMLElement> {
    const element = SettingUi.make(
      host,
      name,
      setting,
      label,
      handler,
      delimiter,
      upgradeIndicator,
      []
    );

    const labelElement = $("<label/>", {
      for: `toggle-limited-${name}`,
      text: host.engine.i18n("ui.limit"),
    });

    const input = $("<input/>", {
      id: `toggle-limited-${name}`,
      type: "checkbox",
    });
    setting.$limited = input;

    input.on("change", () => {
      if (input.is(":checked") && setting.limited === false) {
        if (handler.onLimitedCheck) {
          handler.onLimitedCheck();
          return;
        }

        host.updateOptions(() => (setting.limited = true));
        clog("Unlogged action item");
      } else if (!input.is(":checked") && setting.limited === true) {
        if (handler.onLimitedUnCheck) {
          handler.onLimitedUnCheck();
          return;
        }

        host.updateOptions(() => (setting.limited = false));
        clog("Unlogged action item");
      }
    });

    element.append(input, labelElement);

    return element;
  }
}
