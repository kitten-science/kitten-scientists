import type { KittenScientists } from "../../KittenScientists.js";
import { ListItem, type ListItemOptions } from "./ListItem.js";
import stylesListItem from "./ListItem.module.css";
import type { TextButton } from "./TextButton.js";
import type { UiComponent } from "./UiComponent.js";

export class ButtonListItem<
  TOptions extends ListItemOptions<UiComponent> = ListItemOptions<UiComponent>,
> extends ListItem<TOptions> {
  readonly button: TextButton;

  constructor(host: KittenScientists, button: TextButton, options: Partial<TOptions> = {}) {
    super(host, { ...options, children: [] });

    this.button = button;

    this.element.addClass(stylesListItem.head);
    this.element.append(button.element);

    this.addChildren(options.children);
  }

  refreshUi(): void {
    super.refreshUi();

    this.button.refreshUi();
  }
}
