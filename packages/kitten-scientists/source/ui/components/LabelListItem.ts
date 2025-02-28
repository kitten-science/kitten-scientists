import type { KittenScientists } from "../../KittenScientists.js";
import { Container } from "./Container.js";
import styles from "./LabelListItem.module.css";
import { ListItem, type ListItemOptions } from "./ListItem.js";
import stylesListItem from "./ListItem.module.css";
import type { UiComponent, UiComponentInterface } from "./UiComponent.js";

export type LabelListItemOptions<TChild extends UiComponentInterface = UiComponentInterface> =
  ListItemOptions<TChild> & {
    readonly childrenHead: Array<UiComponent>;

    /**
     * When set to an SVG path, will be used as an icon on the label.
     */
    readonly icon: string;

    /**
     * Should an indicator be rendered in front of the element,
     * to indicate that this is an upgrade of a prior setting?
     */
    readonly upgradeIndicator: boolean;
  };

export class LabelListItem<
  TOptions extends LabelListItemOptions<UiComponent> = LabelListItemOptions<UiComponent>,
> extends ListItem<TOptions> {
  readonly head: Container;
  readonly elementLabel: JQuery;

  /**
   * Construct a new label list item.
   *
   * @param host The userscript instance.
   * @param label The label on the setting element.
   * @param options Options for the list item.
   */
  constructor(host: KittenScientists, label: string, options?: Partial<TOptions>) {
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
