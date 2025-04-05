import type { SupportedLocale } from "../../Engine.js";
import type { SettingLimitedTrigger, SettingOptions } from "../../settings/Settings.js";
import {
  SettingLimitedListItem,
  type SettingLimitedListItemOptions,
} from "./SettingLimitedListItem.js";
import type { SettingListItemOptions } from "./SettingListItem.js";
import type { SettingTriggerListItemOptions } from "./SettingTriggerListItem.js";
import type { UiComponent } from "./UiComponent.js";
import { TriggerButton } from "./buttons/TriggerButton.js";

export type SettingLimitedTriggerListItemOptions = SettingListItemOptions &
  SettingLimitedListItemOptions &
  SettingTriggerListItemOptions &
  ThisType<SettingLimitedTriggerListItem>;

export class SettingLimitedTriggerListItem extends SettingLimitedListItem {
  declare readonly options: SettingLimitedTriggerListItemOptions;
  readonly triggerButton: TriggerButton;

  constructor(
    parent: UiComponent,
    setting: SettingLimitedTrigger,
    locale: SettingOptions<SupportedLocale>,
    label: string,
    options?: SettingLimitedTriggerListItemOptions,
  ) {
    super(parent, setting, label, options);

    this.triggerButton = new TriggerButton(parent, setting, locale, {
      border: false,
      onClick: options?.onSetTrigger ? () => options.onSetTrigger?.call(this) : undefined,
      onRefresh: options?.onRefreshTrigger ? () => options.onRefreshTrigger?.call(this) : undefined,
    });
    this.addChildHead(this.triggerButton);
  }

  toString(): string {
    return `[${SettingLimitedTriggerListItem.name}#${this.componentId}]: ${this.elementLabel.text()}`;
  }
}
