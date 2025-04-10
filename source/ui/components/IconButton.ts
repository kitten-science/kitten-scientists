import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import stylesButton from "./Button.module.css";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";

export type IconButtonOptions = ThisType<IconButton> &
  UiComponentOptions & {
    readonly readOnly?: boolean;
    readonly inactive?: boolean;
    readonly onClick: (event?: MouseEvent) => void | Promise<void>;
  };

/**
 * A button that is visually represented through an SVG element.
 */
export class IconButton extends UiComponent {
  declare readonly options: IconButtonOptions;
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
  constructor(parent: UiComponent, pathData: string, title: string, options?: IconButtonOptions) {
    super(parent, {
      ...options,
      onRefresh: () => {
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

        options?.onRefresh?.();
      },
    });

    this.element = $("<div/>", {
      html: `<svg style="width: 18px; height: 18px;" viewBox="0 -960 960 960" fill="currentColor"><path d="${pathData}"/></svg>`,
      title,
    }).addClass(stylesButton.iconButton);

    this.readOnly = options?.readOnly ?? false;
    this.inactive = options?.inactive ?? false;

    this.element.on("click", () => {
      if (this.readOnly) {
        return;
      }

      this.click().catch(redirectErrorsToConsole(console));
    });
  }

  toString(): string {
    return `[${IconButton.name}#${this.componentId}]`;
  }

  async click() {
    if (this.readOnly) {
      return;
    }

    await this.options?.onClick?.call(this);

    this.requestRefresh(true, 0, true);
  }
}
