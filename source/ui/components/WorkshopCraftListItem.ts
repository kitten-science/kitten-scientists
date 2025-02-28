import type { SupportedLocale } from "../../Engine.js";
import type { KittenScientists } from "../../KittenScientists.js";
import type { SettingOptions } from "../../settings/Settings.js";
import type { CraftSettingsItem } from "../../settings/WorkshopSettings.js";
import stylesButton from "./Button.module.css";
import { Container } from "./Container.js";
import stylesLabelListItem from "./LabelListItem.module.css";
import stylesListItem from "./ListItem.module.css";
import type { SettingListItemOptionsLimited } from "./SettingLimitedListItem.js";
import { SettingListItem, type SettingListItemOptions } from "./SettingListItem.js";
import type { SettingListItemOptionsMax } from "./SettingMaxListItem.js";
import type { SettingListItemOptionsTrigger } from "./SettingTriggerListItem.js";
import type { UiComponent } from "./UiComponent.js";
import { LimitedButton } from "./buttons/LimitedButton.js";
import { MaxButton } from "./buttons/MaxButton.js";
import { TriggerButton } from "./buttons/TriggerButton.js";

export class WorkshopCraftListItem<
  TOptions extends SettingListItemOptions<UiComponent> &
    SettingListItemOptionsLimited &
    SettingListItemOptionsMax &
    SettingListItemOptionsTrigger = SettingListItemOptions<UiComponent> &
    SettingListItemOptionsLimited &
    SettingListItemOptionsMax &
    SettingListItemOptionsTrigger,
> extends SettingListItem<CraftSettingsItem> {
  readonly limitedButton: LimitedButton;
  readonly maxButton: MaxButton;
  readonly triggerButton: TriggerButton;

  constructor(
    host: KittenScientists,
    setting: CraftSettingsItem,
    locale: SettingOptions<SupportedLocale>,
    label: string,
    options?: Partial<TOptions>,
  ) {
    super(host, setting, label, options);

    this.limitedButton = new LimitedButton(host, setting, {
      ...options,
      classes: [stylesListItem.headAction],
    });

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
      this.limitedButton,
      this.maxButton,
      this.triggerButton,
    ]);
  }

  refreshUi() {
    super.refreshUi();

    this.limitedButton.refreshUi();
    this.maxButton.refreshUi();
    this.triggerButton.refreshUi();
  }
}
