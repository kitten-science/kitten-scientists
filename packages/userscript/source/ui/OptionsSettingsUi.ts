import { OptionsSettings, OptionsSettingsItem } from "../options/OptionsSettings";
import { SettingTrigger } from "../options/Settings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { isNil, mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsPanel } from "./components/SettingsPanel";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class OptionsSettingsUi extends SettingsSectionUi {
  protected readonly _items: Array<SettingListItem>;
  private readonly _settings: OptionsSettings;

  constructor(host: UserScript, settings: OptionsSettings) {
    const label = ucfirst(host.engine.i18n("ui.options"));
    const panel = new SettingsPanel(host, label, settings);
    super(host, panel);

    this._settings = settings;

    this.panel._list.addEventListener("enableAll", () => {
      this._items.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this.panel._list.addEventListener("disableAll", () => {
      this._items.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this.panel._list.addEventListener("reset", () => {
      this._settings.load(new OptionsSettings());
      this.refreshUi();
    });

    this._items = [
      this._getOptionsOption(
        this._settings.items.observe,
        this._host.engine.i18n("option.observe")
      ),
      this._getOptionsOption(
        this._settings.items.autofeed,
        this._host.engine.i18n("option.autofeed")
      ),
      this._getOptionsOption(this._settings.items.crypto, this._host.engine.i18n("option.crypto")),
      this._getOptionsOption(this._settings.items.fixCry, this._host.engine.i18n("option.fix.cry")),
    ];

    for (const item of this._items) {
      panel.list.append(item.element);
    }
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

  setState(state: OptionsSettings): void {
    this._settings.enabled = state.enabled;

    for (const [name, option] of objectEntries(this._settings.items)) {
      option.enabled = state.items[name].enabled;

      if (!isNil(option.$trigger)) {
        option.trigger = state.items[name].trigger;
      }
    }
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).refreshUi();

    for (const [, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).refreshUi();

      if (!isNil(option.$trigger)) {
        option.$trigger.refreshUi();
      }
    }
  }
}
