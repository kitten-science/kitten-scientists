import type { KittenScientists } from "../../KittenScientists.js";
import stylesDelimiter from "./Delimiter.module.css";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";

export type ListItemOptions = ThisType<ListItem> &
  UiComponentOptions & {
    /**
     * Should there be additional padding below this element?
     */
    readonly delimiter?: boolean;
    readonly classes?: Array<string>;
  };

export class ListItem extends UiComponent {
  declare readonly _options: ListItemOptions;
  readonly element: JQuery;

  /**
   * Construct a new simple list item with only a container element.
   *
   * @param host The userscript instance.
   * @param options Options for the list item.
   */
  constructor(host: KittenScientists, options?: ListItemOptions) {
    super(host, { children: (options as UiComponentOptions)?.children });

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
