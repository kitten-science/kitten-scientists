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
  constructor(parent: UiComponent) {
    super(parent, {});

    const element = $("<div/>").addClass(styles.delimiter);
    this.element = element;
  }

  toString(): string {
    return `[${Delimiter.name}#${this.componentId}]`;
  }
}
