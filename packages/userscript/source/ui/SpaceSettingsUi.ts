import { SpaceSettings } from "../options/SpaceSettings";
import { filterType } from "../tools/Array";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { HeaderListItem } from "./components/HeaderListItem";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsPanel } from "./components/SettingsPanel";
import { TriggerButton } from "./components/TriggerButton";
import { MissionSettingsUi } from "./MissionSettingsUi";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class SpaceSettingsUi extends SettingsSectionUi {
  protected readonly _items: Array<SettingListItem>;
  private readonly _trigger: TriggerButton;
  private readonly _settings: SpaceSettings;

  private readonly _missionsUi: MissionSettingsUi;

  constructor(host: UserScript, settings: SpaceSettings) {
    const label = ucfirst(host.engine.i18n("ui.space"));
    const panel = new SettingsPanel(host, label, settings);
    super(host, panel);

    this._settings = settings;

    // Create "trigger" button in the item.
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
      this._settings.load(new SpaceSettings());
      this.refreshUi();
    });

    const uiElements = [
      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.cath.label")),
      this._getBuildOption(
        this._settings.items.spaceElevator,
        this._host.engine.i18n("$space.planet.cath.spaceElevator.label")
      ),
      this._getBuildOption(
        this._settings.items.sattelite,
        this._host.engine.i18n("$space.planet.cath.sattelite.label")
      ),
      this._getBuildOption(
        this._settings.items.spaceStation,
        this._host.engine.i18n("$space.planet.cath.spaceStation.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.moon.label")),
      this._getBuildOption(
        this._settings.items.moonOutpost,
        this._host.engine.i18n("$space.planet.moon.moonOutpost.label")
      ),
      this._getBuildOption(
        this._settings.items.moonBase,
        this._host.engine.i18n("$space.planet.moon.moonBase.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.dune.label")),
      this._getBuildOption(
        this._settings.items.planetCracker,
        this._host.engine.i18n("$space.planet.dune.planetCracker.label")
      ),
      this._getBuildOption(
        this._settings.items.hydrofracturer,
        this._host.engine.i18n("$space.planet.dune.hydrofracturer.label")
      ),
      this._getBuildOption(
        this._settings.items.spiceRefinery,
        this._host.engine.i18n("$space.planet.dune.spiceRefinery.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.piscine.label")),
      this._getBuildOption(
        this._settings.items.researchVessel,
        this._host.engine.i18n("$space.planet.piscine.researchVessel.label")
      ),
      this._getBuildOption(
        this._settings.items.orbitalArray,
        this._host.engine.i18n("$space.planet.piscine.orbitalArray.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.helios.label")),
      this._getBuildOption(
        this._settings.items.sunlifter,
        this._host.engine.i18n("$space.planet.helios.sunlifter.label")
      ),
      this._getBuildOption(
        this._settings.items.containmentChamber,
        this._host.engine.i18n("$space.planet.helios.containmentChamber.label")
      ),
      this._getBuildOption(
        this._settings.items.heatsink,
        this._host.engine.i18n("$space.planet.helios.heatsink.label")
      ),
      this._getBuildOption(
        this._settings.items.sunforge,
        this._host.engine.i18n("$space.planet.helios.sunforge.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.terminus.label")),
      this._getBuildOption(
        this._settings.items.cryostation,
        this._host.engine.i18n("$space.planet.terminus.cryostation.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.kairo.label")),
      this._getBuildOption(
        this._settings.items.spaceBeacon,
        this._host.engine.i18n("$space.planet.kairo.spaceBeacon.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.yarn.label")),
      this._getBuildOption(
        this._settings.items.terraformingStation,
        this._host.engine.i18n("$space.planet.yarn.terraformingStation.label")
      ),
      this._getBuildOption(
        this._settings.items.hydroponics,
        this._host.engine.i18n("$space.planet.yarn.hydroponics.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.umbra.label")),
      this._getBuildOption(
        this._settings.items.hrHarvester,
        this._host.engine.i18n("$space.planet.umbra.hrHarvester.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.charon.label")),
      this._getBuildOption(
        this._settings.items.entangler,
        this._host.engine.i18n("$space.planet.charon.entangler.label"),
        true
      ),

      new HeaderListItem(this._host, this._host.engine.i18n("$space.planet.centaurusSystem.label")),
      this._getBuildOption(
        this._settings.items.tectonic,
        this._host.engine.i18n("$space.planet.centaurusSystem.tectonic.label")
      ),
      this._getBuildOption(
        this._settings.items.moltenCore,
        this._host.engine.i18n("$space.planet.centaurusSystem.moltenCore.label"),
        true
      ),
    ];
    this._items = filterType(uiElements, SettingListItem);

    for (const item of uiElements) {
      panel.list.append(item.element);
    }

    const headerAdditions = new HeaderListItem(this._host, "Additional options");

    this._missionsUi = new MissionSettingsUi(this._host, this._settings.unlockMissions);

    panel.list.append(headerAdditions.element, this._missionsUi.element);
  }

  setState(state: SpaceSettings): void {
    this._settings.enabled = state.enabled;
    this._settings.trigger = state.trigger;

    for (const [name, option] of objectEntries(this._settings.items)) {
      option.enabled = state.items[name].enabled;
      option.max = state.items[name].max;
    }

    this._missionsUi.setState(state.unlockMissions);
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).refreshUi();
    mustExist(this._settings.$trigger).refreshUi();

    for (const [, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).refreshUi();
      mustExist(option.$max).refreshUi();
    }

    this._missionsUi.refreshUi();
  }
}
