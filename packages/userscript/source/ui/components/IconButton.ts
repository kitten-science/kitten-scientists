import { UserScript } from "../../UserScript";
import { UiComponent } from "./UiComponent";

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
   */
  constructor(host: UserScript, pathData: string, title: string) {
    super(host);

    const element = $("<div/>", {
      html: `<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="${pathData}"/></svg>`,
      title,
    }).addClass("ks-icon-button");

    this.element = element;
  }
}
