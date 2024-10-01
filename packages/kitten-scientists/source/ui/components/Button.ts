import { KittenScientists } from "../../KittenScientists.js";
import { UiComponent, UiComponentOptions } from "./UiComponent.js";

export type ButtonOptions = UiComponentOptions & {
  readonly title: string;
};

/**
 * A button that has a label and can optionally have an SVG icon.
 */
export class Button extends UiComponent {
  readonly element: JQuery;
  readOnly: boolean;

  /**
   * Constructs a `Button`.
   *
   * @param host - A reference to the host.
   * @param label - The text to display on the button.
   * @param pathData - The SVG path data of the icon.
   * @param options - Options for the icon button.
   */
  constructor(
    host: KittenScientists,
    label: string,
    pathData: string | null,
    options?: Partial<ButtonOptions>,
  ) {
    super(host, options);

    const element = $("<div/>", { title: options?.title }).addClass("ks-button").text(label);
    if (pathData !== null) {
      element.prepend(
        $(
          `<svg class="ks-button-icon" style="width: 18px; height: 18px;" viewBox="0 -960 960 960" fill="currentColor"><path d="${pathData}"/></svg>`,
        ),
      );
    }

    element.on("click", () => {
      if (this.readOnly) {
        return;
      }

      this.click();
    });

    this.element = element;
    this.addChildren(options?.children);
    this.readOnly = false;
  }
}
