import { Container } from "./Container.js";
import stylesLabelListItem from "./LabelListItem.module.css";
import { SettingListItem } from "./SettingListItem.js";
import { LimitedButton } from "./buttons/LimitedButton.js";
export class SettingLimitedListItem extends SettingListItem {
  limitedButton;
  /**
   * Create a UI element for a setting that can be limited.
   * This will result in an element with a checkbox that has a "Limited" label.
   *
   * @param host The userscript instance.
   * @param label The label for the setting.
   * @param setting The setting model.
   * @param options Options for the list item.
   */
  constructor(host, setting, label, options) {
    super(host, setting, label, options);
    this.limitedButton = new LimitedButton(host, setting, {
      ...options,
    });
    this.head.addChildren([
      new Container(host, { classes: [stylesLabelListItem.fillSpace] }),
      this.limitedButton,
    ]);
  }
  refreshUi() {
    super.refreshUi();
    this.limitedButton.refreshUi();
  }
}
//# sourceMappingURL=SettingLimitedListItem.js.map
