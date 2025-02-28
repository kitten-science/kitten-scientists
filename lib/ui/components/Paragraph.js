import { UiComponent } from "./UiComponent.js";
export class Paragraph extends UiComponent {
  element;
  /**
   * Constructs a paragraph.
   *
   * @param host - A reference to the host.
   * @param text - The text inside the paragraph.
   * @param options - Options for the UI element.
   */
  constructor(host, text, options) {
    super(host, { ...options, children: [], classes: [] });
    this.element = $("<p/>").text(text);
    for (const className of options?.classes ?? []) {
      this.element.addClass(className);
    }
    this.addChildren(options?.children);
  }
}
//# sourceMappingURL=Paragraph.js.map
