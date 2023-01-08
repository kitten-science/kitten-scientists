import { SettingTrigger } from "../../settings/Settings";
import { UserScript } from "../../UserScript";
import { TriggerButton, TriggerButtonBehavior } from "./buttons-icon/TriggerButton";
import { SettingListItem, SettingListItemOptions } from "./SettingListItem";

export type SettingTriggerListItemOptions = SettingListItemOptions & {
  behavior: TriggerButtonBehavior;
};

export class SettingTriggerListItem extends SettingListItem {
  readonly triggerButton: TriggerButton;

  constructor(
    host: UserScript,
    label: string,
    setting: SettingTrigger,
    options?: Partial<SettingTriggerListItemOptions>
  ) {
    super(host, label, setting, options);

    this.triggerButton = new TriggerButton(host, label, setting, options?.behavior);
    this.element.append(this.triggerButton.element);
  }

  refreshUi() {
    super.refreshUi();

    this.triggerButton.refreshUi();
  }
}
