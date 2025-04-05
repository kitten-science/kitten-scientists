import type { SettingLimited } from "../../settings/Settings.js";
import { Container } from "./Container.js";
import stylesLabelListItem from "./LabelListItem.module.css";
import { SettingListItem, type SettingListItemOptions } from "./SettingListItem.js";
import type { UiComponent } from "./UiComponent.js";
import { LimitedButton } from "./buttons/LimitedButton.js";

export type SettingLimitedListItemOptions = ThisType<SettingLimitedListItem> &
  SettingListItemOptions & {
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
  declare readonly options: SettingLimitedListItemOptions;
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
    parent: UiComponent,
    setting: SettingLimited,
    label: string,
    options?: SettingLimitedListItemOptions,
  ) {
    super(parent, setting, label, options);

    this.limitedButton = new LimitedButton(parent, setting, {
      ...options,
    });
    this.addChildrenHead([
      new Container(parent, { classes: [stylesLabelListItem.fillSpace] }),
      this.limitedButton,
    ]);
  }

  toString(): string {
    return `[${SettingLimitedListItem.name}#${this.componentId}]: ${this.elementLabel.text()}`;
  }
}
