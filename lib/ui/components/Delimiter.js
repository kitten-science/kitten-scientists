import styles from "./Delimiter.module.css";
import { UiComponent } from "./UiComponent.js";
export class Delimiter extends UiComponent {
  element;
  /**
   * Constructs a `Delimiter`.
   *
   * @param host A reference to the host.
   * @param label The label on the fieldset.
   * @param options Options for the fieldset.
   */
  constructor(host) {
    super(host, {});
    const element = $("<div/>").addClass(styles.delimiter);
    this.element = element;
  }
}
//# sourceMappingURL=Delimiter.js.map
