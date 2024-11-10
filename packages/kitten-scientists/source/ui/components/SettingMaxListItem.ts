import { KittenScientists } from "../../KittenScientists.js";
import { SettingMax } from "../../settings/Settings.js";
import { MaxButton } from "./buttons-text/MaxButton.js";
import { SettingListItem, SettingListItemOptions } from "./SettingListItem.js";

export type SettingListItemOptionsMax = {
  readonly onSetMax: (subject: SettingMaxListItem) => void;
};

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
    host: KittenScientists,
    label: string,
    setting: SettingMax,
    options?: Partial<SettingListItemOptions & SettingListItemOptionsMax>,
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
