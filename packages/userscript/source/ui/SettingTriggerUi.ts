import { SettingTrigger } from "../options/Settings";
import { UserScript } from "../UserScript";
import { TriggerButton } from "./components/TriggerButton";
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
      const triggerButton = new TriggerButton(host, `set-${name}-trigger`, label, setting);
      element.append(triggerButton.element);
    }

    return element;
  }
}
