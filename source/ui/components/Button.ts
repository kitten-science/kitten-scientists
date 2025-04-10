import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import styles from "./Button.module.css";
import type { IconButtonOptions } from "./IconButton.js";
import { UiComponent } from "./UiComponent.js";

export type ButtonOptions = ThisType<Button> &
  IconButtonOptions & {
    readonly border?: boolean;
    readonly alignment?: "left" | "right";
    readonly title?: string;
    readonly classes?: Array<string>;
  };

/**
 * A button that has a label and can optionally have an SVG icon.
 */
export class Button extends UiComponent {
  declare readonly options: ButtonOptions;
  protected readonly _iconElement: JQuery | undefined;
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
    parent: UiComponent,
    label: string,
    pathData: string | null = null,
    options?: ButtonOptions,
  ) {
    super(parent, {
      ...options,
      onRefresh: () => {
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

        options?.onRefresh?.();
      },
    });

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

      this.click().catch(redirectErrorsToConsole(console));
    });

    this.readOnly = options?.readOnly ?? false;
    this.inactive = options?.inactive ?? false;
    this.ineffective = false;
  }

  toString(): string {
    return `[${Button.name}#${this.componentId}]`;
  }

  updateLabel(label: string) {
    this.element.text(label);
    if (this._iconElement !== undefined) {
      if (this.options.alignment === "right") {
        this.element.append(this._iconElement);
      } else {
        this.element.prepend(this._iconElement);
      }
    }
  }
  updateTitle(title: string) {
    this.element.prop("title", title);
  }

  async click() {
    if (this.readOnly) {
      return;
    }

    await this.options?.onClick?.call(this);

    this.requestRefresh(true, 0, true);
  }
}
