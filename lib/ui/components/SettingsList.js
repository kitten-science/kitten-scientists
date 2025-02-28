import { is, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { Icons } from "../../images/Icons.js";
import { IconButton } from "./IconButton.js";
import { SettingListItem } from "./SettingListItem.js";
import styles from "./SettingsList.module.css";
import { UiComponent } from "./UiComponent.js";
/**
 * The `SettingsList` is a `<ul>` designed to host `SettingListItem` instances.
 *
 * It has enable/disable buttons to check/uncheck all settings contained in it.
 * Most commonly, it is used as part of the `SettingsPanel`.
 *
 * This construct is also sometimes referred to as an "items list" for historic reasons.
 */
export class SettingsList extends UiComponent {
  element;
  list;
  disableAllButton;
  enableAllButton;
  resetButton;
  /**
   * Constructs a `SettingsList`.
   *
   * @param host A reference to the host.
   * @param options Which tools should be available on the list?
   */
  constructor(host, options = {}) {
    super(host, { ...options, children: [] });
    const toolOptions = {
      hasDisableAll: true,
      hasEnableAll: true,
      ...options,
    };
    const hasTools =
      toolOptions.hasDisableAll || toolOptions.hasEnableAll || !isNil(toolOptions.onReset);
    const container = $("<div/>").addClass(styles.listContainer);
    this.list = $("<ul/>").addClass(styles.list).addClass(styles.itemsList);
    container.append(this.list);
    if (hasTools) {
      const tools = $("<div/>").addClass(styles.listTools);
      if (toolOptions.hasEnableAll) {
        const onEnableAll = options.onEnableAll;
        this.enableAllButton = new IconButton(
          this._host,
          Icons.CheckboxCheck,
          host.engine.i18n("ui.enable.all"),
          {
            onClick: () => {
              const event = new Event("enableAll", { cancelable: true });
              this.dispatchEvent(event);
              if (event.defaultPrevented) {
                return;
              }
              for (const child of this.children) {
                if (is(child, SettingListItem)) {
                  child.check();
                }
              }
              if (!isNil(onEnableAll)) {
                onEnableAll();
              }
              this.refreshUi();
            },
          },
        );
        tools.append(this.enableAllButton.element);
      }
      if (toolOptions.hasDisableAll) {
        const onDisableAll = options.onDisableAll;
        this.disableAllButton = new IconButton(
          this._host,
          Icons.CheckboxUnCheck,
          host.engine.i18n("ui.disable.all"),
        );
        this.disableAllButton.element.on("click", () => {
          const event = new Event("disableAll", { cancelable: true });
          this.dispatchEvent(event);
          if (event.defaultPrevented) {
            return;
          }
          for (const child of this.children) {
            if (is(child, SettingListItem)) {
              child.uncheck();
            }
          }
          if (!isNil(onDisableAll)) {
            onDisableAll();
          }
          this.refreshUi();
        });
        tools.append(this.disableAllButton.element);
      }
      const onReset = toolOptions.onReset;
      if (!isNil(onReset)) {
        this.resetButton = new IconButton(this._host, Icons.Reset, host.engine.i18n("ui.reset"), {
          onClick: () => {
            onReset();
          },
        });
        tools.append(this.resetButton.element);
      }
      container.append(tools);
    }
    this.element = container;
    this.addChildren(options.children);
  }
  addChild(child) {
    this.children.add(child);
    this.list.append(child.element);
  }
}
//# sourceMappingURL=SettingsList.js.map
