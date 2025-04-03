import type { KittenScientists } from "../../KittenScientists.js";
import type { SettingLimited } from "../../settings/Settings.js";
import { Container } from "./Container.js";
import stylesLabelListItem from "./LabelListItem.module.css";
import { SettingListItem, type SettingListItemOptions } from "./SettingListItem.js";
import { LimitedButton } from "./buttons/LimitedButton.js";

export type SettingLimitedListItemOptions = SettingListItemOptions & {
  /**
   * Is called when the "Limited" checkbox is checked.
   */
  readonly onLimitedCheck?: () => void;

  /**
   * Is called when the "Limited" checkbox is unchecked.
   */
  readonly onLimitedUnCheck?: () => void;
};

export class SettingLimitedListItem extends SettingListItem {
  declare readonly _options: SettingLimitedListItemOptions;
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
    setting: SettingLimited,
    label: string,
    options?: SettingLimitedListItemOptions,
  ) {
    super(host, setting, label, options);

    this.limitedButton = new LimitedButton(host, setting, {
      ...options,
    });
    this.head.addChildren([
      new Container(host, { classes: [stylesLabelListItem.fillSpace] }),
      this.limitedButton,
    ]);
  }

  refreshUi() {
    super.refreshUi();

    this.limitedButton.refreshUi();
  }
}
