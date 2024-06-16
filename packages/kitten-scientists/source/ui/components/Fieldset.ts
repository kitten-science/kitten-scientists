import { UserScript } from "../../UserScript.js";
import { UiComponent, UiComponentOptions } from "./UiComponent.js";

/**
 * The options to construct a Fieldset.
 */
export type FieldsetOptions = UiComponentOptions & {
  readonly delimiter: boolean;
};

/**
 * A component that contains other components in a `<fieldset>`
 */
export class Fieldset extends UiComponent {
  /**
   * The actual DOM element.
   */
  readonly element: JQuery;

  /**
   * Constructs a `Fieldset`.
   * @param host - A reference to the host.
   * @param label - The label on the fieldset.
   * @param options - Options for the fieldset.
   */
  constructor(host: UserScript, label: string, options?: Partial<FieldsetOptions>) {
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
