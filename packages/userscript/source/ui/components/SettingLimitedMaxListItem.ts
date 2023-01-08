import { SettingLimitedMax } from "../../settings/Settings";
import { UserScript } from "../../UserScript";
import { MaxButton } from "./buttons-text/MaxButton";
import { SettingLimitedListItem, SettingLimitedListItemOptions } from "./SettingLimitedListItem";

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
    host: UserScript,
    label: string,
    setting: SettingLimitedMax,
    options?: Partial<SettingLimitedListItemOptions>
  ) {
    super(host, label, setting, options);

    this.maxButton = new MaxButton(host, label, setting);
    this.element.append(this.maxButton.element);
  }

  refreshUi() {
    super.refreshUi();

    this.maxButton.refreshUi();
  }
}
