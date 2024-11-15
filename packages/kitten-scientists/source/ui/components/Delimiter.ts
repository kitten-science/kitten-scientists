import { KittenScientists } from "../../KittenScientists.js";
import styles from "./Delimiter.module.css";
import { UiComponent } from "./UiComponent.js";

export class Delimiter extends UiComponent {
  readonly element: JQuery;

  /**
   * Constructs a `Delimiter`.
   *
   * @param host A reference to the host.
   * @param label The label on the fieldset.
   * @param options Options for the fieldset.
   */
  constructor(host: KittenScientists) {
    super(host, {});

    const element = $("<div/>").addClass(styles.delimiter);
    this.element = element;
  }
}
