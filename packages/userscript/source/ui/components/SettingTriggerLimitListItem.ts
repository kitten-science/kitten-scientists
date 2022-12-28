import { SettingTrigger } from "../../settings/Settings";
import { UserScript } from "../../UserScript";
import { TriggerLimitButton } from "./buttons-text/TriggerLimitButton";
import { SettingListItem } from "./SettingListItem";

export class SettingTriggerLimitListItem extends SettingListItem {
  readonly triggerButton: TriggerLimitButton;

  constructor(
    host: UserScript,
    label: string,
    setting: SettingTrigger,
    handler: {
      onCheck: () => void;
      onUnCheck: () => void;
    },
    delimiter = false,
    upgradeIndicator = false
  ) {
    super(host, label, setting, handler, delimiter, upgradeIndicator);

    this.triggerButton = new TriggerLimitButton(host, label, setting);
    this.element.append(this.triggerButton.element);
  }

  refreshUi() {
    super.refreshUi();

    this.triggerButton.refreshUi();
  }
}
