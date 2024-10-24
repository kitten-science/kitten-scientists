import { KittenScientists } from "../../KittenScientists.js";
import { UiComponent, UiComponentOptions } from "./UiComponent.js";

export type ButtonOptions = UiComponentOptions & {
  readonly title: string;
};

/**
 * A button that has a label and can optionally have an SVG icon.
 */
export class Button extends UiComponent {
  protected readonly _iconElement: JQuery | undefined;
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
    pathData: string | null = null,
    options?: Partial<ButtonOptions>,
  ) {
    super(host, { ...options, children: [], classes: [] });

    this.element = $("<div/>", { title: options?.title }).addClass("ks-button").text(label);

    if (pathData !== null) {
      this._iconElement = $(
        `<svg class="ks-button-icon" style="width: 18px; height: 18px;" viewBox="0 -960 960 960" fill="currentColor"><path d="${pathData}"/></svg>`,
      );
      this.element.prepend(this._iconElement);
    }

    options?.classes?.forEach(className => this.element.addClass(className));

    this.element.on("click", () => {
      if (this.readOnly) {
        return;
      }

      this.click();
    });

    this.addChildren(options?.children);
    this.readOnly = false;
  }

  updateLabel(label: string) {
    this.element.text(label);
    if (this._iconElement !== undefined) {
      this.element.prepend(this._iconElement);
    }
  }
  updateTitle(title: string) {
    this.element.prop("title", title);
  }
}
