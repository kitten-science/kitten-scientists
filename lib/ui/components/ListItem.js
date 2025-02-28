import stylesDelimiter from "./Delimiter.module.css";
import { UiComponent } from "./UiComponent.js";
export class ListItem extends UiComponent {
  element;
  /**
   * Construct a new simple list item with only a container element.
   *
   * @param host The userscript instance.
   * @param options Options for the list item.
   */
  constructor(host, options) {
    super(host, options);
    this.element = $("<li/>");
    for (const className of options?.classes ?? []) {
      this.element.addClass(className);
    }
    if (options?.delimiter === true) {
      this.element.addClass(stylesDelimiter.delimiter);
    }
    this.addChildren(options?.children);
  }
}
//# sourceMappingURL=ListItem.js.map
