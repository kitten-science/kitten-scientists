import stylesButton from "./Button.module.css";
import { Container } from "./Container.js";
import stylesLabelListItem from "./LabelListItem.module.css";
import stylesListItem from "./ListItem.module.css";
import { SettingListItem } from "./SettingListItem.js";
import { LimitedButton } from "./buttons/LimitedButton.js";
import { MaxButton } from "./buttons/MaxButton.js";
import { TriggerButton } from "./buttons/TriggerButton.js";
export class WorkshopCraftListItem extends SettingListItem {
  limitedButton;
  maxButton;
  triggerButton;
  constructor(host, setting, locale, label, options) {
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
//# sourceMappingURL=WorkshopCraftListItem.js.map
