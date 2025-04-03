import type { KittenScientists } from "../../KittenScientists.js";
import styles from "./Button.module.css";
import type { IconButtonOptions } from "./IconButton.js";
import { UiComponent } from "./UiComponent.js";

export type ButtonOptions = IconButtonOptions & {
  readonly border: boolean;
  readonly alignment: "left" | "right";
  readonly title: string;
  readonly classes: Array<string>;
};

/**
 * A button that has a label and can optionally have an SVG icon.
 */
export class Button extends UiComponent {
  declare readonly _options: Partial<ButtonOptions>;

  protected readonly _iconElement: JQuery | undefined;
  readonly element: JQuery;
  readOnly: boolean;
  inactive: boolean;
  ineffective: boolean;

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
    super(host, { ...options, children: [] });

    this.element = $("<div/>", { title: options?.title }).addClass(styles.button).text(label);

    if (options?.border !== false) {
      this.element.addClass(styles.bordered);
    }

    if (options?.alignment === "right") {
      this.element.addClass(styles.alignRight);
    }

    if (pathData !== null) {
      this._iconElement = $(
        `<svg class="${styles.buttonIcon}" style="width: 18px; height: 18px;" viewBox="0 -960 960 960" fill="currentColor"><path d="${pathData}"/></svg>`,
      );
      if (options?.alignment === "right") {
        this.element.append(this._iconElement);
      } else {
        this.element.prepend(this._iconElement);
      }
    }

    for (const className of options?.classes ?? []) {
      this.element.addClass(className);
    }

    this.element.on("click", () => {
      if (this.readOnly) {
        return;
      }

      this.click();
    });

    this.addChildren(options?.children);
    this.readOnly = options?.readOnly ?? false;
    this.inactive = options?.inactive ?? false;
    this.ineffective = false;
  }

  updateLabel(label: string) {
    this.element.text(label);
    if (this._iconElement !== undefined) {
      if (this._options.alignment === "right") {
        this.element.append(this._iconElement);
      } else {
        this.element.prepend(this._iconElement);
      }
    }
  }
  updateTitle(title: string) {
    this.element.prop("title", title);
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

    if (this.ineffective) {
      this.element.addClass(styles.ineffective);
    } else {
      this.element.removeClass(styles.ineffective);
    }
  }
}
