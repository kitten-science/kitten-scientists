import { UserScript } from "../../UserScript.js";
import { UiComponent, UiComponentOptions } from "./UiComponent.js";

export class ExplainerListItem extends UiComponent {
  readonly element: JQuery<HTMLElement>;

  /**
   * Construct an element to explain an area of the UI.
   * This is purely for cosmetic/informational value in the UI.
   *
   * @param host A reference to the host.
   * @param text The text to appear on the element.
   * @param options Options for this explainer.
   */
  constructor(host: UserScript, text: string, options?: Partial<UiComponentOptions>) {
    super(host);

    const element = $("<li/>", { text }).addClass("ks-explainer");

    this.element = element;
    this.addChildren(options?.children);
  }
}
