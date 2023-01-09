import { Icons } from "../images/Icons";
import { ResetTimeSettings } from "../settings/ResetTimeSettings";
import { SettingTrigger } from "../settings/Settings";
import { UserScript } from "../UserScript";
import { IconSettingsPanel } from "./components/IconSettingsPanel";
import { SettingsList } from "./components/SettingsList";
import { SettingTriggerLimitListItem } from "./components/SettingTriggerLimitListItem";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";

export class ResetTimeSettingsUi extends IconSettingsPanel<ResetTimeSettings> {
  private readonly _buildings: Array<SettingTriggerListItem>;

  constructor(host: UserScript, settings: ResetTimeSettings) {
    const label = host.engine.i18n("ui.time");
    super(host, label, settings, {
      icon: Icons.Time,
    });

    this._buildings = [
      this._getResetOption(
        this.setting.buildings.temporalBattery,
        this._host.engine.i18n("$time.cfu.temporalBattery.label")
      ),
      this._getResetOption(
        this.setting.buildings.blastFurnace,
        this._host.engine.i18n("$time.cfu.blastFurnace.label")
      ),
      this._getResetOption(
        this.setting.buildings.timeBoiler,
        this._host.engine.i18n("$time.cfu.timeBoiler.label")
      ),
      this._getResetOption(
        this.setting.buildings.temporalAccelerator,
        this._host.engine.i18n("$time.cfu.temporalAccelerator.label")
      ),
      this._getResetOption(
        this.setting.buildings.temporalImpedance,
        this._host.engine.i18n("$time.cfu.temporalImpedance.label")
      ),
      this._getResetOption(
        this.setting.buildings.ressourceRetrieval,
        this._host.engine.i18n("$time.cfu.ressourceRetrieval.label"),
        true
      ),

      this._getResetOption(
        this.setting.buildings.cryochambers,
        this._host.engine.i18n("$time.vsu.cryochambers.label")
      ),
      this._getResetOption(
        this.setting.buildings.voidHoover,
        this._host.engine.i18n("$time.vsu.voidHoover.label")
      ),
      this._getResetOption(
        this.setting.buildings.voidRift,
        this._host.engine.i18n("$time.vsu.voidRift.label")
      ),
      this._getResetOption(
        this.setting.buildings.chronocontrol,
        this._host.engine.i18n("$time.vsu.chronocontrol.label")
      ),
      this._getResetOption(
        this.setting.buildings.voidResonator,
        this._host.engine.i18n("$time.vsu.voidResonator.label")
      ),
    ];

    const listBuildings = new SettingsList(this._host);
    listBuildings.addChildren(this._buildings);
    this.addChild(listBuildings);
  }

  private _getResetOption(
    option: SettingTrigger,
    i18nName: string,
    delimiter = false,
    upgradeIndicator = false
  ) {
    return new SettingTriggerLimitListItem(this._host, i18nName, option, {
      delimiter,
      onCheck: () => this._host.engine.imessage("status.reset.check.enable", [i18nName]),
      onUnCheck: () => this._host.engine.imessage("status.reset.check.disable", [i18nName]),
      upgradeIndicator,
    });
  }
}
