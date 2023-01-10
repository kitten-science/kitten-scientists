import { is, isNil } from "../../tools/Maybe";
import { UserScript } from "../../UserScript";
import { DisableButton } from "./buttons-icon/DisableButton";
import { EnableButton } from "./buttons-icon/EnableButton";
import { ResetButton } from "./buttons-icon/ResetButton";
import { ListItem } from "./ListItem";
import { SettingListItem } from "./SettingListItem";
import { UiComponent } from "./UiComponent";

export type SettingsListOptions = {
  /**
   * A component that should be hosted in the panel.
   */
  readonly child?: ListItem;

  /**
   * Component that should be hosted in the panel.
   */
  readonly children?: Array<ListItem>;

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
  readonly element: JQuery<HTMLElement>;
  readonly list: JQuery<HTMLElement>;

  readonly disableAllButton: DisableButton | undefined;
  readonly enableAllButton: EnableButton | undefined;
  readonly resetButton: ResetButton | undefined;

  /**
   * Constructs a `SettingsList`.
   *
   * @param host A reference to the host.
   * @param options Which tools should be available on the list?
   */
  constructor(host: UserScript, options?: SettingsListOptions) {
    super(host);

    const toolOptions: SettingsListOptions = {
      hasDisableAll: true,
      hasEnableAll: true,
      ...options,
    };
    const hasTools =
      toolOptions.hasDisableAll || toolOptions.hasEnableAll || !isNil(toolOptions.onReset);

    const container = $("<div/>").addClass("ks-list-container");

    this.list = $("<ul/>").addClass("ks-list").addClass("ks-items-list");

    container.append(this.list);

    if (hasTools) {
      const tools = $("<div/>").addClass("ks-list-tools");

      if (toolOptions.hasEnableAll) {
        const onEnableAll = options?.onEnableAll;
        this.enableAllButton = new EnableButton(this._host);
        this.enableAllButton.element.on("click", () => {
          const event = new Event("enableAll", { cancelable: true });
          this.dispatchEvent(event);
          if (event.defaultPrevented) {
            return;
          }

          for (const child of this.children) {
            if (is(child, SettingListItem)) {
              (child as SettingListItem).setting.enabled = true;
            }
          }

          if (!isNil(onEnableAll)) {
            onEnableAll();
          }

          this.refreshUi();
        });
        tools.append(this.enableAllButton.element);
      }

      if (toolOptions.hasDisableAll) {
        const onDisableAll = options?.onDisableAll;
        this.disableAllButton = new DisableButton(this._host);
        this.disableAllButton.element.on("click", () => {
          const event = new Event("disableAll", { cancelable: true });
          this.dispatchEvent(event);
          if (event.defaultPrevented) {
            return;
          }

          for (const child of this.children) {
            if (is(child, SettingListItem)) {
              (child as SettingListItem).setting.enabled = false;
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
        this.resetButton = new ResetButton(this._host);
        this.resetButton.element.on("click", () => onReset());
        tools.append(this.resetButton.element);
      }

      container.append(tools);
    }

    this.element = container;

    const child = options?.child;
    if (!isNil(child)) {
      this.addChild(child);
    }
    const children = options?.children;
    if (!isNil(children)) {
      this.addChildren(children);
    }
  }

  override addChild(child: UiComponent) {
    this.children.add(child);
    this.list.append(child.element);
  }
}
