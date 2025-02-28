import type { KittenScientists } from "../../KittenScientists.js";
import type { ListItem, ListItemOptions } from "./ListItem.js";
import { UiComponent } from "./UiComponent.js";
export declare class HeaderListItem<
    TOptions extends ListItemOptions<UiComponent> = ListItemOptions<UiComponent>,
  >
  extends UiComponent<TOptions>
  implements ListItem<TOptions>
{
  readonly element: JQuery;
  get elementLabel(): JQuery<HTMLElement>;
  /**
   * Construct an informational text item.
   * This is purely for cosmetic/informational value in the UI.
   *
   * @param host A reference to the host.
   * @param text The text to appear on the header element.
   * @param options Options for the header.
   */
  constructor(host: KittenScientists, text: string, options?: Partial<TOptions>);
}
//# sourceMappingURL=HeaderListItem.d.ts.map
