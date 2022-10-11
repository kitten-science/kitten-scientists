import { ResetTimeSettings } from "../options/ResetTimeSettings";
import { SettingTrigger } from "../options/Settings";
import { UserScript } from "../UserScript";
import { SettingsPanel } from "./components/SettingsPanel";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";

export class ResetTimeSettingsUi extends SettingsPanel<ResetTimeSettings> {
  private readonly _buildings: Array<SettingTriggerListItem>;

  constructor(host: UserScript, settings: ResetTimeSettings) {
    const label = host.engine.i18n("ui.time");
    super(host, label, settings);

    this._list.addEventListener("enableAll", () => {
      this._buildings.forEach(item => (item.settings.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._buildings.forEach(item => (item.settings.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.settings.load(new ResetTimeSettings());
      this.refreshUi();
    });

    this._buildings = [
      this._getResetOption(
        this.settings.items.temporalBattery,
        this._host.engine.i18n("$time.cfu.temporalBattery.label")
      ),
      this._getResetOption(
        this.settings.items.blastFurnace,
        this._host.engine.i18n("$time.cfu.blastFurnace.label")
      ),
      this._getResetOption(
        this.settings.items.timeBoiler,
        this._host.engine.i18n("$time.cfu.timeBoiler.label")
      ),
      this._getResetOption(
        this.settings.items.temporalAccelerator,
        this._host.engine.i18n("$time.cfu.temporalAccelerator.label")
      ),
      this._getResetOption(
        this.settings.items.temporalImpedance,
        this._host.engine.i18n("$time.cfu.temporalImpedance.label")
      ),
      this._getResetOption(
        this.settings.items.ressourceRetrieval,
        this._host.engine.i18n("$time.cfu.ressourceRetrieval.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.cryochambers,
        this._host.engine.i18n("$time.vsu.cryochambers.label")
      ),
      this._getResetOption(
        this.settings.items.voidHoover,
        this._host.engine.i18n("$time.vsu.voidHoover.label")
      ),
      this._getResetOption(
        this.settings.items.voidRift,
        this._host.engine.i18n("$time.vsu.voidRift.label")
      ),
      this._getResetOption(
        this.settings.items.chronocontrol,
        this._host.engine.i18n("$time.vsu.chronocontrol.label")
      ),
      this._getResetOption(
        this.settings.items.voidResonator,
        this._host.engine.i18n("$time.vsu.voidResonator.label")
      ),
    ];
    this.addChildren(this._buildings);
  }

  private _getResetOption(
    option: SettingTrigger,
    i18nName: string,
    delimiter = false,
    upgradeIndicator = false
  ) {
    return new SettingTriggerListItem(
      this._host,
      i18nName,
      option,
      {
        onCheck: () => this._host.engine.imessage("status.reset.check.enable", [i18nName]),
        onUnCheck: () => this._host.engine.imessage("status.reset.check.disable", [i18nName]),
      },
      delimiter,
      upgradeIndicator
    );
  }
}
