import { TimeSettings, TimeSettingsItem } from "../options/TimeSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingMaxListItem } from "./components/SettingMaxListItem";
import { SettingsPanel } from "./components/SettingsPanel";
import { TriggerButton } from "./components/TriggerButton";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class TimeSettingsUi extends SettingsSectionUi {
  protected readonly _items: Array<SettingListItem>;
  private readonly _trigger: TriggerButton;
  private readonly _settings: TimeSettings;

  constructor(host: UserScript, settings: TimeSettings) {
    const label = ucfirst(host.engine.i18n("ui.time"));
    const panel = new SettingsPanel(host, label, settings);
    super(host, panel);

    this._settings = settings;

    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertBefore(panel.list);

    this.panel._list.addEventListener("enableAll", () => {
      this._items.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this.panel._list.addEventListener("disableAll", () => {
      this._items.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this.panel._list.addEventListener("reset", () => {
      this._settings.load(new TimeSettings());
      this.refreshUi();
    });

    this._items = [
      this._getTimeSetting(
        this._settings.items.temporalBattery,
        this._host.engine.i18n("$time.cfu.temporalBattery.label")
      ),
      this._getTimeSetting(
        this._settings.items.blastFurnace,
        this._host.engine.i18n("$time.cfu.blastFurnace.label")
      ),
      this._getTimeSetting(
        this._settings.items.timeBoiler,
        this._host.engine.i18n("$time.cfu.timeBoiler.label")
      ),
      this._getTimeSetting(
        this._settings.items.temporalAccelerator,
        this._host.engine.i18n("$time.cfu.temporalAccelerator.label")
      ),
      this._getTimeSetting(
        this._settings.items.temporalImpedance,
        this._host.engine.i18n("$time.cfu.temporalImpedance.label")
      ),
      this._getTimeSetting(
        this._settings.items.ressourceRetrieval,
        this._host.engine.i18n("$time.cfu.ressourceRetrieval.label"),
        true
      ),

      this._getTimeSetting(
        this._settings.items.cryochambers,
        this._host.engine.i18n("$time.vsu.cryochambers.label")
      ),
      this._getTimeSetting(
        this._settings.items.voidHoover,
        this._host.engine.i18n("$time.vsu.voidHoover.label")
      ),
      this._getTimeSetting(
        this._settings.items.voidRift,
        this._host.engine.i18n("$time.vsu.voidRift.label")
      ),
      this._getTimeSetting(
        this._settings.items.chronocontrol,
        this._host.engine.i18n("$time.vsu.chronocontrol.label")
      ),
      this._getTimeSetting(
        this._settings.items.voidResonator,
        this._host.engine.i18n("$time.vsu.voidResonator.label")
      ),
    ];

    for (const setting of this._items) {
      panel.list.append(setting.element);
    }
  }

  private _getTimeSetting(setting: TimeSettingsItem, label: string, delimiter = false) {
    return new SettingMaxListItem(
      this._host,
      label,
      setting,
      {
        onCheck: () => this._host.engine.imessage("status.auto.enable", [label]),
        onUnCheck: () => this._host.engine.imessage("status.auto.disable", [label]),
      },
      delimiter
    );
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

    mustExist(this._settings.$enabled).refreshUi();
    mustExist(this._settings.$trigger).refreshUi();

    for (const [, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).refreshUi();
      mustExist(option.$max).refreshUi();
    }
  }
}
