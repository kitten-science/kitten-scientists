import type { SupportedLocale } from "../../Engine.js";
import type { KittenScientists } from "../../KittenScientists.js";
import type { SettingLimitedTrigger, SettingOptions } from "../../settings/Settings.js";
import {
  SettingLimitedListItem,
  type SettingListItemOptionsLimited,
} from "./SettingLimitedListItem.js";
import type { SettingListItemOptions } from "./SettingListItem.js";
import type { SettingListItemOptionsTrigger } from "./SettingTriggerListItem.js";
import type { UiComponent } from "./UiComponent.js";
import { TriggerButton } from "./buttons/TriggerButton.js";

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
