import type { TranslatedString } from "../../Engine.js";
import type { KittenScientists } from "../../KittenScientists.js";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";
export declare class ExplainerListItem<
  TKittenGameLiteral extends `$${string}`,
> extends UiComponent {
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
    host: KittenScientists,
    key: TranslatedString<TKittenGameLiteral>,
    options?: Partial<UiComponentOptions>,
  );
}
//# sourceMappingURL=ExplainerListItem.d.ts.map
