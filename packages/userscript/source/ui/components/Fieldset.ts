import { UserScript } from "../../UserScript";
import { UiComponent } from "./UiComponent";

export class Fieldset extends UiComponent {
  readonly element: JQuery<HTMLElement>;

  /**
   * Constructs a `Fieldset`.
   *
   * @param host A reference to the host.
   * @param label The label on the fieldset.
   * @param delimiter Should this fieldset have additional padding on the bottom?
   */
  constructor(host: UserScript, label: string, delimiter = false) {
    super(host);

    const element = $("<fieldset/>").addClass("ks-fieldset");
    if (delimiter) {
      element.addClass("ks-delimiter");
    }
    const legend = $("<legend/>").text(label).addClass("ks-label");
    element.append(legend);

    this.element = element;
  }
}
