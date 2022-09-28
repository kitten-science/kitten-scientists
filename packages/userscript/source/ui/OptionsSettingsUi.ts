import { OptionsSettings, OptionsSettingsItem } from "../options/OptionsSettings";
import { SettingTrigger } from "../options/Settings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { isNil, mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class OptionsSettingsUi extends SettingsSectionUi {
  readonly element: JQuery<HTMLElement>;

  private readonly _settings: OptionsSettings;

  constructor(host: UserScript, settings: OptionsSettings) {
    super(host);

    this._settings = settings;

    const toggleName = "options";
    const label = ucfirst(this._host.i18n("ui.options"));

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getOptionList(toggleName);

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, label, this._settings, list);
    this._settings.$enabled = element.checkbox;

    const optionButtons = [
      this._getOptionsOption(
        "observe",
        this._settings.items.observe,
        this._host.i18n("option.observe")
      ),
      this._getOptionsOption(
        "autofeed",
        this._settings.items.autofeed,
        this._host.i18n("option.autofeed")
      ),
      this._getOptionsOption(
        "crypto",
        this._settings.items.crypto,
        this._host.i18n("option.crypto")
      ),
      this._getOptionsOption(
        "fixCry",
        this._settings.items.fixCry,
        this._host.i18n("option.fix.cry")
      ),
    ];

    list.append(...optionButtons);

    element.panel.append(list);

    this.element = element.panel;
  }

  private _getOptionsOption(
    name: string,
    option: OptionsSettingsItem,
    iname: string
  ): JQuery<HTMLElement> {
    return option.trigger
      ? this._getOptionWithTrigger(name, option as SettingTrigger, iname)
      : this._getOption(name, option, iname);
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
        option.$trigger[0].title = this._renderPercentage(
          mustExist(this._settings.items[name].trigger)
        );
      }
    }
  }
}
