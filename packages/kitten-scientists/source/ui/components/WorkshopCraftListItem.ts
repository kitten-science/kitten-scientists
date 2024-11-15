import { KittenScientists } from "../../KittenScientists.js";
import { CraftSettingsItem } from "../../settings/WorkshopSettings.js";
import stylesButton from "./Button.module.css";
import { LimitedButton } from "./buttons/LimitedButton.js";
import { MaxButton } from "./buttons/MaxButton.js";
import { TriggerButton } from "./buttons/TriggerButton.js";
import { Container } from "./Container.js";
import stylesLabelListItem from "./LabelListItem.module.css";
import stylesListItem from "./ListItem.module.css";
import { SettingListItemOptionsLimited } from "./SettingLimitedListItem.js";
import { SettingListItem, SettingListItemOptions } from "./SettingListItem.js";
import { SettingListItemOptionsMax } from "./SettingMaxListItem.js";
import { SettingListItemOptionsTrigger } from "./SettingTriggerListItem.js";

export class WorkshopCraftListItem extends SettingListItem<CraftSettingsItem> {
  readonly limitedButton: LimitedButton;
  readonly maxButton: MaxButton;
  readonly triggerButton: TriggerButton;

  constructor(
    host: KittenScientists,
    label: string,
    setting: CraftSettingsItem,
    options?: Partial<
      SettingListItemOptions &
        SettingListItemOptionsLimited &
        SettingListItemOptionsMax &
        SettingListItemOptionsTrigger
    >,
  ) {
    super(host, label, setting, options);

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

    this.triggerButton = new TriggerButton(host, setting, {
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
