import { is, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { Icons } from "../../images/Icons.js";
import { Container } from "./Container.js";
import { IconButton } from "./IconButton.js";
import { SettingListItem } from "./SettingListItem.js";
import styles from "./SettingsList.module.css";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";

export type SettingsListOptions = ThisType<SettingsList> &
  UiComponentOptions & {
    readonly hasEnableAll?: boolean;
    readonly hasDisableAll?: boolean;
    readonly onEnableAll?: () => void;
    readonly onDisableAll?: () => void;
    readonly onReset?: () => void;
  };

/**
 * The `SettingsList` is a `<ul>` designed to host `SettingListItem` instances.
 *
 * It has enable/disable buttons to check/uncheck all settings contained in it.
 * Most commonly, it is used as part of the `SettingsPanel`.
 *
 * This construct is also sometimes referred to as an "items list" for historic reasons.
 */
export class SettingsList extends UiComponent {
  declare readonly options: SettingsListOptions;
  readonly list: JQuery;

  readonly disableAllButton: IconButton | undefined;
  readonly enableAllButton: IconButton | undefined;
  readonly resetButton: IconButton | undefined;

  /**
   * Constructs a `SettingsList`.
   *
   * @param host A reference to the host.
   * @param options Which tools should be available on the list?
   */
  constructor(parent: UiComponent, options?: SettingsListOptions) {
    super(parent, { ...options });

    const toolOptions = {
      hasDisableAll: true,
      hasEnableAll: true,
      ...options,
    };
    const hasTools =
      toolOptions.hasDisableAll || toolOptions.hasEnableAll || !isNil(toolOptions.onReset);

    this.element = $("<div/>").addClass(styles.listContainer);

    this.list = $("<ul/>").addClass(styles.list).addClass(styles.itemsList);

    this.element.append(this.list);

    if (hasTools) {
      const tools = new Container(this, { classes: [styles.listTools] });

      if (toolOptions.hasEnableAll) {
        this.enableAllButton = new IconButton(
          parent,
          Icons.CheckboxCheck,
          parent.host.engine.i18n("ui.enable.all"),
          {
            onClick: async () => {
              const event = new Event("enableAll", { cancelable: true });
              this.element[0].dispatchEvent(event);
              if (event.defaultPrevented) {
                return;
              }

              for (const child of this.children) {
                if (is(child, SettingListItem)) {
                  await child.check(true);
                }
              }

              options?.onEnableAll?.call(this);
            },
          },
        );
        tools.addChild(this.enableAllButton);
      }

      if (toolOptions.hasDisableAll) {
        this.disableAllButton = new IconButton(
          parent,
          Icons.CheckboxUnCheck,
          parent.host.engine.i18n("ui.disable.all"),
          {
            onClick: async () => {
              const event = new Event("disableAll", { cancelable: true });
              this.element[0].dispatchEvent(event);
              if (event.defaultPrevented) {
                return;
              }

              for (const child of this.children) {
                if (is(child, SettingListItem)) {
                  await child.uncheck(true);
                }
              }

              options?.onDisableAll?.call(this);
            },
          },
        );
        tools.addChild(this.disableAllButton);
      }

      const onReset = toolOptions.onReset;
      if (!isNil(onReset)) {
        this.resetButton = new IconButton(
          parent,
          Icons.Reset,
          parent.host.engine.i18n("ui.reset"),
          {
            onClick: () => {
              onReset();
            },
          },
        );
        tools.addChild(this.resetButton);
      }

      super.addChild(tools);
    }
  }

  toString(): string {
    return `[${SettingsList.name}#${this.componentId}]`;
  }

  override addChild(child: UiComponent): this {
    child.parent = this;
    this.children.add(child);
    this.list.append(child.element);
    return this;
  }
}
