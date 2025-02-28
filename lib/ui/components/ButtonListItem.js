import { ListItem } from "./ListItem.js";
import stylesListItem from "./ListItem.module.css";
export class ButtonListItem extends ListItem {
  button;
  constructor(host, button, options = {}) {
    super(host, { ...options, children: [] });
    this.button = button;
    this.element.addClass(stylesListItem.head);
    this.element.append(button.element);
    this.addChildren(options.children);
  }
  refreshUi() {
    super.refreshUi();
    this.button.refreshUi();
  }
}
//# sourceMappingURL=ButtonListItem.js.map
