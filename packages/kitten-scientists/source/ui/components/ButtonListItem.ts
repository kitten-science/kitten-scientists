import { UserScript } from "../../UserScript.js";
import { ListItem, ListItemOptions } from "./ListItem.js";
import { TextButton } from "./TextButton.js";

export class ButtonListItem extends ListItem {
  readonly button: TextButton;

  constructor(host: UserScript, button: TextButton, options?: Partial<ListItemOptions>) {
    super(host, options);

    this.button = button;
    this.element.append(button.element);
  }

  refreshUi(): void {
    super.refreshUi();

    this.button.refreshUi();
  }
}
