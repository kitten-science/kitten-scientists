import type { Button } from "./Button.js";
import type { IconButton } from "./IconButton.js";
import { ListItem, type ListItemOptions } from "./ListItem.js";
import styles from "./ToolbarListItem.module.css";
import type { UiComponent } from "./UiComponent.js";

export type ToolbarListItemOptions = ThisType<ToolbarListItem> & ListItemOptions;

export class ToolbarListItem extends ListItem {
  declare readonly options: ToolbarListItemOptions;
  readonly buttons: Array<Button | IconButton>;

  constructor(
    parent: UiComponent,
    buttons: Array<Button | IconButton>,
    options?: ToolbarListItemOptions,
  ) {
    super(parent, options);

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
