import { KittenScientists } from "../../KittenScientists.js";
import { SettingLimitedMaxTrigger } from "../../settings/Settings.js";
import { TriggerButton } from "./buttons-icon/TriggerButton.js";
import { SettingListItemOptionsLimited } from "./SettingLimitedListItem.js";
import { SettingLimitedMaxListItem } from "./SettingLimitedMaxListItem.js";
import { SettingListItemOptions } from "./SettingListItem.js";
import { SettingListItemOptionsMax } from "./SettingMaxListItem.js";
import { SettingListItemOptionsTrigger } from "./SettingTriggerListItem.js";

export class SettingLimitedMaxTriggerListItem extends SettingLimitedMaxListItem {
  readonly triggerButton: TriggerButton;

  constructor(
    host: KittenScientists,
    label: string,
    setting: SettingLimitedMaxTrigger,
    options?: Partial<
      SettingListItemOptions &
        SettingListItemOptionsLimited &
        SettingListItemOptionsMax &
        SettingListItemOptionsTrigger
    >,
  ) {
    super(host, label, setting, options);

    this.triggerButton = new TriggerButton(host, label, setting, {
      onClick: options?.onSetTrigger ? () => options.onSetTrigger?.(this) : undefined,
      onRefreshTitle: options?.onRefreshTrigger
        ? () => options.onRefreshTrigger?.(this)
        : undefined,
    });
    this.head.addChild(this.triggerButton);
  }

  refreshUi() {
    super.refreshUi();

    this.triggerButton.refreshUi();
  }
}
