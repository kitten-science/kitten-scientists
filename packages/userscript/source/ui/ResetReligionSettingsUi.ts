import { ResetReligionSettings } from "../settings/ResetReligionSettings";
import { SettingTrigger } from "../settings/Settings";
import { UserScript } from "../UserScript";
import { IconSettingsPanel } from "./components/IconSettingsPanel";
import { SettingsList } from "./components/SettingsList";
import { SettingTriggerLimitListItem } from "./components/SettingTriggerLimitListItem";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";

export class ResetReligionSettingsUi extends IconSettingsPanel<ResetReligionSettings> {
  private readonly _buildings: Array<SettingTriggerListItem>;

  constructor(host: UserScript, settings: ResetReligionSettings) {
    const label = host.engine.i18n("ui.faith");
    super(host, label, settings, {
      icon: "M2 42V14q0-2.3 1.6-3.9t3.9-1.6q2.3 0 3.9 1.6T13 14v1.55L24 6l11 9.55V14q0-2.3 1.6-3.9t3.9-1.6q2.3 0 3.9 1.6T46 14v28H26.5V32q0-1.05-.725-1.775Q25.05 29.5 24 29.5q-1.05 0-1.775.725Q21.5 30.95 21.5 32v10Zm36-25.5h5V14q0-1.05-.725-1.775-.725-.725-1.775-.725-1.05 0-1.775.725Q38 12.95 38 14Zm-33 0h5V14q0-1.05-.725-1.775Q8.55 11.5 7.5 11.5q-1.05 0-1.775.725Q5 12.95 5 14ZM5 39h5V19.5H5Zm8 0h5.5v-7q0-2.3 1.6-3.9t3.9-1.6q2.3 0 3.9 1.6t1.6 3.9v7H35V19.5L24 9.95 13 19.5Zm25 0h5V19.5h-5ZM24 22.75q-1.15 0-1.95-.8t-.8-1.95q0-1.15.8-1.95t1.95-.8q1.15 0 1.95.8t.8 1.95q0 1.15-.8 1.95t-1.95.8Z",
    });

    this._buildings = [
      this._getResetOption(
        this.setting.buildings.unicornPasture,
        this._host.engine.i18n("$buildings.unicornPasture.label")
      ),
      this._getResetOption(
        this.setting.buildings.unicornTomb,
        this._host.engine.i18n("$religion.zu.unicornTomb.label")
      ),
      this._getResetOption(
        this.setting.buildings.ivoryTower,
        this._host.engine.i18n("$religion.zu.ivoryTower.label")
      ),
      this._getResetOption(
        this.setting.buildings.ivoryCitadel,
        this._host.engine.i18n("$religion.zu.ivoryCitadel.label")
      ),
      this._getResetOption(
        this.setting.buildings.skyPalace,
        this._host.engine.i18n("$religion.zu.skyPalace.label")
      ),
      this._getResetOption(
        this.setting.buildings.unicornUtopia,
        this._host.engine.i18n("$religion.zu.unicornUtopia.label")
      ),
      this._getResetOption(
        this.setting.buildings.sunspire,
        this._host.engine.i18n("$religion.zu.sunspire.label"),
        true
      ),

      this._getResetOption(
        this.setting.buildings.marker,
        this._host.engine.i18n("$religion.zu.marker.label")
      ),
      this._getResetOption(
        this.setting.buildings.unicornGraveyard,
        this._host.engine.i18n("$religion.zu.unicornGraveyard.label")
      ),
      this._getResetOption(
        this.setting.buildings.unicornNecropolis,
        this._host.engine.i18n("$religion.zu.unicornNecropolis.label")
      ),
      this._getResetOption(
        this.setting.buildings.blackPyramid,
        this._host.engine.i18n("$religion.zu.blackPyramid.label"),
        true
      ),

      this._getResetOption(
        this.setting.buildings.solarchant,
        this._host.engine.i18n("$religion.ru.solarchant.label")
      ),
      this._getResetOption(
        this.setting.buildings.scholasticism,
        this._host.engine.i18n("$religion.ru.scholasticism.label")
      ),
      this._getResetOption(
        this.setting.buildings.goldenSpire,
        this._host.engine.i18n("$religion.ru.goldenSpire.label")
      ),
      this._getResetOption(
        this.setting.buildings.sunAltar,
        this._host.engine.i18n("$religion.ru.sunAltar.label")
      ),
      this._getResetOption(
        this.setting.buildings.stainedGlass,
        this._host.engine.i18n("$religion.ru.stainedGlass.label")
      ),
      this._getResetOption(
        this.setting.buildings.solarRevolution,
        this._host.engine.i18n("$religion.ru.solarRevolution.label")
      ),
      this._getResetOption(
        this.setting.buildings.basilica,
        this._host.engine.i18n("$religion.ru.basilica.label")
      ),
      this._getResetOption(
        this.setting.buildings.templars,
        this._host.engine.i18n("$religion.ru.templars.label")
      ),
      this._getResetOption(
        this.setting.buildings.apocripha,
        this._host.engine.i18n("$religion.ru.apocripha.label")
      ),
      this._getResetOption(
        this.setting.buildings.transcendence,
        this._host.engine.i18n("$religion.ru.transcendence.label"),
        true
      ),

      this._getResetOption(
        this.setting.buildings.blackObelisk,
        this._host.engine.i18n("$religion.tu.blackObelisk.label")
      ),
      this._getResetOption(
        this.setting.buildings.blackNexus,
        this._host.engine.i18n("$religion.tu.blackNexus.label")
      ),
      this._getResetOption(
        this.setting.buildings.blackCore,
        this._host.engine.i18n("$religion.tu.blackCore.label")
      ),
      this._getResetOption(
        this.setting.buildings.singularity,
        this._host.engine.i18n("$religion.tu.singularity.label")
      ),
      this._getResetOption(
        this.setting.buildings.blackLibrary,
        this._host.engine.i18n("$religion.tu.blackLibrary.label")
      ),
      this._getResetOption(
        this.setting.buildings.blackRadiance,
        this._host.engine.i18n("$religion.tu.blackRadiance.label")
      ),
      this._getResetOption(
        this.setting.buildings.blazar,
        this._host.engine.i18n("$religion.tu.blazar.label")
      ),
      this._getResetOption(
        this.setting.buildings.darkNova,
        this._host.engine.i18n("$religion.tu.darkNova.label")
      ),
      this._getResetOption(
        this.setting.buildings.holyGenocide,
        this._host.engine.i18n("$religion.tu.holyGenocide.label")
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
