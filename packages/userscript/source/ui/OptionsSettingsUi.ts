import { OptionsSettings, OptionsSettingsItem } from "../options/OptionsSettings";
import { SettingTrigger } from "../options/Settings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { isNil, mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsListUi } from "./SettingsListUi";
import { SettingsPanelUi } from "./SettingsPanelUi";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { SettingTriggerUi } from "./SettingTriggerUi";
import { SettingUi } from "./SettingUi";

export class OptionsSettingsUi extends SettingsSectionUi {
  private readonly _settings: OptionsSettings;

  constructor(host: UserScript, settings: OptionsSettings) {
    const toggleName = "options";
    const label = ucfirst(host.engine.i18n("ui.options"));
    const list = SettingsListUi.getSettingsList(host.engine, toggleName);
    const panel = SettingsPanelUi.make(host, toggleName, label, settings, list);
    super(host, panel, list);

    this._settings = settings;

    const optionButtons = [
      this._getOptionsOption(
        "observe",
        this._settings.items.observe,
        this._host.engine.i18n("option.observe")
      ),
      this._getOptionsOption(
        "autofeed",
        this._settings.items.autofeed,
        this._host.engine.i18n("option.autofeed")
      ),
      this._getOptionsOption(
        "crypto",
        this._settings.items.crypto,
        this._host.engine.i18n("option.crypto")
      ),
      this._getOptionsOption(
        "fixCry",
        this._settings.items.fixCry,
        this._host.engine.i18n("option.fix.cry")
      ),
    ];

    list.append(...optionButtons);

    panel.element.append(list);
  }

  private _getOptionsOption(
    name: string,
    option: OptionsSettingsItem,
    iname: string
  ): JQuery<HTMLElement> {
    const handler = {
      onCheck: () => this._host.engine.imessage("status.sub.enable", [iname]),
      onUnCheck: () => this._host.engine.imessage("status.sub.disable", [iname]),
    };
    return option.trigger
      ? SettingTriggerUi.make(this._host, name, option as SettingTrigger, iname, handler)
      : SettingUi.make(this._host, name, option, iname, handler);
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

    mustExist(this._settings.$enabled).prop("checked", this._settings.enabled);

    for (const [name, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).prop("checked", this._settings.items[name].enabled);

      if (!isNil(option.$trigger)) {
        option.$trigger[0].title = SettingsSectionUi.renderPercentage(
          mustExist(this._settings.items[name].trigger)
        );
      }
    }
  }
}
