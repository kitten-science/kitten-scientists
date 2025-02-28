import type { KittenScientists } from "../../KittenScientists.js";
import { ListItem, type ListItemOptions } from "./ListItem.js";
import type { TextButton } from "./TextButton.js";
import type { UiComponent } from "./UiComponent.js";
export declare class ButtonListItem<
  TOptions extends ListItemOptions<UiComponent> = ListItemOptions<UiComponent>,
> extends ListItem<TOptions> {
  readonly button: TextButton;
  constructor(host: KittenScientists, button: TextButton, options?: Partial<TOptions>);
  refreshUi(): void;
}
//# sourceMappingURL=ButtonListItem.d.ts.map
