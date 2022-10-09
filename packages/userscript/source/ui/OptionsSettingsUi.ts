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
  private readonly _settings: OptionsSettings;

  constructor(host: UserScript, settings: OptionsSettings) {
    const label = ucfirst(host.engine.i18n("ui.options"));
    const panel = new SettingsPanel(host, label, settings);
    super(host, panel);

    this._settings = settings;

    const optionButtons = [
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

    panel.list.append(...optionButtons);
  }

  private _getOptionsOption(option: OptionsSettingsItem, iname: string): JQuery<HTMLElement> {
    const handler = {
      onCheck: () => this._host.engine.imessage("status.sub.enable", [iname]),
      onUnCheck: () => this._host.engine.imessage("status.sub.disable", [iname]),
    };
    return option.trigger
      ? new SettingTriggerListItem(this._host, iname, option as SettingTrigger, handler).element
      : new SettingListItem(this._host, iname, option, handler).element;
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
