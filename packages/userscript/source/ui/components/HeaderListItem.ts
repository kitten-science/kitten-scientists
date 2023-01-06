import { UserScript } from "../../UserScript";
import { ListItem } from "./ListItem";
import { UiComponent } from "./UiComponent";

export class HeaderListItem extends UiComponent implements ListItem {
  readonly element: JQuery<HTMLElement>;
  get elementLabel() {
    return this.element;
  }

  /**
   * Construct an informational text item.
   * This is purely for cosmetic/informational value in the UI.
   *
   * @param host A reference to the host.
   * @param text The text to appear on the header element.
   */
  constructor(host: UserScript, text: string) {
    super(host);

    const element = $("<li/>", { text }).addClass("ks-header");

    this.element = element;
  }
}
