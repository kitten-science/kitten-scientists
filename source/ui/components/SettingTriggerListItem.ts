import type { SupportedLocale } from "../../Engine.js";
import type { SettingOptions, SettingThreshold, SettingTrigger } from "../../settings/Settings.js";
import { TriggerButton } from "./buttons/TriggerButton.js";
import { Container } from "./Container.js";
import stylesLabelListItem from "./LabelListItem.module.css";
import { SettingListItem, type SettingListItemOptions } from "./SettingListItem.js";
import type { UiComponent } from "./UiComponent.js";

export type SettingTriggerListItemOptions = ThisType<SettingTriggerListItem> &
  SettingListItemOptions & {
    readonly onRefreshTrigger?: () => void | Promise<void>;
    readonly onSetTrigger: () => void | Promise<void>;
    readonly renderLabelTrigger?: boolean;
  };

export class SettingTriggerListItem<
  TSetting extends SettingTrigger | SettingThreshold = SettingTrigger | SettingThreshold,
> extends SettingListItem<TSetting> {
  declare readonly options: SettingTriggerListItemOptions;
  readonly triggerButton: TriggerButton;

  constructor(
    parent: UiComponent,
    setting: TSetting,
    locale: SettingOptions<SupportedLocale>,
    label: string,
    options: SettingTriggerListItemOptions,
  ) {
    super(parent, setting, label, options);

    this.triggerButton = new TriggerButton(parent, setting, locale, {
      alignment: "right",
      border: false,
      onClick: async () => {
        await options.onSetTrigger.call(this);
      },
      onRefresh: options?.onRefreshTrigger ? () => options.onRefreshTrigger?.call(this) : undefined,
      renderLabel: options?.renderLabelTrigger ?? true,
    });
    this.addChildrenHead([
      new Container(parent, { classes: [stylesLabelListItem.fillSpace] }),
      this.triggerButton,
    ]);
  }

  toString(): string {
    return `[${SettingTriggerListItem.name}#${this.componentId}]: '${this.elementLabel.text()}'`;
  }
}
