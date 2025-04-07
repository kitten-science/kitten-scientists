import { UiComponent, type UiComponentOptions } from "./UiComponent.js";

export type ContainerOptions = ThisType<Container> &
  UiComponentOptions & {
    readonly classes?: Array<string>;
  };

export class Container extends UiComponent {
  declare readonly options: ContainerOptions;

  /**
   * Constructs a simple container element without any special properties.
   *
   * @param host A reference to the host.
   * @param options Options for the container.
   */
  constructor(parent: UiComponent, options?: ContainerOptions) {
    super(parent, { ...options });

    this.element = $("<div/>");

    for (const className of options?.classes ?? []) {
      this.element.addClass(className);
    }
  }

  toString(): string {
    return `[${Container.name}#${this.componentId}]`;
  }
}
