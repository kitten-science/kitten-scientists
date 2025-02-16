import { KittenScientists } from "../../KittenScientists.js";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { ListItem, ListItemOptions } from "./ListItem.js";
import styles from "./ToolbarListItem.module.css";
import { UiComponent } from "./UiComponent.js";

export class ToolbarListItem<
  TOptions extends ListItemOptions<UiComponent> = ListItemOptions<UiComponent>,
> extends ListItem {
  readonly buttons: Array<Button | IconButton>;

  constructor(
    host: KittenScientists,
    buttons: Array<Button | IconButton>,
    options?: Partial<TOptions>,
  ) {
    super(host, options);

    this.element.addClass(styles.toolbar);
    this.buttons = buttons;
    for (const button of buttons) {
      this.element.append(button.element);
    }
  }

  refreshUi(): void {
    super.refreshUi();

    for (const button of this.buttons) {
      button.refreshUi();
    }
  }
}
