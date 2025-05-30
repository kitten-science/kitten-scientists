import type { Setting } from "../../settings/Settings.js";
import { CollapsiblePanel, type CollapsiblePanelOptions } from "./CollapsiblePanel.js";
import type { LabelListItem } from "./LabelListItem.js";
import type { SettingListItem } from "./SettingListItem.js";
import type { UiComponent } from "./UiComponent.js";

export type SettingsPanelOptions<TListItem extends LabelListItem = LabelListItem> =
  ThisType<SettingsPanel> &
    CollapsiblePanelOptions & {
      readonly settingItem?: TListItem;
    };

export class SettingsPanel<
    TSetting extends Setting = Setting,
    TListItem extends LabelListItem = LabelListItem,
  >
  extends CollapsiblePanel
  implements SettingListItem
{
  declare readonly options: SettingsPanelOptions<TListItem>;
  readonly setting: TSetting;
  readonly settingItem: TListItem;

  get isExpanded() {
    return this._mainChildVisible;
  }

  // SettingListItem interface
  get elementLabel() {
    return this.head.element;
  }

  get readOnly() {
    return true;
  }
  set readOnly(_value: boolean) {
    /* noop */
  }

  async check() {
    this.setting.enabled = true;
    this.requestRefresh();
  }

  async uncheck() {
    this.setting.enabled = false;
    this.requestRefresh();
  }

  /**
   * Constructs a settings panel that is used to contain a major section of the UI.
   *
   * @param host - A reference to the host.
   * @param settingItem - The UI element to be placed in the head of the panel.
   * @param setting - An setting for which this is the settings panel.
   * @param options - Options for this panel.
   */
  constructor(
    parent: UiComponent,
    setting: TSetting,
    settingItem: TListItem,
    options?: SettingsPanelOptions<TListItem>,
  ) {
    super(parent, settingItem, options);

    this.element = settingItem.element;
    this.settingItem = settingItem;
    this.setting = setting;
  }

  toString(): string {
    return `[${SettingsPanel.name}#${this.componentId}]: '${this.settingItem.elementLabel.text()}'`;
  }
}
