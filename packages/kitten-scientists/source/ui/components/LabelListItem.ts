import { KittenScientists } from "../../KittenScientists.js";
import { Container } from "./Container.js";
import { ListItem, ListItemOptions } from "./ListItem.js";

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
  readonly head: Container;
  readonly elementLabel: JQuery;

  /**
   * Construct a new label list item.
   *
   * @param host The userscript instance.
   * @param label The label on the setting element.
   * @param options Options for the list item.
   */
  constructor(host: KittenScientists, label: string, options?: Partial<LabelListItemOptions>) {
    super(host, options);

    this.head = new Container(host);
    this.head.element.addClass("ks-head");
    this.addChild(this.head);

    this.elementLabel = $("<label/>", {
      text: `${options?.upgradeIndicator === true ? `⮤ ` : ""}${label}`,
    }).addClass("ks-label");
    this.head.element.append(this.elementLabel);

    const spacer = new Container(host);
    spacer.element.addClass("ks-fill-space");
    this.head.addChild(spacer);

    if (options?.icon) {
      const iconElement = $("<div/>", {
        html: `<svg style="width: 15px; height: 15px;" viewBox="0 -960 960 960" fill="currentColor"><path d="${options.icon}"/></svg>`,
      }).addClass("ks-icon-label");
      this.elementLabel.prepend(iconElement);
    }
  }
}
