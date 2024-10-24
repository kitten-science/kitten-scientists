import { KittenScientists } from "../../KittenScientists.js";
import { UiComponent, UiComponentOptions } from "./UiComponent.js";

export class Paragraph extends UiComponent {
  readonly element: JQuery<HTMLParagraphElement>;

  /**
   * Constructs a paragraph.
   *
   * @param host - A reference to the host.
   * @param text - The text inside the paragraph.
   * @param options - Options for the UI element.
   */
  constructor(host: KittenScientists, text: string, options?: Partial<UiComponentOptions>) {
    super(host, { ...options, children: [], classes: [] });

    this.element = $<HTMLParagraphElement>("<p/>").text(text);

    options?.classes?.forEach(className => this.element.addClass(className));

    this.addChildren(options?.children);
  }
}
