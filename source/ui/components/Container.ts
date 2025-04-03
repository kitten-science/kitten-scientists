import type { KittenScientists } from "../../KittenScientists.js";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";

export type ContainerOptions = UiComponentOptions & {
  readonly classes?: Array<string>;
};

export class Container extends UiComponent {
  readonly element: JQuery;

  /**
   * Constructs a simple container element without any special properties.
   *
   * @param host A reference to the host.
   * @param options Options for the container.
   */
  constructor(host: KittenScientists, options?: ContainerOptions) {
    super(host, { ...options, children: [] });

    this.element = $("<div/>");

    for (const className of options?.classes ?? []) {
      this.element.addClass(className);
    }

    this.addChildren(options?.children);
  }
}
