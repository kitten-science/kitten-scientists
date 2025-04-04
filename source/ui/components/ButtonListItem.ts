import type { KittenScientists } from "../../KittenScientists.js";
import { ListItem, type ListItemOptions } from "./ListItem.js";
import stylesListItem from "./ListItem.module.css";
import type { TextButton } from "./TextButton.js";

export type ButtonListItemOptions = ThisType<ButtonListItem> & ListItemOptions;

export class ButtonListItem extends ListItem {
  declare readonly _options: ButtonListItemOptions;
  readonly button: TextButton;

  constructor(host: KittenScientists, button: TextButton, options?: ButtonListItemOptions) {
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
