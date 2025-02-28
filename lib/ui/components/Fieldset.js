import stylesDelimiter from "./Delimiter.module.css";
import styles from "./Fieldset.module.css";
import stylesLabel from "./LabelListItem.module.css";
import { UiComponent } from "./UiComponent.js";
export class Fieldset extends UiComponent {
  element;
  /**
   * Constructs a `Fieldset`.
   *
   * @param host A reference to the host.
   * @param label The label on the fieldset.
   * @param options Options for the fieldset.
   */
  constructor(host, label, options) {
    super(host, options);
    const element = $("<fieldset/>").addClass(styles.fieldset);
    if (options?.delimiter) {
      element.addClass(stylesDelimiter.delimiter);
    }
    const legend = $("<legend/>").text(label).addClass(stylesLabel.label);
    element.append(legend);
    this.element = element;
    this.addChildren(options?.children);
  }
}
//# sourceMappingURL=Fieldset.js.map
