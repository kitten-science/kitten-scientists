import { TranslatedString } from "../../Engine.js";
import { UserScript } from "../../UserScript.js";
import { UiComponent, UiComponentOptions } from "./UiComponent.js";

export class ExplainerListItem<TKittenGameLiteral extends `$${string}`> extends UiComponent {
  readonly element: JQuery;

  /**
   * Construct an element to explain an area of the UI.
   * This is purely for cosmetic/informational value in the UI.
   *
   * @param host - A reference to the host.
   * @param key - The i18n key for the text to appear on the element.
   * @param options - Options for this explainer.
   */
  constructor(
    host: UserScript,
    key: TranslatedString<TKittenGameLiteral>,
    options?: Partial<UiComponentOptions>,
  ) {
    super(host);

    const element = $("<li/>", { text: host.engine.i18n(key) }).addClass("ks-explainer");

    this.element = element;
    this.addChildren(options?.children);
  }
}
