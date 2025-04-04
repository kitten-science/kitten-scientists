import type { SupportedLocale } from "../../Engine.js";
import type { KittenScientists } from "../../KittenScientists.js";
import type { SettingLimitedTrigger, SettingOptions } from "../../settings/Settings.js";
import {
  SettingLimitedListItem,
  type SettingLimitedListItemOptions,
} from "./SettingLimitedListItem.js";
import type { SettingListItemOptions } from "./SettingListItem.js";
import type { SettingTriggerListItemOptions } from "./SettingTriggerListItem.js";
import { TriggerButton } from "./buttons/TriggerButton.js";

export type SettingLimitedTriggerListItemOptions = SettingListItemOptions &
  SettingLimitedListItemOptions &
  SettingTriggerListItemOptions &
  ThisType<SettingLimitedTriggerListItem>;

export class SettingLimitedTriggerListItem extends SettingLimitedListItem {
  declare readonly _options: SettingLimitedTriggerListItemOptions;
  readonly triggerButton: TriggerButton;

  constructor(
    host: KittenScientists,
    setting: SettingLimitedTrigger,
    locale: SettingOptions<SupportedLocale>,
    label: string,
    options?: SettingLimitedTriggerListItemOptions,
  ) {
    super(host, setting, label, options);

    this.triggerButton = new TriggerButton(host, setting, locale, {
      border: false,
      onClick: async (event?: MouseEvent) => {
        await this._options.onSetTrigger.call(this);
        this.refreshUi();
      },
      onRefreshTitle: options?.onRefreshTrigger
        ? () => options.onRefreshTrigger?.call(this)
        : undefined,
    });
    this.head.addChild(this.triggerButton);
  }

  refreshUi() {
    super.refreshUi();

    this.triggerButton.refreshUi();
  }
}
