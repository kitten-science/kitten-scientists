import type { Button } from "./Button.js";
import type { IconButton } from "./IconButton.js";
import { ListItem, type ListItemOptions } from "./ListItem.js";
import styles from "./ToolbarListItem.module.css";
import type { UiComponent } from "./UiComponent.js";

export type ToolbarListItemOptions = ThisType<ToolbarListItem> & ListItemOptions;

export class ToolbarListItem extends ListItem {
  declare readonly options: ToolbarListItemOptions;

  constructor(parent: UiComponent, options?: ToolbarListItemOptions) {
    super(parent, options);

    this.element.addClass(styles.toolbar);
  }

  toString(): string {
    return `[${ToolbarListItem.name}#${this.componentId}]`;
  }

  override addChild(child: Button | IconButton): this {
    this.children.add(child);
    this.element.append(child.element);
    return this;
  }
}
