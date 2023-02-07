import { UserScript } from "../../UserScript";
import { UiComponent, UiComponentOptions } from "./UiComponent";

export class ExpandoButton extends UiComponent {
  readonly element: JQuery<HTMLElement>;

  /**
   * Constructs an expando element that is commonly used to expand and
   * collapses a section of the UI.
   *
   * @param host A reference to the host.
   * @param options Options for this expando.
   */
  constructor(host: UserScript, options?: Partial<UiComponentOptions>) {
    super(host, options);

    const element = $("<div/>", {
      title: host.engine.i18n("ui.itemsShow"),
      text: "+",
    }).addClass("ks-expando-button");

    this.element = element;
    this.addChildren(options?.children);
  }

  setCollapsed() {
    this.element.prop("title", this._host.engine.i18n("ui.itemsShow"));
    this.element.text("+");
  }
  setExpanded() {
    this.element.prop("title", this._host.engine.i18n("ui.itemsHide"));
    this.element.text("-");
  }
}
