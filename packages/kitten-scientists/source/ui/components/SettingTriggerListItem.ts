import { KittenScientists } from "../../KittenScientists.js";
import { SettingTrigger } from "../../settings/Settings.js";
import { TriggerButton, TriggerButtonBehavior } from "./buttons-icon/TriggerButton.js";
import { SettingListItem, SettingListItemOptions } from "./SettingListItem.js";

export type SettingTriggerListItemOptions = SettingListItemOptions & {
  readonly behavior: TriggerButtonBehavior;
};

export class SettingTriggerListItem extends SettingListItem {
  readonly triggerButton: TriggerButton;

  constructor(
    host: KittenScientists,
    label: string,
    setting: SettingTrigger,
    options?: Partial<SettingTriggerListItemOptions>,
  ) {
    super(host, label, setting, options);

    this.triggerButton = new TriggerButton(host, label, setting);
    this.element.append(this.triggerButton.element);
  }

  refreshUi() {
    super.refreshUi();

    this.triggerButton.refreshUi();
  }
}
