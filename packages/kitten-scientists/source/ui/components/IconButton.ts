import { KittenScientists } from "../../KittenScientists.js";
import { UiComponent, UiComponentOptions } from "./UiComponent.js";

/**
 * A button that is visually represented through an SVG element.
 */
export class IconButton extends UiComponent {
  readonly element: JQuery;

  /**
   * Constructs an `IconButton`.
   *
   * @param host A reference to the host.
   * @param pathData The SVG path data of the icon.
   * @param title The `title` of the element.
   * @param options Options for the icon button.
   */
  constructor(
    host: KittenScientists,
    pathData: string,
    title: string,
    options?: Partial<UiComponentOptions>,
  ) {
    super(host, options);

    const element = $("<div/>", {
      html: `<svg style="width: 18px; height: 18px;" viewBox="0 -960 960 960" fill="currentColor"><path d="${pathData}"/></svg>`,
      title,
    }).addClass("ks-icon-button");

    this.element = element;
    this.addChildren(options?.children);

    this.element.on("click", () => {
      this.click();
    });
  }
}
