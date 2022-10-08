import { SettingTrigger } from "../options/Settings";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { SettingUi } from "./SettingUi";

export class SettingTriggerUi {
  static make(
    host: UserScript,
    name: string,
    setting: SettingTrigger,
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

    if (setting.trigger !== undefined) {
      const triggerButton = SettingTriggerUi.getTriggerButton(
        host,
        `set-${name}-trigger`,
        label,
        setting
      );
      setting.$trigger = triggerButton;

      element.append(triggerButton);
    }

    return element;
  }

  /**
   * Constructs a button to configure the trigger value of an
   * automation section.
   *
   * @param host A reference to the host.
   * @param id The ID of this trigger button.
   * @param label The label of the element this trigger is associated with.
   * @param setting The setting this trigger controls.
   * @param handler Handlers to register on the control.
   * @param handler.onClick Call this method when the trigger button
   * is clicked.
   * @returns The constructed trigger button.
   */
  static getTriggerButton(
    host: UserScript,
    id: string,
    label: string,
    setting: SettingTrigger,
    handler: { onClick?: () => void } = {}
  ) {
    const triggerButton = $("<div/>", {
      id: `trigger-${id}`,
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M19.95 42 22 27.9h-7.3q-.55 0-.8-.5t0-.95L26.15 6h2.05l-2.05 14.05h7.2q.55 0 .825.5.275.5.025.95L22 42Z" /></svg>',
    }).addClass("ks-icon-button");

    triggerButton.on("click", () => {
      const value = SettingsSectionUi.promptPercentage(
        host.engine.i18n("ui.trigger.set", [label]),
        SettingsSectionUi.renderPercentage(mustExist(setting.trigger))
      );

      if (value !== null) {
        setting.trigger = value;
        host.updateOptions();
        triggerButton[0].title = SettingsSectionUi.renderPercentage(setting.trigger);
      }
    });

    if (handler.onClick) {
      triggerButton.on("click", handler.onClick);
    }

    return triggerButton;
  }
}
