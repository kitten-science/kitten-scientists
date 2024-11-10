import { KittenScientists } from "../../KittenScientists.js";
import { SettingTriggerMax } from "../../settings/Settings.js";
import { PaddingButton } from "./buttons-icon/PaddingButton.js";
import { TriggerButton } from "./buttons-icon/TriggerButton.js";
import { MaxButton } from "./buttons-text/MaxButton.js";
import { SettingListItem, SettingListItemOptions } from "./SettingListItem.js";
import { SettingListItemOptionsMax } from "./SettingMaxListItem.js";
import { SettingListItemOptionsTrigger } from "./SettingTriggerListItem.js";

export class SettingMaxTriggerListItem extends SettingListItem<SettingTriggerMax> {
  readonly maxButton: MaxButton;
  readonly triggerButton: TriggerButton;

  constructor(
    host: KittenScientists,
    label: string,
    setting: SettingTriggerMax,
    options?: Partial<
      SettingListItemOptions & SettingListItemOptionsMax & SettingListItemOptionsTrigger
    >,
  ) {
    super(host, label, setting, options);

    this.maxButton = new MaxButton(host, label, setting, {
      onClick: options?.onSetMax ? () => options.onSetMax?.(this) : undefined,
    });
    this.triggerButton = new TriggerButton(host, label, setting, {
      onClick: options?.onSetTrigger ? () => options.onSetTrigger?.(this) : undefined,
      onRefreshTitle: options?.onRefreshTrigger
        ? () => options.onRefreshTrigger?.(this)
        : undefined,
    });

    this.head.addChildren([this.maxButton, this.triggerButton, new PaddingButton(host)]);
  }
}
