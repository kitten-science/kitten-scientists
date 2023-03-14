import { UserScript } from "../../UserScript";
import { UiComponent, UiComponentOptions } from "./UiComponent";

export class Container extends UiComponent {
  readonly element: JQuery<HTMLElement>;

  /**
   * Constructs a simple container element without any special properties.
   *
   * @param host A reference to the host.
   * @param options Options for the container.
   */
  constructor(host: UserScript, options?: Partial<UiComponentOptions>) {
    super(host, options);

    const element = $("<div/>");

    this.element = element;
    this.addChildren(options?.children);
  }
}
