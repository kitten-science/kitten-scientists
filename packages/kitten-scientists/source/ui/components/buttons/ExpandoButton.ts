import { Icons } from "../../../images/Icons.js";
import { KittenScientists } from "../../../KittenScientists.js";
import stylesIconButton from "../IconButton.module.css";
import { UiComponent, UiComponentOptions } from "../UiComponent.js";
import styles from "./ExpandoButton.module.css";

export class ExpandoButton extends UiComponent {
  readonly element: JQuery;

  /**
   * Constructs an expando element that is commonly used to expand and
   * collapses a section of the UI.
   *
   * @param host A reference to the host.
   * @param options Options for this expando.
   */
  constructor(host: KittenScientists, options?: Partial<UiComponentOptions>) {
    super(host, options);

    const element = $("<div/>", {
      html: `
      <svg style="width: 18px; height: 18px;" viewBox="0 -960 960 960" fill="currentColor" class="${styles.down}"><path d="${Icons.ExpandCircleDown}"/></svg>
      <svg style="width: 18px; height: 18px;" viewBox="0 -960 960 960" fill="currentColor" class="${styles.up}"><path d="${Icons.ExpandCircleUp}"/></svg>
      `,
      title: host.engine.i18n("ui.itemsShow"),
    })
      .addClass(stylesIconButton.iconButton)
      .addClass(styles.expandoButton);

    this.element = element;
    this.addChildren(options?.children);
  }

  setCollapsed() {
    this.element.removeClass(styles.expanded);
    this.element.prop("title", this._host.engine.i18n("ui.itemsShow"));
  }
  setExpanded() {
    this.element.addClass(styles.expanded);
    this.element.prop("title", this._host.engine.i18n("ui.itemsHide"));
  }
}
