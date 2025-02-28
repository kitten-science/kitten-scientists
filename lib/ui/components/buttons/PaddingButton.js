import stylesButton from "../Button.module.css";
import { UiComponent } from "../UiComponent.js";
export class PaddingButton extends UiComponent {
  element;
  /**
   * Constructs an empty element that provides padding identical to an icon button.
   *
   * @param host - A reference to the host.
   * @param options - Options for this button.
   */
  constructor(host, options) {
    super(host, options);
    const element = $("<div/>", {
      html: `<svg style="width: 18px; height: 18px;"></svg>`,
    }).addClass(stylesButton.iconButton);
    this.element = element;
    this.addChildren(options?.children);
  }
}
//# sourceMappingURL=PaddingButton.js.map
