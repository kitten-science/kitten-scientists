import type { KittenScientists } from "../../KittenScientists.js";
import stylesDelimiter from "./Delimiter.module.css";
import styles from "./Fieldset.module.css";
import stylesLabel from "./LabelListItem.module.css";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";

export type FieldsetOptions = UiComponentOptions & {
  readonly delimiter?: boolean;
};

export class Fieldset extends UiComponent {
  declare readonly _options: FieldsetOptions;
  readonly element: JQuery;

  /**
   * Constructs a `Fieldset`.
   *
   * @param host A reference to the host.
   * @param label The label on the fieldset.
   * @param options Options for the fieldset.
   */
  constructor(host: KittenScientists, label: string, options?: FieldsetOptions) {
    super(host, { ...options });

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
