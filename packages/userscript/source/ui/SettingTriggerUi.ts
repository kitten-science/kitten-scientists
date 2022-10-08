import { SettingTrigger } from "../options/Settings";
import { UserScript } from "../UserScript";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";

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
  ): SettingTriggerListItem {
    return new SettingTriggerListItem(
      host,
      name,
      label,
      setting,
      handler,
      delimiter,
      upgradeIndicator
    );
  }
}
