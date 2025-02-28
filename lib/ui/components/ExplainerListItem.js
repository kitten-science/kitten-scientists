import styles from "./ExplainerLiteItem.module.css";
import { UiComponent } from "./UiComponent.js";
export class ExplainerListItem extends UiComponent {
  element;
  /**
   * Construct an element to explain an area of the UI.
   * This is purely for cosmetic/informational value in the UI.
   *
   * @param host - A reference to the host.
   * @param key - The i18n key for the text to appear on the element.
   * @param options - Options for this explainer.
   */
  constructor(host, key, options) {
    super(host);
    const element = $("<li/>", { text: host.engine.i18n(key) }).addClass(styles.explainer);
    this.element = element;
    this.addChildren(options?.children);
  }
}
//# sourceMappingURL=ExplainerListItem.js.map
