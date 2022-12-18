import { UserScript } from "../../UserScript";
import { UiComponent } from "./UiComponent";

export class ListItem extends UiComponent {
  readonly element: JQuery<HTMLElement>;
  readonly elementLabel: JQuery<HTMLElement>;

  /**
   * Construct a new simple list item with only a label.
   *
   * @param host The userscript instance.
   * @param label The label on the setting element.
   * @param delimiter Should there be additional padding below this element?
   * @param upgradeIndicator Should an indicator be rendered in front of the elemnt,
   * to indicate that this is an upgrade of a prior setting?
   */
  constructor(host: UserScript, label: string, delimiter = false, upgradeIndicator = false) {
    super(host);

    const element = $(`<li/>`);
    for (const cssClass of ["ks-setting", delimiter ? "ks-delimiter" : ""]) {
      element.addClass(cssClass);
    }

    const elementLabel = $("<label/>", {
      text: `${upgradeIndicator ? `⮤ ` : ""}${label}`,
    }).addClass("ks-label");

    element.append(elementLabel);

    this.element = element;
    this.elementLabel = elementLabel;
  }
}
