import { SettingMax } from "../options/Settings";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { SettingUi } from "./SettingUi";

export class SettingMaxUi {
  /**
   * Create a UI element for a setting that can have a maximum.
   * This will result in an element with a labeled checkbox and a "Max" indicator,
   * which controls the respective `max` property in the setting model.
   *
   * @param host The userscript instance.
   * @param name A unique name for this setting.
   * @param setting The setting model.
   * @param label The label for the setting.
   * to indicate that this is an upgrade of a prior setting?
   * @param handler Handlers to call when the setting is checked or unchecked.
   * @param handler.onCheck Is called when the setting is checked.
   * @param handler.onUnCheck Is called when the setting is unchecked.
   * @param delimiter Should a delimiter be rendered after this element?
   * @param upgradeIndicator Should an indicator be rendered in front of the elemnt,
   * @returns The created element.
   */
  static make(
    host: UserScript,
    name: string,
    setting: SettingMax,
    label: string,
    handler: {
      onCheck: () => void;
      onUnCheck: () => void;
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

    const maxButton = $('<div class="ks-max-button"/>', {
      id: `set-${name}-max`,
    }).data("option", setting);
    setting.$max = maxButton;

    maxButton.on("click", () => {
      const value = SettingsSectionUi.promptLimit(
        host.engine.i18n("ui.max.set", [label]),
        setting.max.toString()
      );

      if (value !== null) {
        const limit = SettingsSectionUi.renderLimit(value, host);
        host.updateOptions(() => (setting.max = value));
        maxButton[0].title = limit;
        maxButton[0].innerText = host.engine.i18n("ui.max", [limit]);
      }
    });

    element.append(maxButton);

    return element;
  }
}
