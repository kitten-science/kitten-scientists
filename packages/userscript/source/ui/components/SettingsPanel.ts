import { Setting } from "../../settings/Settings";
import { UserScript } from "../../UserScript";
import { Panel } from "./Panel";
import { SettingListItem } from "./SettingListItem";
import { SettingsList } from "./SettingsList";
import { UiComponent } from "./UiComponent";

export class SettingsPanel<TSetting extends Setting = Setting>
  extends Panel
  implements SettingListItem
{
  readonly list: SettingsList;
  readonly setting: TSetting;
  readonly settingItem: SettingListItem;

  get isExpanded() {
    return this._mainChildVisible;
  }

  // SettingListItem interface
  get checkbox() {
    return this.settingItem.checkbox;
  }
  get elementLabel() {
    return this._head.element;
  }
  get readOnly() {
    return this.settingItem.readOnly;
  }
  set readOnly(value: boolean) {
    this.settingItem.readOnly = value;
  }

  /**
   * Constructs a settings panel that is used to contain a major section of the UI.
   *
   * @param host A reference to the host.
   * @param label The label to put main checkbox of this section.
   * @param setting An setting for which this is the settings panel.
   * @param initiallyExpanded Should the main child be expanded right away?
   */
  constructor(host: UserScript, label: string, setting: TSetting, initiallyExpanded = false) {
    const list = new SettingsList(host);
    const settingItem = new SettingListItem(host, label, setting, {
      onCheck: () => host.engine.imessage("status.auto.enable", [label]),
      onUnCheck: () => host.engine.imessage("status.auto.disable", [label]),
    });
    super(host, list, settingItem, initiallyExpanded);
    this.list = list;
    this.settingItem = settingItem;

    this.setting = setting;
  }

  override addChild(child: UiComponent) {
    this.children.add(child);
    this._child.element.append(child.element);
  }
}
