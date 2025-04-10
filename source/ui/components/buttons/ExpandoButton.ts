import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { Icons } from "../../../images/Icons.js";
import stylesButton from "../Button.module.css";
import type { IconButtonOptions } from "../IconButton.js";
import { UiComponent } from "../UiComponent.js";
import styles from "./ExpandoButton.module.css";

export type ExpandoButtonOptions = ThisType<ExpandoButton> & IconButtonOptions;

export class ExpandoButton extends UiComponent {
  declare readonly options: ExpandoButtonOptions;
  readOnly: boolean;
  inactive: boolean;
  ineffective: boolean;

  /**
   * Constructs an expando element that is commonly used to expand and
   * collapses a section of the UI.
   *
   * @param host A reference to the host.
   * @param options Options for this expando.
   */
  constructor(parent: UiComponent, options?: ExpandoButtonOptions) {
    super(parent, {
      ...options,
      onRefresh: () => {
        if (this.ineffective) {
          this.element.addClass(stylesButton.ineffective);
        } else {
          this.element.removeClass(stylesButton.ineffective);
        }
        options?.onRefresh?.();
      },
    });

    this.element = $("<div/>", {
      html: `
      <svg style="width: 18px; height: 18px;" viewBox="0 -960 960 960" fill="currentColor" class="${styles.down}"><path d="${Icons.ExpandCircleDown}"/></svg>
      <svg style="width: 18px; height: 18px;" viewBox="0 -960 960 960" fill="currentColor" class="${styles.up}"><path d="${Icons.ExpandCircleUp}"/></svg>
      `,
      title: parent.host.engine.i18n("ui.itemsShow"),
    })
      .addClass(stylesButton.iconButton)
      .addClass(styles.expandoButton);

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
    return `[${ExpandoButton.name}#${this.componentId}]`;
  }

  setCollapsed() {
    this.element.removeClass(styles.expanded);
    this.element.prop("title", this.host.engine.i18n("ui.itemsShow"));
  }
  setExpanded() {
    this.element.addClass(styles.expanded);
    this.element.prop("title", this.host.engine.i18n("ui.itemsHide"));
  }

  async click() {
    if (this.readOnly) {
      return;
    }

    await this.options?.onClick?.call(this);

    this.requestRefresh(true, 0, true);
  }
}
