import type { KittenScientists } from "../../KittenScientists.js";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";

export type ParagraphOptions = UiComponentOptions & {
  readonly classes: Array<string>;
};

export class Paragraph<TOptions extends ParagraphOptions = ParagraphOptions> extends UiComponent {
  readonly element: JQuery<HTMLParagraphElement>;

  /**
   * Constructs a paragraph.
   *
   * @param host - A reference to the host.
   * @param text - The text inside the paragraph.
   * @param options - Options for the UI element.
   */
  constructor(host: KittenScientists, text: string, options?: Partial<TOptions>) {
    super(host, { ...options, children: [] });

    this.element = $<HTMLParagraphElement>("<p/>").text(text);

    for (const className of options?.classes ?? []) {
      this.element.addClass(className);
    }

    this.addChildren(options?.children);
  }
}
