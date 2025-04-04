import type { KittenScientists } from "../../../KittenScientists.js";
import { Icons } from "../../../images/Icons.js";
import stylesButton from "../Button.module.css";
import { UiComponent, type UiComponentOptions } from "../UiComponent.js";
import styles from "./ExpandoButton.module.css";

export type ExpandoButtonOptions = ThisType<ExpandoButton> & UiComponentOptions;

export class ExpandoButton extends UiComponent {
  declare readonly _options: ExpandoButtonOptions;
  readonly element: JQuery;
  ineffective: boolean;

  /**
   * Constructs an expando element that is commonly used to expand and
   * collapses a section of the UI.
   *
   * @param host A reference to the host.
   * @param options Options for this expando.
   */
  constructor(host: KittenScientists, options?: ExpandoButtonOptions) {
    super(host, { ...options });

    const element = $("<div/>", {
      html: `
      <svg style="width: 18px; height: 18px;" viewBox="0 -960 960 960" fill="currentColor" class="${styles.down}"><path d="${Icons.ExpandCircleDown}"/></svg>
      <svg style="width: 18px; height: 18px;" viewBox="0 -960 960 960" fill="currentColor" class="${styles.up}"><path d="${Icons.ExpandCircleUp}"/></svg>
      `,
      title: host.engine.i18n("ui.itemsShow"),
    })
      .addClass(stylesButton.iconButton)
      .addClass(styles.expandoButton);

    this.element = element;
    this.addChildren(options?.children);
    this.ineffective = false;
  }

  setCollapsed() {
    this.element.removeClass(styles.expanded);
    this.element.prop("title", this._host.engine.i18n("ui.itemsShow"));
  }
  setExpanded() {
    this.element.addClass(styles.expanded);
    this.element.prop("title", this._host.engine.i18n("ui.itemsHide"));
  }

  override refreshUi(): void {
    super.refreshUi();

    if (this.ineffective) {
      this.element.addClass(stylesButton.ineffective);
    } else {
      this.element.removeClass(stylesButton.ineffective);
    }
  }
}
