import type { KittenScientists } from "../../KittenScientists.js";
import { Container } from "./Container.js";
import { ListItem, type ListItemOptions } from "./ListItem.js";
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
export declare class LabelListItem<
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
  constructor(host: KittenScientists, label: string, options?: Partial<TOptions>);
}
//# sourceMappingURL=LabelListItem.d.ts.map
