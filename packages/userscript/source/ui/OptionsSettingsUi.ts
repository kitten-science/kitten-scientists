import { OptionsSettings, OptionsSettingsItem } from "../settings/OptionsSettings";
import { SettingTrigger } from "../settings/Settings";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class OptionsSettingsUi extends SettingsSectionUi<OptionsSettings> {
  protected readonly _buildings: Array<SettingListItem>;

  constructor(host: UserScript, settings: OptionsSettings) {
    const label = host.engine.i18n("ui.options");
    super(host, label, settings);

    this._list.addEventListener("enableAll", () => {
      this._buildings.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._buildings.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.setting.load(new OptionsSettings());
      this.refreshUi();
    });

    this._buildings = [
      this._getOptionsOption(this.setting.items.observe, this._host.engine.i18n("option.observe")),
      this._getOptionsOption(this.setting.items.fixCry, this._host.engine.i18n("option.fix.cry")),
    ];
    this.addChildren(this._buildings);
  }

  private _getOptionsOption(option: OptionsSettingsItem, iname: string) {
    const handler = {
      onCheck: () => this._host.engine.imessage("status.sub.enable", [iname]),
      onUnCheck: () => this._host.engine.imessage("status.sub.disable", [iname]),
    };
    return option.trigger
      ? new SettingTriggerListItem(this._host, iname, option as SettingTrigger, handler)
      : new SettingListItem(this._host, iname, option, handler);
  }
}
