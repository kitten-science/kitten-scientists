import { KittenScientists } from "../../KittenScientists.js";
import { SettingLimitedMax } from "../../settings/Settings.js";
import { MaxButton } from "./buttons-text/MaxButton.js";
import { SettingLimitedListItem, SettingListItemOptionsLimited } from "./SettingLimitedListItem.js";
import { SettingListItemOptions } from "./SettingListItem.js";
import { SettingListItemOptionsMax } from "./SettingMaxListItem.js";

export class SettingLimitedMaxListItem extends SettingLimitedListItem {
  readonly maxButton: MaxButton;

  /**
   * Create a UI element for a setting that can be limited and has a maximum.
   * This will result in an element with a checkbox that has a "Limited" label
   * and control the `limited` property of the setting.
   * It will also have a "Max" indicator, which controls the respective `max`
   * property in the setting model.
   *
   * @param host The userscript instance.
   * @param label The label for the setting.
   * @param setting The setting model.
   * @param options Options for the list item.
   */
  constructor(
    host: KittenScientists,
    label: string,
    setting: SettingLimitedMax,
    options?: Partial<
      SettingListItemOptions & SettingListItemOptionsLimited & SettingListItemOptionsMax
    >,
  ) {
    super(host, label, setting, options);

    this.maxButton = new MaxButton(host, label, setting);
    this.head.addChild(this.maxButton);
  }

  refreshUi() {
    super.refreshUi();

    this.maxButton.refreshUi();
  }
}
