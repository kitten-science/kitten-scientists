import type { SettingMax } from "../../settings/Settings.js";
import { MaxButton } from "./buttons/MaxButton.js";
import { Container } from "./Container.js";
import stylesLabelListItem from "./LabelListItem.module.css";
import { SettingListItem, type SettingListItemOptions } from "./SettingListItem.js";
import type { UiComponent } from "./UiComponent.js";

export type SettingMaxListItemOptions = ThisType<SettingMaxListItem> &
  SettingListItemOptions & {
    readonly onRefreshMax?: () => void;
    readonly onSetMax: () => void;
  };

export class SettingMaxListItem extends SettingListItem<SettingMax> {
  declare readonly options: SettingMaxListItemOptions;
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
    parent: UiComponent,
    setting: SettingMax,
    label: string,
    options: SettingMaxListItemOptions,
  ) {
    super(parent, setting, label, options);

    this.maxButton = new MaxButton(parent, setting, {
      border: false,
      onClick: () => {
        options.onSetMax.call(this);
        this.requestRefresh();
      },
      onRefresh: options?.onRefreshMax ? () => options.onRefreshMax?.call(this) : undefined,
    });
    this.addChildrenHead([
      new Container(parent, { classes: [stylesLabelListItem.fillSpace] }),
      this.maxButton,
    ]);
  }

  toString(): string {
    return `[${SettingMaxListItem.name}#${this.componentId}]: '${this.elementLabel.text()}'`;
  }
}
