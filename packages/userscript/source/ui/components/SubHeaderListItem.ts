import { UserScript } from "../../UserScript";
import { UiComponent } from "./UiComponent";

export class SubHeaderListItem extends UiComponent {
  readonly element: JQuery<HTMLElement>;

  /**
   * Construct an informational text item.
   * This is purely for cosmetic/informational value in the UI.
   *
   * @param host A reference to the host.
   * @param text The text to appear on the header element.
   */
  constructor(host: UserScript, text: string) {
    super(host);

    const element = $("<li/>", { text }).addClass("ks-subheader");

    this.element = element;
  }
}
