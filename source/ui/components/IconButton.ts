import type { KittenScientists } from "../../KittenScientists.js";
import stylesButton from "./Button.module.css";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";

export type IconButtonOptions = ThisType<IconButton> &
  UiComponentOptions & {
    readonly readOnly?: boolean;
    readonly inactive?: boolean;
  };

/**
 * A button that is visually represented through an SVG element.
 */
export class IconButton extends UiComponent {
  declare readonly _options: IconButtonOptions;
  readonly element: JQuery;
  readOnly: boolean;
  inactive: boolean;

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
    options?: IconButtonOptions,
  ) {
    super(host, { ...options });

    const element = $("<div/>", {
      html: `<svg style="width: 18px; height: 18px;" viewBox="0 -960 960 960" fill="currentColor"><path d="${pathData}"/></svg>`,
      title,
    }).addClass(stylesButton.iconButton);

    this.element = element;
    this.addChildren(options?.children);
    this.readOnly = options?.readOnly ?? false;
    this.inactive = options?.inactive ?? false;

    this.element.on("click", () => {
      this.click();
    });
  }

  override click() {
    if (this.readOnly) {
      return;
    }

    super.click();
  }

  override refreshUi(): void {
    super.refreshUi();

    if (this.readOnly) {
      this.element.addClass(stylesButton.readonly);
    } else {
      this.element.removeClass(stylesButton.readonly);
    }

    if (this.inactive) {
      this.element.addClass(stylesButton.inactive);
    } else {
      this.element.removeClass(stylesButton.inactive);
    }
  }
}
