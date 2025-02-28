import type { KittenScientists } from "../../KittenScientists.js";
import { UiComponent, type UiComponentInterface, type UiComponentOptions } from "./UiComponent.js";
export type ListItemOptions<TChild extends UiComponentInterface = UiComponentInterface> =
  UiComponentOptions<TChild> & {
    /**
     * Should there be additional padding below this element?
     */
    readonly delimiter: boolean;
  };
export declare class ListItem<
  TOptions extends ListItemOptions<UiComponent> = ListItemOptions<UiComponent>,
> extends UiComponent<TOptions> {
  readonly element: JQuery;
  /**
   * Construct a new simple list item with only a container element.
   *
   * @param host The userscript instance.
   * @param options Options for the list item.
   */
  constructor(host: KittenScientists, options?: Partial<TOptions>);
}
//# sourceMappingURL=ListItem.d.ts.map
