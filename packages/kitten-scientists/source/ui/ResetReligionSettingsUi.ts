import { Icons } from "../images/Icons";
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
      icon: Icons.Religion,
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
