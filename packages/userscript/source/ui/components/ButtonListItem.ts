import { UserScript } from "../../UserScript";
import { ListItem, ListItemOptions } from "./ListItem";
import { TextButton } from "./TextButton";

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
