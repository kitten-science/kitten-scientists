import { SupportedLocale } from "../../Engine.js";
import { KittenScientists } from "../../KittenScientists.js";
import { SettingLimitedTrigger, SettingOptions } from "../../settings/Settings.js";
import { TriggerButton } from "./buttons/TriggerButton.js";
import { SettingLimitedListItem, SettingListItemOptionsLimited } from "./SettingLimitedListItem.js";
import { SettingListItemOptions } from "./SettingListItem.js";
import { SettingListItemOptionsTrigger } from "./SettingTriggerListItem.js";
import { UiComponent } from "./UiComponent.js";

export class SettingLimitedTriggerListItem<
  TOptions extends SettingListItemOptions<UiComponent> &
    SettingListItemOptionsLimited &
    SettingListItemOptionsTrigger = SettingListItemOptions<UiComponent> &
    SettingListItemOptionsLimited &
    SettingListItemOptionsTrigger,
> extends SettingLimitedListItem {
  readonly triggerButton: TriggerButton;

  constructor(
    host: KittenScientists,
    setting: SettingLimitedTrigger,
    locale: SettingOptions<SupportedLocale>,
    label: string,
    options?: Partial<TOptions>,
  ) {
    super(host, setting, label, options);

    this.triggerButton = new TriggerButton(host, setting, locale, {
      border: false,
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
