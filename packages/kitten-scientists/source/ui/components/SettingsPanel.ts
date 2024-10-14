import { KittenScientists } from "../../KittenScientists.js";
import { Setting } from "../../settings/Settings.js";
import { CollapsiblePanel, PanelOptions } from "./CollapsiblePanel.js";
import { LabelListItem } from "./LabelListItem.js";
import { SettingListItem } from "./SettingListItem.js";

export type SettingsPanelOptions<TListItem extends LabelListItem = LabelListItem> = PanelOptions & {
  readonly settingItem: TListItem;
};

export class SettingsPanel<
    TSetting extends Setting = Setting,
    TListItem extends LabelListItem = LabelListItem,
  >
  extends CollapsiblePanel
  implements SettingListItem
{
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
  set readOnly(value: boolean) {
    /* noop */
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
    options?: Partial<SettingsPanelOptions<TListItem>>,
  ) {
    super(host, settingItem, options);

    this.settingItem = settingItem;
    this.setting = setting;
  }
}
