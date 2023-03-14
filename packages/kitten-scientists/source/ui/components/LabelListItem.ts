import { UserScript } from "../../UserScript";
import { ListItem, ListItemOptions } from "./ListItem";

export type LabelListItemOptions = ListItemOptions & {
  /**
   * When set to an SVG path, will be used as an icon on the label.
   */
  icon: string;

  /**
   * Should an indicator be rendered in front of the element,
   * to indicate that this is an upgrade of a prior setting?
   */
  upgradeIndicator: boolean;
};

export class LabelListItem extends ListItem {
  readonly elementLabel: JQuery<HTMLElement>;

  /**
   * Construct a new label list item.
   *
   * @param host The userscript instance.
   * @param label The label on the setting element.
   * @param options Options for the list item.
   */
  constructor(host: UserScript, label: string, options?: Partial<LabelListItemOptions>) {
    super(host, options);

    this.elementLabel = $("<label/>", {
      text: `${options?.upgradeIndicator === true ? `⮤ ` : ""}${label}`,
    }).addClass("ks-label");

    this.element.append(this.elementLabel);

    if (options?.icon) {
      const iconElement = $("<div/>", {
        html: `<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="${options.icon}"/></svg>`,
      }).addClass("ks-icon-label");
      iconElement.insertBefore(this.elementLabel);
    }
  }
}
