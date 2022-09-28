import { TimeSettings } from "../options/TimeSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class TimeSettingsUi extends SettingsSectionUi {
  readonly element: JQuery<HTMLElement>;

  private readonly _settings: TimeSettings;

  constructor(host: UserScript, settings: TimeSettings) {
    super(host);

    this._settings = settings;

    const toggleName = "time";
    const label = ucfirst(this._host.i18n("ui.time"));

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getOptionList(toggleName);

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, label, this._settings, list);
    this._settings.$enabled = element.checkbox;

    // Create "trigger" button in the item.
    this._settings.$trigger = this._registerTriggerButton(toggleName, label, this._settings);

    const optionButtons = [
      this._getOption(
        "temporalBattery",
        this._settings.items.temporalBattery,
        this._host.i18n("$time.cfu.temporalBattery.label")
      ),
      this._getOption(
        "blastFurnace",
        this._settings.items.blastFurnace,
        this._host.i18n("$time.cfu.blastFurnace.label")
      ),
      this._getOption(
        "timeBoiler",
        this._settings.items.timeBoiler,
        this._host.i18n("$time.cfu.timeBoiler.label")
      ),
      this._getOption(
        "temporalAccelerator",
        this._settings.items.temporalAccelerator,
        this._host.i18n("$time.cfu.temporalAccelerator.label")
      ),
      this._getOption(
        "temporalImpedance",
        this._settings.items.temporalImpedance,
        this._host.i18n("$time.cfu.temporalImpedance.label")
      ),
      this._getOption(
        "ressourceRetrieval",
        this._settings.items.ressourceRetrieval,
        this._host.i18n("$time.cfu.ressourceRetrieval.label"),
        true
      ),

      this._getOption(
        "cryochambers",
        this._settings.items.cryochambers,
        this._host.i18n("$time.vsu.cryochambers.label")
      ),
      this._getOption(
        "voidHoover",
        this._settings.items.voidHoover,
        this._host.i18n("$time.vsu.voidHoover.label")
      ),
      this._getOption(
        "voidRift",
        this._settings.items.voidRift,
        this._host.i18n("$time.vsu.voidRift.label")
      ),
      this._getOption(
        "chronocontrol",
        this._settings.items.chronocontrol,
        this._host.i18n("$time.vsu.chronocontrol.label")
      ),
      this._getOption(
        "voidResonator",
        this._settings.items.voidResonator,
        this._host.i18n("$time.vsu.voidResonator.label")
      ),
    ];

    list.append(...optionButtons);

    element.panel.append(this._settings.$trigger);
    element.panel.append(list);

    this.element = element.panel;
  }

  setState(state: TimeSettings): void {
    this._settings.enabled = state.enabled;
    this._settings.trigger = state.trigger;

    for (const [name, option] of objectEntries(this._settings.items)) {
      option.enabled = state.items[name].enabled;
    }
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).prop("checked", this._settings.enabled);
    mustExist(this._settings.$trigger)[0].title = this._renderPercentage(this._settings.trigger);

    for (const [name, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).prop("checked", this._settings.items[name].enabled);
    }
  }
}
