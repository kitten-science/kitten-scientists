import type { KittenScientists } from "../../../KittenScientists.js";
import stylesButton from "../Button.module.css";
import { UiComponent, type UiComponentOptions } from "../UiComponent.js";

export class PaddingButton extends UiComponent {
  readonly element: JQuery;

  /**
   * Constructs an empty element that provides padding identical to an icon button.
   *
   * @param host - A reference to the host.
   * @param options - Options for this button.
   */
  constructor(host: KittenScientists, options?: UiComponentOptions) {
    super(host, { ...options });

    const element = $("<div/>", {
      html: `<svg style="width: 18px; height: 18px;"></svg>`,
    }).addClass(stylesButton.iconButton);

    this.element = element;
    this.addChildren(options?.children);
  }
}
