import { SpaceSettings } from "../options/SpaceSettings";
import { filterType } from "../tools/Array";
import { UserScript } from "../UserScript";
import { HeaderListItem } from "./components/HeaderListItem";
import { SettingListItem } from "./components/SettingListItem";
import { TriggerButton } from "./components/TriggerButton";
import { MissionSettingsUi } from "./MissionSettingsUi";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class SpaceSettingsUi extends SettingsSectionUi<SpaceSettings> {
  private readonly _trigger: TriggerButton;
  private readonly _buildings: Array<SettingListItem>;
  private readonly _missionsUi: MissionSettingsUi;

  constructor(host: UserScript, settings: SpaceSettings) {
    const label = host.engine.i18n("ui.space");
    super(host, label, settings);

    // Create "trigger" button in the item.
    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertBefore(this.list);
    this.children.add(this._trigger);

    this._list.addEventListener("enableAll", () => {
      this._buildings.forEach(item => (item.settings.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._buildings.forEach(item => (item.settings.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.settings.load(new SpaceSettings());
      this.refreshUi();
    });

    const uiElements = [
      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.cath.label")),
      this._getBuildOption(
        this.settings.items.spaceElevator,
        this._host.engine.i18n("$space.planet.cath.spaceElevator.label")
      ),
      this._getBuildOption(
        this.settings.items.sattelite,
        this._host.engine.i18n("$space.planet.cath.sattelite.label")
      ),
      this._getBuildOption(
        this.settings.items.spaceStation,
        this._host.engine.i18n("$space.planet.cath.spaceStation.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.moon.label")),
      this._getBuildOption(
        this.settings.items.moonOutpost,
        this._host.engine.i18n("$space.planet.moon.moonOutpost.label")
      ),
      this._getBuildOption(
        this.settings.items.moonBase,
        this._host.engine.i18n("$space.planet.moon.moonBase.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.dune.label")),
      this._getBuildOption(
        this.settings.items.planetCracker,
        this._host.engine.i18n("$space.planet.dune.planetCracker.label")
      ),
      this._getBuildOption(
        this.settings.items.hydrofracturer,
        this._host.engine.i18n("$space.planet.dune.hydrofracturer.label")
      ),
      this._getBuildOption(
        this.settings.items.spiceRefinery,
        this._host.engine.i18n("$space.planet.dune.spiceRefinery.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.piscine.label")),
      this._getBuildOption(
        this.settings.items.researchVessel,
        this._host.engine.i18n("$space.planet.piscine.researchVessel.label")
      ),
      this._getBuildOption(
        this.settings.items.orbitalArray,
        this._host.engine.i18n("$space.planet.piscine.orbitalArray.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.helios.label")),
      this._getBuildOption(
        this.settings.items.sunlifter,
        this._host.engine.i18n("$space.planet.helios.sunlifter.label")
      ),
      this._getBuildOption(
        this.settings.items.containmentChamber,
        this._host.engine.i18n("$space.planet.helios.containmentChamber.label")
      ),
      this._getBuildOption(
        this.settings.items.heatsink,
        this._host.engine.i18n("$space.planet.helios.heatsink.label")
      ),
      this._getBuildOption(
        this.settings.items.sunforge,
        this._host.engine.i18n("$space.planet.helios.sunforge.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.terminus.label")),
      this._getBuildOption(
        this.settings.items.cryostation,
        this._host.engine.i18n("$space.planet.terminus.cryostation.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.kairo.label")),
      this._getBuildOption(
        this.settings.items.spaceBeacon,
        this._host.engine.i18n("$space.planet.kairo.spaceBeacon.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.yarn.label")),
      this._getBuildOption(
        this.settings.items.terraformingStation,
        this._host.engine.i18n("$space.planet.yarn.terraformingStation.label")
      ),
      this._getBuildOption(
        this.settings.items.hydroponics,
        this._host.engine.i18n("$space.planet.yarn.hydroponics.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.umbra.label")),
      this._getBuildOption(
        this.settings.items.hrHarvester,
        this._host.engine.i18n("$space.planet.umbra.hrHarvester.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.charon.label")),
      this._getBuildOption(
        this.settings.items.entangler,
        this._host.engine.i18n("$space.planet.charon.entangler.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.centaurusSystem.label")),
      this._getBuildOption(
        this.settings.items.tectonic,
        this._host.engine.i18n("$space.planet.centaurusSystem.tectonic.label")
      ),
      this._getBuildOption(
        this.settings.items.moltenCore,
        this._host.engine.i18n("$space.planet.centaurusSystem.moltenCore.label"),
        true
      ),
    ];
    this._buildings = filterType(uiElements, SettingListItem);
    this.addChildren(uiElements);

    this.addChild(new HeaderListItem(this._host, "Additional options"));

    this._missionsUi = new MissionSettingsUi(this._host, this.settings.unlockMissions);
    this.addChild(this._missionsUi);
  }
}
