import { CollapsiblePanel } from "./CollapsiblePanel.js";
export class SettingsPanel extends CollapsiblePanel {
  setting;
  settingItem;
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
  set readOnly(_value) {
    /* noop */
  }
  check() {
    this.setting.enabled = true;
    this.refreshUi();
  }
  uncheck() {
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
  constructor(host, setting, settingItem, options) {
    super(host, settingItem, options);
    this.settingItem = settingItem;
    this.setting = setting;
  }
}
//# sourceMappingURL=SettingsPanel.js.map
