import styles from "./HeaderListItem.module.css";
import type { ListItem, ListItemOptions } from "./ListItem.js";
import { UiComponent } from "./UiComponent.js";

export type HeaderListItemOptions = ThisType<HeaderListItem> & ListItemOptions;

export class HeaderListItem extends UiComponent implements ListItem {
  declare readonly options: ListItemOptions;
  readonly element: JQuery;
  get elementLabel() {
    return this.element;
  }

  /**
   * Construct an informational text item.
   * This is purely for cosmetic/informational value in the UI.
   *
   * @param host A reference to the host.
   * @param text The text to appear on the header element.
   * @param options Options for the header.
   */
  constructor(parent: UiComponent, text: string, options?: ListItemOptions) {
    super(parent, { ...options });

    const element = $("<li/>", { text }).addClass(styles.header);

    this.element = element;
  }

  toString(): string {
    return `[${HeaderListItem.name}#${this.componentId}]: ${this.elementLabel.text()}`;
  }

  refreshUi(): void {}
}
