import { KittenScientists } from "../../KittenScientists.js";
import { SettingLimited } from "../../settings/Settings.js";
import { LimitedButton } from "./LimitedButton.js";
import { SettingListItem, SettingListItemOptions } from "./SettingListItem.js";

export type SettingListItemOptionsLimited = {
  /**
   * Is called when the "Limited" checkbox is checked.
   */
  readonly onLimitedCheck: () => void;

  /**
   * Is called when the "Limited" checkbox is unchecked.
   */
  readonly onLimitedUnCheck: () => void;
};

export class SettingLimitedListItem extends SettingListItem {
  readonly limitedButton: LimitedButton;

  /**
   * Create a UI element for a setting that can be limited.
   * This will result in an element with a checkbox that has a "Limited" label.
   *
   * @param host The userscript instance.
   * @param label The label for the setting.
   * @param setting The setting model.
   * @param options Options for the list item.
   */
  constructor(
    host: KittenScientists,
    label: string,
    setting: SettingLimited,
    options?: Partial<SettingListItemOptions & SettingListItemOptionsLimited>,
  ) {
    super(host, label, setting, options);

    this.limitedButton = new LimitedButton(host, setting, options);
    this.head.addChild(this.limitedButton);
  }

  refreshUi() {
    super.refreshUi();

    this.limitedButton.refreshUi();
  }
}
