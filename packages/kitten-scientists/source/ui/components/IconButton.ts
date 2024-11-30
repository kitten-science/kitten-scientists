import { KittenScientists } from "../../KittenScientists.js";
import styles from "./IconButton.module.css";
import { UiComponent, UiComponentOptions } from "./UiComponent.js";

export type IconButtonOptions = UiComponentOptions & {
  readonly readOnly: boolean;
  readonly inactive: boolean;
};

/**
 * A button that is visually represented through an SVG element.
 */
export class IconButton extends UiComponent {
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
    options?: Partial<IconButtonOptions>,
  ) {
    super(host, options);

    const element = $("<div/>", {
      html: `<svg style="width: 18px; height: 18px;" viewBox="0 -960 960 960" fill="currentColor"><path d="${pathData}"/></svg>`,
      title,
    }).addClass(styles.iconButton);

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
      this.element.addClass(styles.readonly);
    } else {
      this.element.removeClass(styles.readonly);
    }

    if (this.inactive) {
      this.element.addClass(styles.inactive);
    } else {
      this.element.removeClass(styles.inactive);
    }
  }
}
