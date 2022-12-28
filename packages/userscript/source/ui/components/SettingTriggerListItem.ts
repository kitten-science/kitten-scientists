import { SettingTrigger } from "../../settings/Settings";
import { UserScript } from "../../UserScript";
import { TriggerButton, TriggerButtonBehavior } from "./buttons-icon/TriggerButton";
import { SettingListItem } from "./SettingListItem";

export class SettingTriggerListItem extends SettingListItem {
  readonly triggerButton: TriggerButton;

  constructor(
    host: UserScript,
    label: string,
    setting: SettingTrigger,
    behavior: TriggerButtonBehavior = "percentage",
    handler: {
      onCheck: () => void;
      onUnCheck: () => void;
    },
    delimiter = false,
    upgradeIndicator = false
  ) {
    super(host, label, setting, handler, delimiter, upgradeIndicator);

    this.triggerButton = new TriggerButton(host, label, setting, behavior);
    this.element.append(this.triggerButton.element);
  }

  refreshUi() {
    super.refreshUi();

    this.triggerButton.refreshUi();
  }
}
