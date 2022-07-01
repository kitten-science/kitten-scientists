import { TimeSettings } from "../options/TimeSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class TimeSettingsUi extends SettingsSectionUi<TimeSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: TimeSettings;

  constructor(host: UserScript, options: TimeSettings = host.options.auto.time) {
    super(host);

    this._options = options;

    const toggleName = "time";
    const label = ucfirst(this._host.i18n("ui.time"));

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getOptionList(toggleName);

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, label, this._options, list);
    this._options.$enabled = element.checkbox;

    // Create "trigger" button in the item.
    this._options.$trigger = this._registerTriggerButton(toggleName, label, this._options);

    const optionButtons = [
      this._getOption(
        "temporalBattery",
        this._options.items.temporalBattery,
        this._host.i18n("$time.cfu.temporalBattery.label")
      ),
      this._getOption(
        "blastFurnace",
        this._options.items.blastFurnace,
        this._host.i18n("$time.cfu.blastFurnace.label")
      ),
      this._getOption(
        "timeBoiler",
        this._options.items.timeBoiler,
        this._host.i18n("$time.cfu.timeBoiler.label")
      ),
      this._getOption(
        "temporalAccelerator",
        this._options.items.temporalAccelerator,
        this._host.i18n("$time.cfu.temporalAccelerator.label")
      ),
      this._getOption(
        "temporalImpedance",
        this._options.items.temporalImpedance,
        this._host.i18n("$time.cfu.temporalImpedance.label")
      ),
      this._getOption(
        "ressourceRetrieval",
        this._options.items.ressourceRetrieval,
        this._host.i18n("$time.cfu.ressourceRetrieval.label"),
        true
      ),

      this._getOption(
        "cryochambers",
        this._options.items.cryochambers,
        this._host.i18n("$time.vsu.cryochambers.label")
      ),
      this._getOption(
        "voidHoover",
        this._options.items.voidHoover,
        this._host.i18n("$time.vsu.voidHoover.label")
      ),
      this._getOption(
        "voidRift",
        this._options.items.voidRift,
        this._host.i18n("$time.vsu.voidRift.label")
      ),
      this._getOption(
        "chronocontrol",
        this._options.items.chronocontrol,
        this._host.i18n("$time.vsu.chronocontrol.label")
      ),
      this._getOption(
        "voidResonator",
        this._options.items.voidResonator,
        this._host.i18n("$time.vsu.voidResonator.label")
      ),
    ];

    list.append(...optionButtons);

    element.panel.append(this._options.$trigger);
    element.panel.append(list);

    this.element = element.panel;
  }

  getState(): TimeSettings {
    return {
      enabled: this._options.enabled,
      trigger: this._options.trigger,
      items: this._options.items,
    };
  }

  setState(state: TimeSettings): void {
    this._options.enabled = state.enabled;
    this._options.trigger = state.trigger;

    for (const [name, option] of objectEntries(this._options.items)) {
      option.enabled = state.items[name].enabled;
    }
  }

  refreshUi(): void {
    mustExist(this._options.$enabled).prop("checked", this._options.enabled);
    mustExist(this._options.$trigger)[0].title = this._options.trigger.toFixed(3);

    for (const [name, option] of objectEntries(this._options.items)) {
      mustExist(option.$enabled).prop("checked", this._options.items[name].enabled);
    }
  }
}
