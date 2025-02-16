import { SupportedLocale } from "../../Engine.js";
import { KittenScientists } from "../../KittenScientists.js";
import { SettingOptions, SettingTriggerMax } from "../../settings/Settings.js";
import stylesButton from "./Button.module.css";
import { MaxButton } from "./buttons/MaxButton.js";
import { TriggerButton } from "./buttons/TriggerButton.js";
import { Container } from "./Container.js";
import stylesLabelListItem from "./LabelListItem.module.css";
import { SettingListItem, SettingListItemOptions } from "./SettingListItem.js";
import { SettingListItemOptionsMax } from "./SettingMaxListItem.js";
import { SettingListItemOptionsTrigger } from "./SettingTriggerListItem.js";
import { UiComponent } from "./UiComponent.js";

export class SettingMaxTriggerListItem<
  TOptions extends SettingListItemOptions<UiComponent> &
    SettingListItemOptionsMax &
    SettingListItemOptionsTrigger = SettingListItemOptions<UiComponent> &
    SettingListItemOptionsMax &
    SettingListItemOptionsTrigger,
> extends SettingListItem<SettingTriggerMax, TOptions> {
  readonly maxButton: MaxButton;
  readonly triggerButton: TriggerButton;

  constructor(
    host: KittenScientists,
    setting: SettingTriggerMax,
    locale: SettingOptions<SupportedLocale>,
    label: string,
    options?: Partial<TOptions>,
  ) {
    super(host, setting, label, options);

    this.maxButton = new MaxButton(host, setting, {
      alignment: "right",
      border: false,
      classes: [stylesButton.headAction],
      onClick: options?.onSetMax ? () => options.onSetMax?.(this) : undefined,
      onRefresh: options?.onRefreshMax ? () => options.onRefreshMax?.(this) : undefined,
    });
    this.triggerButton = new TriggerButton(host, setting, locale, {
      border: false,
      classes: [stylesButton.lastHeadAction],
      onClick: options?.onSetTrigger ? () => options.onSetTrigger?.(this) : undefined,
      onRefreshTitle: options?.onRefreshTrigger
        ? () => options.onRefreshTrigger?.(this)
        : undefined,
    });

    this.head.addChildren([
      new Container(host, { classes: [stylesLabelListItem.fillSpace] }),
      this.maxButton,
      this.triggerButton,
    ]);
  }

  override refreshUi(): void {
    super.refreshUi();
  }
}
