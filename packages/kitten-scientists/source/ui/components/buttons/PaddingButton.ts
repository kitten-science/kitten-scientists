import { KittenScientists } from "../../../KittenScientists.js";
import stylesIconButton from "../IconButton.module.css";
import { UiComponent, UiComponentOptions } from "../UiComponent.js";

export class PaddingButton extends UiComponent {
  readonly element: JQuery;

  /**
   * Constructs an empty element that provides padding identical to an icon button.
   *
   * @param host - A reference to the host.
   * @param options - Options for this button.
   */
  constructor(host: KittenScientists, options?: Partial<UiComponentOptions>) {
    super(host, options);

    const element = $("<div/>", {
      html: `<svg style="width: 18px; height: 18px;"></svg>`,
    }).addClass(stylesIconButton.iconButton);

    this.element = element;
    this.addChildren(options?.children);
  }
}
