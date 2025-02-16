import { SupportedLocale } from "../../Engine.js";
import { KittenScientists } from "../../KittenScientists.js";
import { SettingOptions, SettingThreshold, SettingTrigger } from "../../settings/Settings.js";
import { TriggerButton } from "./buttons/TriggerButton.js";
import { Container } from "./Container.js";
import stylesLabelListItem from "./LabelListItem.module.css";
import { SettingListItem, SettingListItemOptions } from "./SettingListItem.js";
import { UiComponent } from "./UiComponent.js";

export type SettingListItemOptionsTrigger = {
  readonly onRefreshTrigger: (subject: SettingTriggerListItem) => void;
  readonly onSetTrigger: (subject: SettingTriggerListItem) => void;
};

export class SettingTriggerListItem<
  TOptions extends SettingListItemOptions<UiComponent> &
    SettingListItemOptionsTrigger = SettingListItemOptions<UiComponent> &
    SettingListItemOptionsTrigger,
> extends SettingListItem {
  readonly triggerButton: TriggerButton;

  constructor(
    host: KittenScientists,
    setting: SettingThreshold | SettingTrigger,
    locale: SettingOptions<SupportedLocale>,
    label: string,
    options?: Partial<TOptions>,
  ) {
    super(host, setting, label, options);

    this.triggerButton = new TriggerButton(host, setting, locale, {
      alignment: "right",
      border: false,
      onClick: options?.onSetTrigger ? () => options.onSetTrigger?.(this) : undefined,
      onRefreshTitle: options?.onRefreshTrigger
        ? () => options.onRefreshTrigger?.(this)
        : undefined,
    });
    this.head.addChild(new Container(host, { classes: [stylesLabelListItem.fillSpace] }));
    this.head.addChild(this.triggerButton);
  }

  refreshUi() {
    super.refreshUi();

    this.triggerButton.refreshUi();
  }
}
