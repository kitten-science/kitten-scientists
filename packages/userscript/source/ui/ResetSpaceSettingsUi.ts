import { ResetSpaceSettings } from "../options/ResetSpaceSettings";
import { SettingTrigger } from "../options/Settings";
import { UserScript } from "../UserScript";
import { SettingsPanel } from "./components/SettingsPanel";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";

export class ResetSpaceSettingsUi extends SettingsPanel<ResetSpaceSettings> {
  private readonly _buildings: Array<SettingTriggerListItem>;

  constructor(host: UserScript, settings: ResetSpaceSettings) {
    const label = host.engine.i18n("ui.space");
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
      this.settings.load(new ResetSpaceSettings());
      this.refreshUi();
    });

    this._buildings = [
      this._getResetOption(
        this.settings.items.spaceElevator,
        this._host.engine.i18n("$space.planet.cath.spaceElevator.label")
      ),
      this._getResetOption(
        this.settings.items.sattelite,
        this._host.engine.i18n("$space.planet.cath.sattelite.label")
      ),
      this._getResetOption(
        this.settings.items.spaceStation,
        this._host.engine.i18n("$space.planet.cath.spaceStation.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.moonOutpost,
        this._host.engine.i18n("$space.planet.moon.moonOutpost.label")
      ),
      this._getResetOption(
        this.settings.items.moonBase,
        this._host.engine.i18n("$space.planet.moon.moonBase.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.planetCracker,
        this._host.engine.i18n("$space.planet.dune.planetCracker.label")
      ),
      this._getResetOption(
        this.settings.items.hydrofracturer,
        this._host.engine.i18n("$space.planet.dune.hydrofracturer.label")
      ),
      this._getResetOption(
        this.settings.items.spiceRefinery,
        this._host.engine.i18n("$space.planet.dune.spiceRefinery.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.researchVessel,
        this._host.engine.i18n("$space.planet.piscine.researchVessel.label")
      ),
      this._getResetOption(
        this.settings.items.orbitalArray,
        this._host.engine.i18n("$space.planet.piscine.orbitalArray.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.sunlifter,
        this._host.engine.i18n("$space.planet.helios.sunlifter.label")
      ),
      this._getResetOption(
        this.settings.items.containmentChamber,
        this._host.engine.i18n("$space.planet.helios.containmentChamber.label")
      ),
      this._getResetOption(
        this.settings.items.heatsink,
        this._host.engine.i18n("$space.planet.helios.heatsink.label")
      ),
      this._getResetOption(
        this.settings.items.sunforge,
        this._host.engine.i18n("$space.planet.helios.sunforge.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.cryostation,
        this._host.engine.i18n("$space.planet.terminus.cryostation.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.spaceBeacon,
        this._host.engine.i18n("$space.planet.kairo.spaceBeacon.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.terraformingStation,
        this._host.engine.i18n("$space.planet.yarn.terraformingStation.label")
      ),
      this._getResetOption(
        this.settings.items.hydroponics,
        this._host.engine.i18n("$space.planet.yarn.hydroponics.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.hrHarvester,
        this._host.engine.i18n("$space.planet.umbra.hrHarvester.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.entangler,
        this._host.engine.i18n("$space.planet.charon.entangler.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.tectonic,
        this._host.engine.i18n("$space.planet.centaurusSystem.tectonic.label")
      ),
      this._getResetOption(
        this.settings.items.moltenCore,
        this._host.engine.i18n("$space.planet.centaurusSystem.moltenCore.label")
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
