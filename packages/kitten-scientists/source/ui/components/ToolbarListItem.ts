import { KittenScientists } from "../../KittenScientists.js";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { ListItem, ListItemOptions } from "./ListItem.js";

export class ToolbarListItem extends ListItem {
  readonly buttons: Array<IconButton>;

  constructor(
    host: KittenScientists,
    buttons: Array<Button | IconButton>,
    options?: Partial<ListItemOptions>,
  ) {
    super(host, options);

    this.element.addClass("ks-toolbar");
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
