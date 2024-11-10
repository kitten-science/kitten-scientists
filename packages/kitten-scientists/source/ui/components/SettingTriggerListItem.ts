import { KittenScientists } from "../../KittenScientists.js";
import { SettingThreshold, SettingTrigger } from "../../settings/Settings.js";
import { TriggerButton } from "./buttons-icon/TriggerButton.js";
import { SettingListItem, SettingListItemOptions } from "./SettingListItem.js";

export type SettingListItemOptionsTrigger = {
  readonly onRefreshTrigger: (subject: SettingTriggerListItem) => void;
  readonly onSetTrigger: (subject: SettingTriggerListItem) => void;
};

export class SettingTriggerListItem extends SettingListItem {
  readonly triggerButton: TriggerButton;

  constructor(
    host: KittenScientists,
    label: string,
    setting: SettingThreshold | SettingTrigger,
    options?: Partial<SettingListItemOptions & SettingListItemOptionsTrigger>,
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
