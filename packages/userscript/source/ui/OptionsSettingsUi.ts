import { OptionsSettings, OptionsSettingsItem } from "../settings/OptionsSettings";
import { SettingTrigger } from "../settings/Settings";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class OptionsSettingsUi extends SettingsSectionUi<OptionsSettings> {
  protected readonly _observeStars: SettingListItem;

  constructor(host: UserScript, settings: OptionsSettings) {
    const label = host.engine.i18n("ui.options");
    super(host, label, settings);

    this._list.addEventListener("enableAll", () => {
      this._observeStars.setting.enabled = true;
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._observeStars.setting.enabled = false;
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.setting.load(new OptionsSettings());
      this.refreshUi();
    });

    this._observeStars = this._getOptionsOption(
      this.setting.items.observe,
      this._host.engine.i18n("option.observe")
    );
    this.addChild(this._observeStars);
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
