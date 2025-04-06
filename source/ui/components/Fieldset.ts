import stylesDelimiter from "./Delimiter.module.css";
import styles from "./Fieldset.module.css";
import stylesLabel from "./LabelListItem.module.css";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";

export type FieldsetOptions = ThisType<Fieldset> &
  UiComponentOptions & {
    readonly delimiter?: boolean;
  };

export class Fieldset extends UiComponent {
  declare readonly options: FieldsetOptions;
  readonly element: JQuery;

  /**
   * Constructs a `Fieldset`.
   *
   * @param host A reference to the host.
   * @param label The label on the fieldset.
   * @param options Options for the fieldset.
   */
  constructor(parent: UiComponent, label: string, options?: FieldsetOptions) {
    super(parent, { ...options });

    const element = $("<fieldset/>").addClass(styles.fieldset);
    if (options?.delimiter) {
      element.addClass(stylesDelimiter.delimiter);
    }
    const legend = $("<legend/>").text(label).addClass(stylesLabel.label);
    element.append(legend);

    this.element = element;
  }

  toString(): string {
    return `[${Fieldset.name}#${this.componentId}]`;
  }
}
