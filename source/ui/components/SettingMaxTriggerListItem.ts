import type { SupportedLocale } from "../../Engine.js";
import type { SettingOptions, SettingTriggerMax } from "../../settings/Settings.js";
import stylesButton from "./Button.module.css";
import { Container } from "./Container.js";
import stylesLabelListItem from "./LabelListItem.module.css";
import { SettingListItem, type SettingListItemOptions } from "./SettingListItem.js";
import type { SettingMaxListItemOptions } from "./SettingMaxListItem.js";
import type { SettingTriggerListItemOptions } from "./SettingTriggerListItem.js";
import type { UiComponent } from "./UiComponent.js";
import { MaxButton } from "./buttons/MaxButton.js";
import { TriggerButton } from "./buttons/TriggerButton.js";

export type SettingMaxTriggerListItemOptions = ThisType<SettingMaxTriggerListItem> &
  SettingListItemOptions &
  SettingMaxListItemOptions &
  SettingTriggerListItemOptions;

export class SettingMaxTriggerListItem extends SettingListItem<SettingTriggerMax> {
  declare readonly options: SettingMaxTriggerListItemOptions;
  readonly maxButton: MaxButton;
  readonly triggerButton: TriggerButton;

  constructor(
    parent: UiComponent,
    setting: SettingTriggerMax,
    locale: SettingOptions<SupportedLocale>,
    label: string,
    options?: SettingMaxTriggerListItemOptions,
  ) {
    super(parent, setting, label, options);

    this.maxButton = new MaxButton(parent, setting, {
      alignment: "right",
      border: false,
      classes: [stylesButton.headAction],
      onClick: options?.onSetMax ? () => options.onSetMax?.call(this) : undefined,
      onRefresh: options?.onRefreshMax ? () => options.onRefreshMax?.call(this) : undefined,
    });
    this.triggerButton = new TriggerButton(parent, setting, locale, {
      border: false,
      classes: [stylesButton.lastHeadAction],
      onClick: options?.onSetTrigger ? () => options.onSetTrigger?.call(this) : undefined,
      onRefresh: options?.onRefreshTrigger ? () => options.onRefreshTrigger?.call(this) : undefined,
    });

    this.addChildrenHead([
      new Container(parent, { classes: [stylesLabelListItem.fillSpace] }),
      this.maxButton,
      this.triggerButton,
    ]);
  }

  toString(): string {
    return `[${SettingMaxTriggerListItem.name}#${this.componentId}]: ${this.elementLabel.text()}`;
  }
}
