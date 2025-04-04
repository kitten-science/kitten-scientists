import type { KittenScientists } from "../../KittenScientists.js";
import type { Setting } from "../../settings/Settings.js";
import { CollapsiblePanel, type CollapsiblePanelOptions } from "./CollapsiblePanel.js";
import type { LabelListItem } from "./LabelListItem.js";
import type { SettingListItem } from "./SettingListItem.js";

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
  declare readonly _options: SettingsPanelOptions<TListItem>;
  readonly setting: TSetting;
  readonly settingItem: TListItem;

  get isExpanded() {
    return this._mainChildVisible;
  }

  // SettingListItem interface
  get elementLabel() {
    return this._head.element;
  }
  get head() {
    return this._head;
  }

  get readOnly() {
    return true;
  }
  set readOnly(_value: boolean) {
    /* noop */
  }

  async check() {
    this.setting.enabled = true;
    this.refreshUi();
  }

  async uncheck() {
    this.setting.enabled = false;
    this.refreshUi();
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
    host: KittenScientists,
    setting: TSetting,
    settingItem: TListItem,
    options?: SettingsPanelOptions<TListItem>,
  ) {
    super(host, settingItem, options);

    this.settingItem = settingItem;
    this.setting = setting;
  }
}
