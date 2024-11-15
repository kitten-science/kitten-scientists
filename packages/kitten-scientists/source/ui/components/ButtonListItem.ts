import { KittenScientists } from "../../KittenScientists.js";
import { ListItem, ListItemOptions } from "./ListItem.js";
import stylesListItem from "./ListItem.module.css";
import { TextButton } from "./TextButton.js";

export class ButtonListItem extends ListItem {
  readonly button: TextButton;

  constructor(host: KittenScientists, button: TextButton, options?: Partial<ListItemOptions>) {
    super(host, { ...options, children: [] });

    this.button = button;

    this.element.addClass(stylesListItem.head);
    this.element.append(button.element);

    this.addChildren(options?.children);
  }

  refreshUi(): void {
    super.refreshUi();

    this.button.refreshUi();
  }
}
