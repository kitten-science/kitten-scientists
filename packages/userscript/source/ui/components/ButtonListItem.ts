import { UserScript } from "../../UserScript";
import { ListItem } from "./ListItem";
import { TextButton } from "./TextButton";
import { UiComponent } from "./UiComponent";

export class ButtonListItem extends UiComponent implements ListItem {
  readonly element: JQuery<HTMLElement>;
  readonly button: TextButton;

  get elementLabel() {
    return this.button.element;
  }

  constructor(host: UserScript, button: TextButton, delimiter = false) {
    super(host);

    const element = $(`<li/>`);
    for (const cssClass of ["ks-setting", delimiter ? "ks-delimiter" : ""]) {
      element.addClass(cssClass);
    }

    element.append(button.element);

    this.element = element;
    this.button = button;
  }
}
