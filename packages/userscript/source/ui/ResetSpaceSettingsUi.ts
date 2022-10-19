import { ResetSpaceSettings } from "../settings/ResetSpaceSettings";
import { SettingTrigger } from "../settings/Settings";
import { UserScript } from "../UserScript";
import { IconSettingsPanel } from "./components/IconSettingsPanel";
import { SettingTriggerLimitListItem } from "./components/SettingTriggerLimitListItem";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";

export class ResetSpaceSettingsUi extends IconSettingsPanel<ResetSpaceSettings> {
  private readonly _buildings: Array<SettingTriggerListItem>;

  constructor(host: UserScript, settings: ResetSpaceSettings) {
    const label = host.engine.i18n("ui.space");
    super(
      host,
      label,
      settings,
      "m9.35 20.45 5.3 2.25q.9-1.8 1.925-3.55Q17.6 17.4 18.75 15.8L14.8 15Zm7.7 4.05 6.65 6.65q2.85-1.3 5.35-2.95 2.5-1.65 4.05-3.2 4.05-4.05 5.95-8.3 1.9-4.25 2.05-9.6-5.35.15-9.6 2.05t-8.3 5.95q-1.55 1.55-3.2 4.05-1.65 2.5-2.95 5.35Zm11.45-4.8q-1-1-1-2.475t1-2.475q1-1 2.475-1t2.475 1q1 1 1 2.475t-1 2.475q-1 1-2.475 1t-2.475-1Zm-.75 19.15 5.45-5.45-.8-3.95q-1.6 1.15-3.35 2.175T25.5 33.55Zm16.3-34.7q.45 6.8-1.7 12.4-2.15 5.6-7.1 10.55l-.1.1-.1.1 1.1 5.5q.15.75-.075 1.45-.225.7-.775 1.25l-8.55 8.6-4.25-9.9-8.5-8.5-9.9-4.25 8.6-8.55q.55-.55 1.25-.775.7-.225 1.45-.075l5.5 1.1q.05-.05.1-.075.05-.025.1-.075 4.95-4.95 10.55-7.125 5.6-2.175 12.4-1.725Zm-36.6 27.6Q9.2 30 11.725 29.975 14.25 29.95 16 31.7q1.75 1.75 1.725 4.275Q17.7 38.5 15.95 40.25q-1.3 1.3-4.025 2.15Q9.2 43.25 3.75 44q.75-5.45 1.575-8.2.825-2.75 2.125-4.05Zm2.1 2.15q-.7.75-1.25 2.35t-.95 4.1q2.5-.4 4.1-.95 1.6-.55 2.35-1.25.95-.85.975-2.125.025-1.275-.875-2.225-.95-.9-2.225-.875-1.275.025-2.125.975Z"
    );

    this._list.addEventListener("enableAll", () => {
      this._buildings.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._buildings.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.settings.load(new ResetSpaceSettings());
      this.refreshUi();
    });

    this._buildings = [
      this._getResetOption(
        this.settings.buildings.spaceElevator,
        this._host.engine.i18n("$space.planet.cath.spaceElevator.label")
      ),
      this._getResetOption(
        this.settings.buildings.sattelite,
        this._host.engine.i18n("$space.planet.cath.sattelite.label")
      ),
      this._getResetOption(
        this.settings.buildings.spaceStation,
        this._host.engine.i18n("$space.planet.cath.spaceStation.label"),
        true
      ),

      this._getResetOption(
        this.settings.buildings.moonOutpost,
        this._host.engine.i18n("$space.planet.moon.moonOutpost.label")
      ),
      this._getResetOption(
        this.settings.buildings.moonBase,
        this._host.engine.i18n("$space.planet.moon.moonBase.label"),
        true
      ),

      this._getResetOption(
        this.settings.buildings.planetCracker,
        this._host.engine.i18n("$space.planet.dune.planetCracker.label")
      ),
      this._getResetOption(
        this.settings.buildings.hydrofracturer,
        this._host.engine.i18n("$space.planet.dune.hydrofracturer.label")
      ),
      this._getResetOption(
        this.settings.buildings.spiceRefinery,
        this._host.engine.i18n("$space.planet.dune.spiceRefinery.label"),
        true
      ),

      this._getResetOption(
        this.settings.buildings.researchVessel,
        this._host.engine.i18n("$space.planet.piscine.researchVessel.label")
      ),
      this._getResetOption(
        this.settings.buildings.orbitalArray,
        this._host.engine.i18n("$space.planet.piscine.orbitalArray.label"),
        true
      ),

      this._getResetOption(
        this.settings.buildings.sunlifter,
        this._host.engine.i18n("$space.planet.helios.sunlifter.label")
      ),
      this._getResetOption(
        this.settings.buildings.containmentChamber,
        this._host.engine.i18n("$space.planet.helios.containmentChamber.label")
      ),
      this._getResetOption(
        this.settings.buildings.heatsink,
        this._host.engine.i18n("$space.planet.helios.heatsink.label")
      ),
      this._getResetOption(
        this.settings.buildings.sunforge,
        this._host.engine.i18n("$space.planet.helios.sunforge.label"),
        true
      ),

      this._getResetOption(
        this.settings.buildings.cryostation,
        this._host.engine.i18n("$space.planet.terminus.cryostation.label"),
        true
      ),

      this._getResetOption(
        this.settings.buildings.spaceBeacon,
        this._host.engine.i18n("$space.planet.kairo.spaceBeacon.label"),
        true
      ),

      this._getResetOption(
        this.settings.buildings.terraformingStation,
        this._host.engine.i18n("$space.planet.yarn.terraformingStation.label")
      ),
      this._getResetOption(
        this.settings.buildings.hydroponics,
        this._host.engine.i18n("$space.planet.yarn.hydroponics.label"),
        true
      ),

      this._getResetOption(
        this.settings.buildings.hrHarvester,
        this._host.engine.i18n("$space.planet.umbra.hrHarvester.label"),
        true
      ),

      this._getResetOption(
        this.settings.buildings.entangler,
        this._host.engine.i18n("$space.planet.charon.entangler.label"),
        true
      ),

      this._getResetOption(
        this.settings.buildings.tectonic,
        this._host.engine.i18n("$space.planet.centaurusSystem.tectonic.label")
      ),
      this._getResetOption(
        this.settings.buildings.moltenCore,
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
