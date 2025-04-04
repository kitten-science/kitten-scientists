import type { KittenScientists } from "../../KittenScientists.js";
import type { Button } from "./Button.js";
import type { IconButton } from "./IconButton.js";
import { ListItem, type ListItemOptions } from "./ListItem.js";
import styles from "./ToolbarListItem.module.css";

export type ToolbarListItemOptions = ListItemOptions & ThisType<ToolbarListItem>;

export class ToolbarListItem extends ListItem {
  declare readonly _options: ToolbarListItemOptions;
  readonly buttons: Array<Button | IconButton>;

  constructor(
    host: KittenScientists,
    buttons: Array<Button | IconButton>,
    options?: ToolbarListItemOptions,
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
