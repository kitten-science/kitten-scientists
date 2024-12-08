import { SupportedLocale } from "../../Engine.js";
import { KittenScientists } from "../../KittenScientists.js";
import { SettingLimitedMaxTrigger, SettingOptions } from "../../settings/Settings.js";
import { TriggerButton } from "./buttons/TriggerButton.js";
import { SettingLimitedListItem, SettingListItemOptionsLimited } from "./SettingLimitedListItem.js";
import { SettingListItemOptions } from "./SettingListItem.js";
import { SettingListItemOptionsTrigger } from "./SettingTriggerListItem.js";

export class SettingLimitedTriggerListItem extends SettingLimitedListItem {
  readonly triggerButton: TriggerButton;

  constructor(
    host: KittenScientists,
    setting: SettingLimitedMaxTrigger,
    locale: SettingOptions<SupportedLocale>,
    label: string,
    options?: Partial<
      SettingListItemOptions & SettingListItemOptionsLimited & SettingListItemOptionsTrigger
    >,
  ) {
    super(host, label, setting, options);

    this.triggerButton = new TriggerButton(host, setting, locale, {
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
