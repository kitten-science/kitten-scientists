import { Container } from "./Container.js";
import styles from "./LabelListItem.module.css";
import { ListItem, type ListItemOptions } from "./ListItem.js";
import stylesListItem from "./ListItem.module.css";
import type { UiComponent, UiComponentInterface } from "./UiComponent.js";

export type LabelListItemOptions = ThisType<LabelListItem> &
  ListItemOptions & {
    /**
     * When set to an SVG path, will be used as an icon on the label.
     */
    readonly icon?: string;

    /**
     * Should an indicator be rendered in front of the element,
     * to indicate that this is an upgrade of a prior setting?
     */
    readonly upgradeIndicator?: boolean;
  };

export class LabelListItem extends ListItem {
  declare readonly options: LabelListItemOptions;
  readonly head: Container;
  readonly elementLabel: JQuery;

  /**
   * Construct a new label list item.
   *
   * @param host The userscript instance.
   * @param label The label on the setting element.
   * @param options Options for the list item.
   */
  constructor(parent: UiComponent, label: string, options?: LabelListItemOptions) {
    super(parent, options);

    this.head = new Container(parent);
    this.head.element.addClass(stylesListItem.head);
    this.addChild(this.head);

    this.elementLabel = $("<label/>", {
      text: `${options?.upgradeIndicator === true ? "⮤ " : ""}${label}`,
    })
      .addClass(styles.label)
      .addClass(stylesListItem.label);
    this.head.element.append(this.elementLabel);

    if (options?.icon) {
      const iconElement = $("<div/>", {
        html: `<svg style="width: 15px; height: 15px;" viewBox="0 -960 960 960" fill="currentColor"><path d="${options.icon}"/></svg>`,
      }).addClass(styles.iconLabel);
      this.elementLabel.prepend(iconElement);
    }
  }

  toString(): string {
    return `[${LabelListItem.name}#${this.componentId}]: ${this.elementLabel.text()}`;
  }

  addChildHead(child: UiComponentInterface): this {
    this.head.addChild(child);
    return this;
  }
  addChildrenHead(children?: Iterable<UiComponentInterface>): this {
    for (const child of children ?? []) {
      this.head.addChild(child);
    }
    return this;
  }

  requestRefresh(withChildren = false, depth = 0) {
    super.requestRefresh(withChildren, depth);
    this.head.requestRefresh(true, depth + 1);
  }
}
