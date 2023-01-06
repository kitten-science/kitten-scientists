import { UserScript } from "../../UserScript";
import { UiComponent } from "./UiComponent";

export class Container extends UiComponent {
  readonly element: JQuery<HTMLElement>;

  /**
   * Constructs a simple container element without any special properties.
   *
   * @param host A reference to the host.
   */
  constructor(host: UserScript) {
    super(host);

    const element = $("<div/>");

    this.element = element;
  }
}
