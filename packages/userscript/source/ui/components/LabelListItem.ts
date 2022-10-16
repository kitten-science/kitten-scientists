import { UserScript } from "../../UserScript";
import { UiComponent } from "./UiComponent";

export class LabelListItem extends UiComponent {
  readonly element: JQuery<HTMLElement>;

  /**
   * Construct a new label list item.
   *
   * @param host The userscript instance.
   * @param label The label on the setting element.
   * @param icon When set to an SVG path, will be used as an icon on the label.
   * @param delimiter Should there be additional padding below this element?
   * @param additionalClasses A list of CSS classes to attach to the element.
   */
  constructor(
    host: UserScript,
    label: string,
    icon: string | undefined = undefined,
    delimiter = false,
    additionalClasses = []
  ) {
    super(host);

    const element = $(`<li/>`);
    for (const cssClass of ["ks-setting", delimiter ? "ks-delimiter" : "", ...additionalClasses]) {
      element.addClass(cssClass);
    }

    if (icon) {
      const iconElement = $("<div/>", {
        html: `<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="${icon}"/></svg>`,
      }).addClass("ks-icon-label");
      element.append(iconElement);
    }

    const elementLabel = $("<label/>", {
      text: label,
    }).addClass("ks-label");

    element.append(elementLabel);

    this.element = element;
  }
}
