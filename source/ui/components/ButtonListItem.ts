import { ListItem, type ListItemOptions } from "./ListItem.js";
import stylesListItem from "./ListItem.module.css";
import type { TextButton } from "./TextButton.js";
import type { UiComponent } from "./UiComponent.js";

export type ButtonListItemOptions = ThisType<ButtonListItem> & ListItemOptions;

export class ButtonListItem extends ListItem {
  declare readonly options: ButtonListItemOptions;
  readonly button: TextButton;

  constructor(parent: UiComponent, button: TextButton, options?: ButtonListItemOptions) {
    super(parent, { ...options });

    this.button = button;

    this.element.addClass(stylesListItem.head);
    this.element.append(button.element);
  }
}
