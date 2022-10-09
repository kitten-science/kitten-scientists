import { SpaceSettings } from "../options/SpaceSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { HeaderListItem } from "./components/HeaderListItem";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsPanel } from "./components/SettingsPanel";
import { TriggerButton } from "./components/TriggerButton";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class SpaceSettingsUi extends SettingsSectionUi {
  private readonly _trigger: TriggerButton;
  private readonly _settings: SpaceSettings;

  constructor(host: UserScript, settings: SpaceSettings) {
    const label = ucfirst(host.engine.i18n("ui.space"));
    const panel = new SettingsPanel(host, label, settings);
    super(host, panel);

    this._settings = settings;

    // Create "trigger" button in the item.
    this._trigger = new TriggerButton(host, label, settings);
    panel.element.append(this._trigger.element);

    const optionButtons = [
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

    for (const item of optionButtons) {
      panel.list.append(item.element);
    }

    const additionOptions = this._getAdditionOptions();
    panel.list.append(additionOptions);
  }

  private _getAdditionOptions(): Array<JQuery<HTMLElement>> {
    const header = new HeaderListItem(this._host, "Additional options");

    const missionsElement = new SettingsPanel(
      this._host,
      this._host.engine.i18n("ui.upgrade.missions"),
      this._settings.unlockMissions
    );

    const missionButtons = [];
    for (const [missionName, mission] of objectEntries(this._settings.unlockMissions.items)) {
      const missionLabel = this._host.engine.i18n(`$space.${missionName}.label`);
      const missionButton = new SettingListItem(this._host, missionLabel, mission, {
        onCheck: () => this._host.engine.imessage("status.auto.enable", [missionLabel]),
        onUnCheck: () => this._host.engine.imessage("status.auto.disable", [missionLabel]),
      });

      missionButtons.push({ label: missionLabel, button: missionButton });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    missionButtons.sort((a, b) => a.label.localeCompare(b.label));
    missionButtons.forEach(button => missionsElement.list.append(button.button.element));

    return [header.element, missionsElement.element];
  }

  setState(state: SpaceSettings): void {
    this._settings.enabled = state.enabled;
    this._settings.trigger = state.trigger;

    this._settings.unlockMissions.enabled = state.unlockMissions.enabled;
    for (const [name, option] of objectEntries(this._settings.unlockMissions.items)) {
      option.enabled = state.unlockMissions.items[name].enabled;
    }

    for (const [name, option] of objectEntries(this._settings.items)) {
      option.enabled = state.items[name].enabled;
      option.max = state.items[name].max;
    }
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).refreshUi();
    mustExist(this._settings.$trigger).refreshUi();

    mustExist(this._settings.unlockMissions.$enabled).refreshUi();
    for (const [, option] of objectEntries(this._settings.unlockMissions.items)) {
      mustExist(option.$enabled).refreshUi();
    }

    for (const [, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).refreshUi();
      mustExist(option.$max).refreshUi();
    }
  }
}
