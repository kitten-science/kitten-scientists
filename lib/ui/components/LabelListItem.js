import { Container } from "./Container.js";
import styles from "./LabelListItem.module.css";
import { ListItem } from "./ListItem.js";
import stylesListItem from "./ListItem.module.css";
export class LabelListItem extends ListItem {
  head;
  elementLabel;
  /**
   * Construct a new label list item.
   *
   * @param host The userscript instance.
   * @param label The label on the setting element.
   * @param options Options for the list item.
   */
  constructor(host, label, options) {
    super(host, options);
    this.head = new Container(host);
    this.head.element.addClass(stylesListItem.head);
    this.addChild(this.head);
    this.elementLabel = $("<label/>", {
      text: `${options?.upgradeIndicator === true ? "⮤ " : ""}${label}`,
    })
      .addClass(styles.label)
      .addClass(stylesListItem.label)
      .on("click", () => {
        this.click();
      });
    this.head.element.append(this.elementLabel);
    for (const child of options?.childrenHead ?? []) {
      this.head.addChild(child);
    }
    if (options?.icon) {
      const iconElement = $("<div/>", {
        html: `<svg style="width: 15px; height: 15px;" viewBox="0 -960 960 960" fill="currentColor"><path d="${options.icon}"/></svg>`,
      }).addClass(styles.iconLabel);
      this.elementLabel.prepend(iconElement);
    }
  }
}
//# sourceMappingURL=LabelListItem.js.map
