import { KittenScientists } from "../../KittenScientists.js";
import { SettingLimitedMaxTrigger } from "../../settings/Settings.js";
import { TriggerButton } from "./buttons-icon/TriggerButton.js";
import { SettingLimitedListItem, SettingListItemOptionsLimited } from "./SettingLimitedListItem.js";
import { SettingListItemOptions } from "./SettingListItem.js";
import { SettingListItemOptionsTrigger } from "./SettingTriggerListItem.js";

export class SettingLimitedTriggerListItem extends SettingLimitedListItem {
  readonly triggerButton: TriggerButton;

  constructor(
    host: KittenScientists,
    label: string,
    setting: SettingLimitedMaxTrigger,
    options?: Partial<
      SettingListItemOptions & SettingListItemOptionsLimited & SettingListItemOptionsTrigger
    >,
  ) {
    super(host, label, setting, options);

    this.triggerButton = new TriggerButton(host, label, setting);
    this.head.addChild(this.triggerButton);
  }

  refreshUi() {
    super.refreshUi();

    this.triggerButton.refreshUi();
  }
}
