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
    delimiter = false,
    upgradeIndicator = false,
    handler: {
      onCheck?: () => void;
      onUnCheck?: () => void;
    } = {}
  ): JQuery<HTMLElement> {
    const element = SettingUi.make(
      host,
      name,
      setting,
      label,
      delimiter,
      upgradeIndicator,
      [],
      handler
    );

    if (setting.trigger !== undefined) {
      const triggerButton = SettingsSectionUi.getTriggerButton(`set-${name}-trigger`, {
        onClick: () => {
          const value = SettingsSectionUi.promptPercentage(
            host.i18n("ui.trigger.set", [label]),
            SettingsSectionUi.renderPercentage(mustExist(setting.trigger))
          );

          if (value !== null) {
            setting.trigger = value;
            host.updateOptions();
            triggerButton[0].title = SettingsSectionUi.renderPercentage(setting.trigger);
          }
        },
      });
      setting.$trigger = triggerButton;

      element.append(triggerButton);
    }

    return element;
  }
}
