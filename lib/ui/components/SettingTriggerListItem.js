import { Container } from "./Container.js";
import stylesLabelListItem from "./LabelListItem.module.css";
import { SettingListItem } from "./SettingListItem.js";
import { TriggerButton } from "./buttons/TriggerButton.js";
export class SettingTriggerListItem extends SettingListItem {
  triggerButton;
  constructor(host, setting, locale, label, options) {
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
//# sourceMappingURL=SettingTriggerListItem.js.map
