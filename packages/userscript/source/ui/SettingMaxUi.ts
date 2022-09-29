import { SettingMax } from "../options/Settings";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { SettingUi } from "./SettingUi";

export class SettingMaxUi {
  /**
   * Create a UI element for an option that can have a maximum.
   * This will result in an element with a labeled checkbox and a "Max" indicator,
   * which controls the respective `max` property in the option model.
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
   * @returns The created element.
   */
  static make(
    host: UserScript,
    name: string,
    option: SettingMax,
    label: string,
    delimiter = false,
    upgradeIndicator = false,
    handler: {
      onCheck?: () => void;
      onUnCheck?: () => void;
    } = {}
  ): JQuery<HTMLElement> {
    const element = SettingUi.make(host, name, option, label, delimiter, upgradeIndicator, handler);

    const maxButton = $("<div/>", {
      id: `set-${name}-max`,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
      },
    }).data("option", option);
    option.$max = maxButton;

    maxButton.on("click", () => {
      const value = SettingsSectionUi.promptLimit(
        host.i18n("ui.max.set", [label]),
        option.max.toString()
      );

      if (value !== null) {
        const limit = SettingsSectionUi.renderLimit(value, host);
        host.updateOptions(() => (option.max = value));
        maxButton[0].title = limit;
        maxButton[0].innerText = host.i18n("ui.max", [limit]);
      }
    });

    element.append(maxButton);

    return element;
  }
}
