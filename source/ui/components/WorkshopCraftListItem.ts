import type { SupportedLocale } from "../../Engine.js";
import type { SettingOptions } from "../../settings/Settings.js";
import type { CraftSettingsItem } from "../../settings/WorkshopSettings.js";
import stylesButton from "./Button.module.css";
import { Container } from "./Container.js";
import stylesLabelListItem from "./LabelListItem.module.css";
import stylesListItem from "./ListItem.module.css";
import type { SettingLimitedListItemOptions } from "./SettingLimitedListItem.js";
import { SettingListItem, type SettingListItemOptions } from "./SettingListItem.js";
import type { SettingMaxListItemOptions } from "./SettingMaxListItem.js";
import type { SettingTriggerListItemOptions } from "./SettingTriggerListItem.js";
import type { UiComponent } from "./UiComponent.js";
import { LimitedButton } from "./buttons/LimitedButton.js";
import { MaxButton } from "./buttons/MaxButton.js";
import { TriggerButton } from "./buttons/TriggerButton.js";

export type WorkshopCraftListItemOptions = SettingListItemOptions &
  SettingLimitedListItemOptions &
  SettingMaxListItemOptions &
  SettingTriggerListItemOptions &
  ThisType<WorkshopCraftListItem>;

export class WorkshopCraftListItem extends SettingListItem<CraftSettingsItem> {
  declare readonly options: WorkshopCraftListItemOptions;
  readonly limitedButton: LimitedButton;
  readonly maxButton: MaxButton;
  readonly triggerButton: TriggerButton;

  constructor(
    parent: UiComponent,
    setting: CraftSettingsItem,
    locale: SettingOptions<SupportedLocale>,
    label: string,
    options?: WorkshopCraftListItemOptions,
  ) {
    super(parent, setting, label, options);

    this.limitedButton = new LimitedButton(parent, setting, {
      ...options,
      classes: [stylesListItem.headAction],
    });

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
      this.limitedButton,
      this.maxButton,
      this.triggerButton,
    ]);
  }

  toString(): string {
    return `[${WorkshopCraftListItem.name}#${this.componentId}]`;
  }
}
