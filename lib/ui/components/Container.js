import { UiComponent } from "./UiComponent.js";
export class Container extends UiComponent {
  element;
  /**
   * Constructs a simple container element without any special properties.
   *
   * @param host A reference to the host.
   * @param options Options for the container.
   */
  constructor(host, options) {
    super(host, { ...options, children: [], classes: [] });
    this.element = $("<div/>");
    for (const className of options?.classes ?? []) {
      this.element.addClass(className);
    }
    this.addChildren(options?.children);
  }
}
//# sourceMappingURL=Container.js.map
