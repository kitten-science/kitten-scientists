import styles from "./HeaderListItem.module.css";
import { UiComponent } from "./UiComponent.js";
export class HeaderListItem extends UiComponent {
  element;
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
  constructor(host, text, options) {
    super(host, options);
    const element = $("<li/>", { text }).addClass(styles.header);
    this.element = element;
    this.addChildren(options?.children);
  }
}
//# sourceMappingURL=HeaderListItem.js.map
