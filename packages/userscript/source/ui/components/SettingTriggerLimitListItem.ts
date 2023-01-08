import { SettingTrigger } from "../../settings/Settings";
import { UserScript } from "../../UserScript";
import { TriggerLimitButton } from "./buttons-text/TriggerLimitButton";
import { SettingListItem, SettingListItemOptions } from "./SettingListItem";

export class SettingTriggerLimitListItem extends SettingListItem {
  readonly triggerButton: TriggerLimitButton;

  constructor(
    host: UserScript,
    label: string,
    setting: SettingTrigger,
    options?: Partial<SettingListItemOptions>
  ) {
    super(host, label, setting, options);

    this.triggerButton = new TriggerLimitButton(host, label, setting);
    this.element.append(this.triggerButton.element);
  }

  refreshUi() {
    super.refreshUi();

    this.triggerButton.refreshUi();
  }
}
