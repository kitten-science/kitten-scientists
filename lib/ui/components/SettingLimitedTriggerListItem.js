import { SettingLimitedListItem } from "./SettingLimitedListItem.js";
import { TriggerButton } from "./buttons/TriggerButton.js";
export class SettingLimitedTriggerListItem extends SettingLimitedListItem {
  triggerButton;
  constructor(host, setting, locale, label, options) {
    super(host, setting, label, options);
    this.triggerButton = new TriggerButton(host, setting, locale, {
      border: false,
      onClick: options?.onSetTrigger ? () => options.onSetTrigger?.(this) : undefined,
      onRefreshTitle: options?.onRefreshTrigger
        ? () => options.onRefreshTrigger?.(this)
        : undefined,
    });
    this.head.addChild(this.triggerButton);
  }
  refreshUi() {
    super.refreshUi();
    this.triggerButton.refreshUi();
  }
}
//# sourceMappingURL=SettingLimitedTriggerListItem.js.map
