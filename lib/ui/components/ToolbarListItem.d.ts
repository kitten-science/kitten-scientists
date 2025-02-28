import type { KittenScientists } from "../../KittenScientists.js";
import type { Button } from "./Button.js";
import type { IconButton } from "./IconButton.js";
import { ListItem, type ListItemOptions } from "./ListItem.js";
import type { UiComponent } from "./UiComponent.js";
export declare class ToolbarListItem<
  TOptions extends ListItemOptions<UiComponent> = ListItemOptions<UiComponent>,
> extends ListItem {
  readonly buttons: Array<Button | IconButton>;
  constructor(
    host: KittenScientists,
    buttons: Array<Button | IconButton>,
    options?: Partial<TOptions>,
  );
  refreshUi(): void;
}
//# sourceMappingURL=ToolbarListItem.d.ts.map
