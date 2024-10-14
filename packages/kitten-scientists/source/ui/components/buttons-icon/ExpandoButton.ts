import { Icons } from "../../../images/Icons.js";
import { KittenScientists } from "../../../KittenScientists.js";
import { UiComponent, UiComponentOptions } from "../UiComponent.js";

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
      <svg style="width: 18px; height: 18px;" viewBox="0 -960 960 960" fill="currentColor" class="down"><path d="${Icons.ExpandCircleDown}"/></svg>
      <svg style="width: 18px; height: 18px;" viewBox="0 -960 960 960" fill="currentColor" class="up"><path d="${Icons.ExpandCircleUp}"/></svg>`,
      title: host.engine.i18n("ui.itemsShow"),
    })
      .addClass("ks-icon-button")
      .addClass("ks-expando-button");

    this.element = element;
    this.addChildren(options?.children);
  }

  setCollapsed() {
    this.element.removeClass("expanded");
    this.element.prop("title", this._host.engine.i18n("ui.itemsShow"));
  }
  setExpanded() {
    this.element.addClass("expanded");
    this.element.prop("title", this._host.engine.i18n("ui.itemsHide"));
  }
}
