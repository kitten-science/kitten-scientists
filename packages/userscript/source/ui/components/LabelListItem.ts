import { UserScript } from "../../UserScript";
import { UiComponent } from "./UiComponent";

export class LabelListItem extends UiComponent {
  readonly element: JQuery<HTMLElement>;

  /**
   * Construct a new label list item.
   *
   * @param host The userscript instance.
   * @param label The label on the setting element.
   * @param delimiter Should there be additional padding below this element?
   * @param additionalClasses A list of CSS classes to attach to the element.
   */
  constructor(host: UserScript, label: string, delimiter = false, additionalClasses = []) {
    super(host);

    const element = $(`<li/>`);
    for (const cssClass of ["ks-setting", delimiter ? "ks-delimiter" : "", ...additionalClasses]) {
      element.addClass(cssClass);
    }

    const elementLabel = $("<label/>", {
      text: label,
    }).addClass("ks-label");

    element.append(elementLabel);

    this.element = element;
  }

  refreshUi() {
    /* intentionally left blank */
  }
}
