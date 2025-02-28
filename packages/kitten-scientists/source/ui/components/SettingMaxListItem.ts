import type { KittenScientists } from "../../KittenScientists.js";
import type { SettingMax } from "../../settings/Settings.js";
import { Container } from "./Container.js";
import stylesLabelListItem from "./LabelListItem.module.css";
import { SettingListItem, type SettingListItemOptions } from "./SettingListItem.js";
import type { UiComponent } from "./UiComponent.js";
import { MaxButton } from "./buttons/MaxButton.js";

export type SettingListItemOptionsMax = {
  readonly onRefreshMax: (subject: SettingMaxListItem) => void;
  readonly onSetMax: (subject: SettingMaxListItem) => void;
};

export class SettingMaxListItem<
  TOptions extends SettingListItemOptions<UiComponent> &
    SettingListItemOptionsMax = SettingListItemOptions<UiComponent> & SettingListItemOptionsMax,
> extends SettingListItem<SettingMax> {
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
    setting: SettingMax,
    label: string,
    options?: Partial<TOptions>,
  ) {
    super(host, setting, label, options);

    this.maxButton = new MaxButton(host, setting, {
      border: false,
      onClick: options?.onSetMax ? () => options.onSetMax?.(this) : undefined,
      onRefresh: options?.onRefreshMax ? () => options.onRefreshMax?.(this) : undefined,
    });
    this.head.addChildren([
      new Container(host, { classes: [stylesLabelListItem.fillSpace] }),
      this.maxButton,
    ]);
  }

  refreshUi() {
    super.refreshUi();

    this.maxButton.refreshUi();
  }
}
