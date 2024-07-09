import { KittenScientists } from "../../KittenScientists.js";
import { UiComponent, UiComponentOptions } from "./UiComponent.js";

export type FieldsetOptions = UiComponentOptions & {
  readonly delimiter: boolean;
};

export class Fieldset extends UiComponent {
  readonly element: JQuery;

  /**
   * Constructs a `Fieldset`.
   *
   * @param host A reference to the host.
   * @param label The label on the fieldset.
   * @param options Options for the fieldset.
   */
  constructor(host: KittenScientists, label: string, options?: Partial<FieldsetOptions>) {
    super(host, options);

    const element = $("<fieldset/>").addClass("ks-fieldset");
    if (options?.delimiter) {
      element.addClass("ks-delimiter");
    }
    const legend = $("<legend/>").text(label).addClass("ks-label");
    element.append(legend);

    this.element = element;
    this.addChildren(options?.children);
  }
}
