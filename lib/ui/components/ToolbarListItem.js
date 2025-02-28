import { ListItem } from "./ListItem.js";
import styles from "./ToolbarListItem.module.css";
export class ToolbarListItem extends ListItem {
  buttons;
  constructor(host, buttons, options) {
    super(host, options);
    this.element.addClass(styles.toolbar);
    this.buttons = buttons;
    for (const button of buttons) {
      this.element.append(button.element);
    }
  }
  refreshUi() {
    super.refreshUi();
    for (const button of this.buttons) {
      button.refreshUi();
    }
  }
}
//# sourceMappingURL=ToolbarListItem.js.map
