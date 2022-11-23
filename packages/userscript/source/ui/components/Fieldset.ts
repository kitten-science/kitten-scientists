import { UserScript } from "../../UserScript";
import { UiComponent } from "./UiComponent";

export class Fieldset extends UiComponent {
  readonly element: JQuery<HTMLElement>;

  /**
   * Constructs a `Fieldset`.
   *
   * @param host A reference to the host.
   * @param label The label on the fieldset.
   */
  constructor(host: UserScript, label: string) {
    super(host);

    const element = $("<fieldset/>").addClass("ks-fieldset");
    const legend = $("<legend/>").text(label).addClass("ks-label");
    element.append(legend);

    this.element = element;
  }
}
