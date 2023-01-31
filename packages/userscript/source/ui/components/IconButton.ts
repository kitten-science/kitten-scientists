import { UserScript } from "../../UserScript";
import { UiComponent, UiComponentOptions } from "./UiComponent";

/**
 * A button that is visually represented through an SVG element.
 */
export class IconButton extends UiComponent {
  readonly element: JQuery<HTMLElement>;

  /**
   * Constructs a `IconButton`.
   *
   * @param host A reference to the host.
   * @param pathData The SVG path data of the icon.
   * @param title The `title` of the element.
   * @param options Options for the icon button.
   */
  constructor(
    host: UserScript,
    pathData: string,
    title: string,
    options?: Partial<UiComponentOptions>
  ) {
    super(host, options);

    const element = $("<div/>", {
      html: `<svg style="width: 18px; height: 18px;" viewBox="0 0 48 48"><path fill="currentColor" d="${pathData}"/></svg>`,
      title,
    }).addClass("ks-icon-button");

    this.element = element;
  }
}
