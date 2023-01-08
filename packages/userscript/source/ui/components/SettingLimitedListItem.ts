import { SettingLimited } from "../../settings/Settings";
import { UserScript } from "../../UserScript";
import { LimitedButton } from "./LimitedButton";
import { SettingListItem, SettingListItemOptions } from "./SettingListItem";

export type SettingLimitedListItemOptions = SettingListItemOptions & {
  /**
   * Is called when the "Limited" checkbox is checked.
   */
  onLimitedCheck: () => void;

  /**
   * Is called when the "Limited" checkbox is unchecked.
   */
  onLimitedUnCheck: () => void;
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
    host: UserScript,
    label: string,
    setting: SettingLimited,
    options?: Partial<SettingLimitedListItemOptions>
  ) {
    super(host, label, setting, options);

    this.limitedButton = new LimitedButton(host, setting, options);
    this.element.append(this.limitedButton.element);
  }

  refreshUi() {
    super.refreshUi();

    this.limitedButton.refreshUi();
  }
}
