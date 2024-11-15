import { KittenScientists } from "../../KittenScientists.js";
import stylesDelimiter from "./Delimiter.module.css";
import { UiComponent, UiComponentOptions } from "./UiComponent.js";

export type ListItemOptions = UiComponentOptions & {
  /**
   * Should there be additional padding below this element?
   */
  readonly delimiter: boolean;
};

export class ListItem extends UiComponent {
  readonly element: JQuery;

  /**
   * Construct a new simple list item with only a container element.
   *
   * @param host The userscript instance.
   * @param options Options for the list item.
   */
  constructor(host: KittenScientists, options?: Partial<ListItemOptions>) {
    super(host, options);

    this.element = $("<li/>");

    options?.classes?.forEach(className => this.element.addClass(className));

    if (options?.delimiter === true) {
      this.element.addClass(stylesDelimiter.delimiter);
    }

    this.addChildren(options?.children);
  }
}
