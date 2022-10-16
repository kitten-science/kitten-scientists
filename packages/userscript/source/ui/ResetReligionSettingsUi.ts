import { ResetReligionSettings } from "../options/ResetReligionSettings";
import { SettingTrigger } from "../options/Settings";
import { UserScript } from "../UserScript";
import { IconSettingsPanel } from "./components/IconSettingsPanel";
import { SettingTriggerLimitListItem } from "./components/SettingTriggerLimitListItem";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";

export class ResetReligionSettingsUi extends IconSettingsPanel<ResetReligionSettings> {
  private readonly _buildings: Array<SettingTriggerListItem>;

  constructor(host: UserScript, settings: ResetReligionSettings) {
    const label = host.engine.i18n("ui.faith");
    super(
      host,
      label,
      settings,
      "M2 42V14q0-2.3 1.6-3.9t3.9-1.6q2.3 0 3.9 1.6T13 14v1.55L24 6l11 9.55V14q0-2.3 1.6-3.9t3.9-1.6q2.3 0 3.9 1.6T46 14v28H26.5V32q0-1.05-.725-1.775Q25.05 29.5 24 29.5q-1.05 0-1.775.725Q21.5 30.95 21.5 32v10Zm36-25.5h5V14q0-1.05-.725-1.775-.725-.725-1.775-.725-1.05 0-1.775.725Q38 12.95 38 14Zm-33 0h5V14q0-1.05-.725-1.775Q8.55 11.5 7.5 11.5q-1.05 0-1.775.725Q5 12.95 5 14ZM5 39h5V19.5H5Zm8 0h5.5v-7q0-2.3 1.6-3.9t3.9-1.6q2.3 0 3.9 1.6t1.6 3.9v7H35V19.5L24 9.95 13 19.5Zm25 0h5V19.5h-5ZM24 22.75q-1.15 0-1.95-.8t-.8-1.95q0-1.15.8-1.95t1.95-.8q1.15 0 1.95.8t.8 1.95q0 1.15-.8 1.95t-1.95.8Z"
    );

    this._list.addEventListener("enableAll", () => {
      this._buildings.forEach(item => (item.settings.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._buildings.forEach(item => (item.settings.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.settings.load(new ResetReligionSettings());
      this.refreshUi();
    });

    this._buildings = [
      this._getResetOption(
        this.settings.items.unicornPasture,
        this._host.engine.i18n("$buildings.unicornPasture.label")
      ),
      this._getResetOption(
        this.settings.items.unicornTomb,
        this._host.engine.i18n("$religion.zu.unicornTomb.label")
      ),
      this._getResetOption(
        this.settings.items.ivoryTower,
        this._host.engine.i18n("$religion.zu.ivoryTower.label")
      ),
      this._getResetOption(
        this.settings.items.ivoryCitadel,
        this._host.engine.i18n("$religion.zu.ivoryCitadel.label")
      ),
      this._getResetOption(
        this.settings.items.skyPalace,
        this._host.engine.i18n("$religion.zu.skyPalace.label")
      ),
      this._getResetOption(
        this.settings.items.unicornUtopia,
        this._host.engine.i18n("$religion.zu.unicornUtopia.label")
      ),
      this._getResetOption(
        this.settings.items.sunspire,
        this._host.engine.i18n("$religion.zu.sunspire.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.marker,
        this._host.engine.i18n("$religion.zu.marker.label")
      ),
      this._getResetOption(
        this.settings.items.unicornGraveyard,
        this._host.engine.i18n("$religion.zu.unicornGraveyard.label")
      ),
      this._getResetOption(
        this.settings.items.unicornNecropolis,
        this._host.engine.i18n("$religion.zu.unicornNecropolis.label")
      ),
      this._getResetOption(
        this.settings.items.blackPyramid,
        this._host.engine.i18n("$religion.zu.blackPyramid.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.solarchant,
        this._host.engine.i18n("$religion.ru.solarchant.label")
      ),
      this._getResetOption(
        this.settings.items.scholasticism,
        this._host.engine.i18n("$religion.ru.scholasticism.label")
      ),
      this._getResetOption(
        this.settings.items.goldenSpire,
        this._host.engine.i18n("$religion.ru.goldenSpire.label")
      ),
      this._getResetOption(
        this.settings.items.sunAltar,
        this._host.engine.i18n("$religion.ru.sunAltar.label")
      ),
      this._getResetOption(
        this.settings.items.stainedGlass,
        this._host.engine.i18n("$religion.ru.stainedGlass.label")
      ),
      this._getResetOption(
        this.settings.items.solarRevolution,
        this._host.engine.i18n("$religion.ru.solarRevolution.label")
      ),
      this._getResetOption(
        this.settings.items.basilica,
        this._host.engine.i18n("$religion.ru.basilica.label")
      ),
      this._getResetOption(
        this.settings.items.templars,
        this._host.engine.i18n("$religion.ru.templars.label")
      ),
      this._getResetOption(
        this.settings.items.apocripha,
        this._host.engine.i18n("$religion.ru.apocripha.label")
      ),
      this._getResetOption(
        this.settings.items.transcendence,
        this._host.engine.i18n("$religion.ru.transcendence.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.blackObelisk,
        this._host.engine.i18n("$religion.tu.blackObelisk.label")
      ),
      this._getResetOption(
        this.settings.items.blackNexus,
        this._host.engine.i18n("$religion.tu.blackNexus.label")
      ),
      this._getResetOption(
        this.settings.items.blackCore,
        this._host.engine.i18n("$religion.tu.blackCore.label")
      ),
      this._getResetOption(
        this.settings.items.singularity,
        this._host.engine.i18n("$religion.tu.singularity.label")
      ),
      this._getResetOption(
        this.settings.items.blackLibrary,
        this._host.engine.i18n("$religion.tu.blackLibrary.label")
      ),
      this._getResetOption(
        this.settings.items.blackRadiance,
        this._host.engine.i18n("$religion.tu.blackRadiance.label")
      ),
      this._getResetOption(
        this.settings.items.blazar,
        this._host.engine.i18n("$religion.tu.blazar.label")
      ),
      this._getResetOption(
        this.settings.items.darkNova,
        this._host.engine.i18n("$religion.tu.darkNova.label")
      ),
      this._getResetOption(
        this.settings.items.holyGenocide,
        this._host.engine.i18n("$religion.tu.holyGenocide.label")
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
    return new SettingTriggerLimitListItem(
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
