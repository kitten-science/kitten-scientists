import { SettingMax } from "../../settings/Settings";
import { UserScript } from "../../UserScript";
import { MaxButton } from "./buttons-text/MaxButton";
import { SettingListItem, SettingListItemOptions } from "./SettingListItem";

export class SettingMaxListItem extends SettingListItem<SettingMax> {
  readonly maxButton: MaxButton;

  /**
   * Create a UI element for a setting that can have a maximum.
   * This will result in an element with a labeled checkbox and a "Max" indicator,
   * which controls the respective `max` property in the setting model.
   *
   * @param host The userscript instance.
   * @param label The label for the setting.
   * @param setting The setting model.
   * @param options Options for the list item.
   */
  constructor(
    host: UserScript,
    label: string,
    setting: SettingMax,
    options?: Partial<SettingListItemOptions>
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
