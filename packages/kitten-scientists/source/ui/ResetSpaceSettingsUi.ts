import { Icons } from "../images/Icons.js";
import { ResetSpaceSettings } from "../settings/ResetSpaceSettings.js";
import { SettingTrigger } from "../settings/Settings.js";
import { UserScript } from "../UserScript.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingTriggerLimitListItem } from "./components/SettingTriggerLimitListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";

export class ResetSpaceSettingsUi extends IconSettingsPanel<ResetSpaceSettings> {
  private readonly _buildings: Array<SettingTriggerListItem>;

  constructor(host: UserScript, settings: ResetSpaceSettings) {
    const label = host.engine.i18n("ui.space");
    super(host, label, settings, {
      icon: Icons.Space,
    });

    this._buildings = [
      this._getResetOption(
        this.setting.buildings.spaceElevator,
        this._host.engine.i18n("$space.planet.cath.spaceElevator.label"),
      ),
      this._getResetOption(
        this.setting.buildings.sattelite,
        this._host.engine.i18n("$space.planet.cath.sattelite.label"),
      ),
      this._getResetOption(
        this.setting.buildings.spaceStation,
        this._host.engine.i18n("$space.planet.cath.spaceStation.label"),
        true,
      ),

      this._getResetOption(
        this.setting.buildings.moonOutpost,
        this._host.engine.i18n("$space.planet.moon.moonOutpost.label"),
      ),
      this._getResetOption(
        this.setting.buildings.moonBase,
        this._host.engine.i18n("$space.planet.moon.moonBase.label"),
        true,
      ),

      this._getResetOption(
        this.setting.buildings.planetCracker,
        this._host.engine.i18n("$space.planet.dune.planetCracker.label"),
      ),
      this._getResetOption(
        this.setting.buildings.hydrofracturer,
        this._host.engine.i18n("$space.planet.dune.hydrofracturer.label"),
      ),
      this._getResetOption(
        this.setting.buildings.spiceRefinery,
        this._host.engine.i18n("$space.planet.dune.spiceRefinery.label"),
        true,
      ),

      this._getResetOption(
        this.setting.buildings.researchVessel,
        this._host.engine.i18n("$space.planet.piscine.researchVessel.label"),
      ),
      this._getResetOption(
        this.setting.buildings.orbitalArray,
        this._host.engine.i18n("$space.planet.piscine.orbitalArray.label"),
        true,
      ),

      this._getResetOption(
        this.setting.buildings.sunlifter,
        this._host.engine.i18n("$space.planet.helios.sunlifter.label"),
      ),
      this._getResetOption(
        this.setting.buildings.containmentChamber,
        this._host.engine.i18n("$space.planet.helios.containmentChamber.label"),
      ),
      this._getResetOption(
        this.setting.buildings.heatsink,
        this._host.engine.i18n("$space.planet.helios.heatsink.label"),
      ),
      this._getResetOption(
        this.setting.buildings.sunforge,
        this._host.engine.i18n("$space.planet.helios.sunforge.label"),
        true,
      ),

      this._getResetOption(
        this.setting.buildings.cryostation,
        this._host.engine.i18n("$space.planet.terminus.cryostation.label"),
        true,
      ),

      this._getResetOption(
        this.setting.buildings.spaceBeacon,
        this._host.engine.i18n("$space.planet.kairo.spaceBeacon.label"),
        true,
      ),

      this._getResetOption(
        this.setting.buildings.terraformingStation,
        this._host.engine.i18n("$space.planet.yarn.terraformingStation.label"),
      ),
      this._getResetOption(
        this.setting.buildings.hydroponics,
        this._host.engine.i18n("$space.planet.yarn.hydroponics.label"),
        true,
      ),

      this._getResetOption(
        this.setting.buildings.hrHarvester,
        this._host.engine.i18n("$space.planet.umbra.hrHarvester.label"),
        true,
      ),

      this._getResetOption(
        this.setting.buildings.entangler,
        this._host.engine.i18n("$space.planet.charon.entangler.label"),
        true,
      ),

      this._getResetOption(
        this.setting.buildings.tectonic,
        this._host.engine.i18n("$space.planet.centaurusSystem.tectonic.label"),
      ),
      this._getResetOption(
        this.setting.buildings.moltenCore,
        this._host.engine.i18n("$space.planet.centaurusSystem.moltenCore.label"),
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
    upgradeIndicator = false,
  ) {
    return new SettingTriggerLimitListItem(this._host, i18nName, option, {
      delimiter,
      onCheck: () => this._host.engine.imessage("status.reset.check.enable", [i18nName]),
      onUnCheck: () => this._host.engine.imessage("status.reset.check.disable", [i18nName]),
      upgradeIndicator,
    });
  }
}
