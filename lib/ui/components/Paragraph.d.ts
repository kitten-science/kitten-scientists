import type { KittenScientists } from "../../KittenScientists.js";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";
export declare class Paragraph extends UiComponent {
  readonly element: JQuery<HTMLParagraphElement>;
  /**
   * Constructs a paragraph.
   *
   * @param host - A reference to the host.
   * @param text - The text inside the paragraph.
   * @param options - Options for the UI element.
   */
  constructor(host: KittenScientists, text: string, options?: Partial<UiComponentOptions>);
}
//# sourceMappingURL=Paragraph.d.ts.map
