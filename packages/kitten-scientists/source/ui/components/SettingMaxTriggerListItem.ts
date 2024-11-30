import { KittenScientists } from "../../KittenScientists.js";
import { SettingTriggerMax } from "../../settings/Settings.js";
import stylesButton from "./Button.module.css";
import { MaxButton } from "./buttons/MaxButton.js";
import { TriggerButton } from "./buttons/TriggerButton.js";
import { Container } from "./Container.js";
import stylesLabelListItem from "./LabelListItem.module.css";
import { SettingListItem, SettingListItemOptions } from "./SettingListItem.js";
import stylesSettingListItem from "./SettingListItem.module.css";
import { SettingListItemOptionsMax } from "./SettingMaxListItem.js";
import { SettingListItemOptionsTrigger } from "./SettingTriggerListItem.js";

export class SettingMaxTriggerListItem extends SettingListItem<SettingTriggerMax> {
  readonly maxButton: MaxButton;
  readonly triggerButton: TriggerButton;

  constructor(
    host: KittenScientists,
    label: string,
    setting: SettingTriggerMax,
    options?: Partial<
      SettingListItemOptions & SettingListItemOptionsMax & SettingListItemOptionsTrigger
    >,
  ) {
    super(host, label, setting, options);

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
      this.maxButton,
      this.triggerButton,
    ]);
  }

  override refreshUi(): void {
    super.refreshUi();

    if (this.readOnly) {
      this.element.addClass(stylesSettingListItem.readonly);
    } else {
      this.element.removeClass(stylesSettingListItem.readonly);
    }
  }
}
