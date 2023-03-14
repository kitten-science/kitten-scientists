import { Setting } from "../../settings/Settings";
import { isNil, mustExist } from "../../tools/Maybe";
import { UserScript } from "../../UserScript";
import { LabelListItem } from "./LabelListItem";
import { Panel, PanelOptions } from "./Panel";
import { SettingListItem } from "./SettingListItem";

export type SettingsPanelOptions<TListItem extends LabelListItem = LabelListItem> = PanelOptions & {
  readonly settingItem: TListItem;
};

export class SettingsPanel<
    TSetting extends Setting = Setting,
    TListItem extends LabelListItem = LabelListItem
  >
  extends Panel
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

  get readOnly() {
    return true;
  }
  set readOnly(value: boolean) {
    /* noop */
  }

  /**
   * Constructs a settings panel that is used to contain a major section of the UI.
   *
   * @param host A reference to the host.
   * @param label The label to put main checkbox of this section.
   * @param setting An setting for which this is the settings panel.
   * @param options Options for this panel.
   */
  constructor(
    host: UserScript,
    label: string,
    setting: TSetting,
    options?: Partial<SettingsPanelOptions<TListItem>>
  ) {
    const settingItem = !isNil(options?.settingItem)
      ? mustExist(options?.settingItem)
      : (new SettingListItem(host, label, setting, {
          onCheck: () => host.engine.imessage("status.auto.enable", [label]),
          onUnCheck: () => host.engine.imessage("status.auto.disable", [label]),
        }) as unknown as TListItem);
    super(host, settingItem, options);

    this.settingItem = settingItem;
    this.setting = setting;
  }
}
