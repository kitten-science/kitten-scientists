import { UserScript } from "../../UserScript";
import { UiComponent } from "./UiComponent";

export class ExpandoButton extends UiComponent {
  readonly element: JQuery<HTMLElement>;

  /**
   * Constructs an expando element that is commonly used to expand and
   * collapses a section of the UI.
   *
   * @param host A reference to the host.
   */
  constructor(host: UserScript) {
    super(host);

    const element = $("<div/>", {
      title: host.engine.i18n("ui.itemsShow"),
      text: "+",
    }).addClass("ks-expando-button");

    this.element = element;
  }

  setCollapsed() {
    this.element.prop("title", this._host.engine.i18n("ui.itemsShow"));
    this.element.text("+");
  }
  setExpanded() {
    this.element.prop("title", this._host.engine.i18n("ui.itemsHide"));
    this.element.text("-");
  }

  refreshUi() {
    /* intentionally left blank */
  }
}
