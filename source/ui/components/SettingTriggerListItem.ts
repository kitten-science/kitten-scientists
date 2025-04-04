import type { SupportedLocale } from "../../Engine.js";
import type { KittenScientists } from "../../KittenScientists.js";
import type { SettingOptions, SettingThreshold, SettingTrigger } from "../../settings/Settings.js";
import { Container } from "./Container.js";
import stylesLabelListItem from "./LabelListItem.module.css";
import { SettingListItem, type SettingListItemOptions } from "./SettingListItem.js";
import { TriggerButton } from "./buttons/TriggerButton.js";

export type SettingTriggerListItemOptions = SettingListItemOptions & {
  readonly onRefreshTrigger?: (subject: SettingTriggerListItem) => void;
  readonly onSetTrigger: (subject: SettingTriggerListItem) => unknown | Promise<unknown>;
} & ThisType<SettingTriggerListItem>;

export class SettingTriggerListItem extends SettingListItem {
  declare readonly _options: SettingTriggerListItemOptions;
  readonly triggerButton: TriggerButton;

  constructor(
    host: KittenScientists,
    setting: SettingThreshold | SettingTrigger,
    locale: SettingOptions<SupportedLocale>,
    label: string,
    options: SettingTriggerListItemOptions,
  ) {
    super(host, setting, label, options);

    this.triggerButton = new TriggerButton(host, setting, locale, {
      alignment: "right",
      border: false,
      onClick: (event?: MouseEvent) => {
        this._options.onSetTrigger(this);
        this.refreshUi();
      },
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
