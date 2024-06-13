import { UserScript } from "../../UserScript.js";
import { UiComponent, UiComponentOptions } from "./UiComponent.js";

export type ListItemOptions = UiComponentOptions & {
  /**
   * Should there be additional padding below this element?
   */
  delimiter: boolean;
};

export class ListItem extends UiComponent {
  readonly element: JQuery;

  /**
   * Construct a new simple list item with only a label.
   *
   * @param host The userscript instance.
   * @param options Options for the list item.
   */
  constructor(host: UserScript, options?: Partial<ListItemOptions>) {
    super(host, options);

    const element = $("<li/>");
    element.addClass("ks-setting");

    if (options?.delimiter === true) {
      element.addClass("ks-delimiter");
    }

    this.element = element;
    this.addChildren(options?.children);
  }
}
