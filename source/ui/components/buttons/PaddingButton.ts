import stylesButton from "../Button.module.css";
import { UiComponent, type UiComponentOptions } from "../UiComponent.js";

export type PaddingButtonOptions = ThisType<PaddingButton> & UiComponentOptions;

export class PaddingButton extends UiComponent {
  declare readonly options: PaddingButtonOptions;
  readonly element: JQuery;

  /**
   * Constructs an empty element that provides padding identical to an icon button.
   *
   * @param host - A reference to the host.
   * @param options - Options for this button.
   */
  constructor(parent: UiComponent, options?: PaddingButtonOptions) {
    super(parent, { ...options });

    const element = $("<div/>", {
      html: `<svg style="width: 18px; height: 18px;"></svg>`,
    }).addClass(stylesButton.iconButton);

    this.element = element;
  }

  toString(): string {
    return `[${PaddingButton.name}#${this.componentId}]`;
  }
}
