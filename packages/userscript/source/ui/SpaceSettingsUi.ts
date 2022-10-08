import { SpaceSettings } from "../options/SpaceSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { SettingUi } from "./SettingUi";

export class SpaceSettingsUi extends SettingsSectionUi {
  readonly element: JQuery<HTMLElement>;

  private readonly _settings: SpaceSettings;

  private _missionsExpanded = false;

  constructor(host: UserScript, settings: SpaceSettings) {
    super(host);

    this._settings = settings;

    const toggleName = "space";
    const label = ucfirst(this._host.engine.i18n("ui.space"));

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getItemsList(toggleName);

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, label, this._settings, list);

    // Create "trigger" button in the item.
    this._settings.$trigger = this._registerTriggerButton(toggleName, label, this._settings);

    const optionButtons = [
      this._getHeader(this._host.engine.i18n("$space.planet.cath.label")),
      this._getBuildOption(
        "spaceElevator",
        this._settings.items.spaceElevator,
        this._host.engine.i18n("$space.planet.cath.spaceElevator.label")
      ),
      this._getBuildOption(
        "sattelite",
        this._settings.items.sattelite,
        this._host.engine.i18n("$space.planet.cath.sattelite.label")
      ),
      this._getBuildOption(
        "spaceStation",
        this._settings.items.spaceStation,
        this._host.engine.i18n("$space.planet.cath.spaceStation.label"),
        true
      ),

      this._getHeader(this._host.engine.i18n("$space.planet.moon.label")),
      this._getBuildOption(
        "moonOutpost",
        this._settings.items.moonOutpost,
        this._host.engine.i18n("$space.planet.moon.moonOutpost.label")
      ),
      this._getBuildOption(
        "moonBase",
        this._settings.items.moonBase,
        this._host.engine.i18n("$space.planet.moon.moonBase.label"),
        true
      ),

      this._getHeader(this._host.engine.i18n("$space.planet.dune.label")),
      this._getBuildOption(
        "planetCracker",
        this._settings.items.planetCracker,
        this._host.engine.i18n("$space.planet.dune.planetCracker.label")
      ),
      this._getBuildOption(
        "hydrofracturer",
        this._settings.items.hydrofracturer,
        this._host.engine.i18n("$space.planet.dune.hydrofracturer.label")
      ),
      this._getBuildOption(
        "spiceRefinery",
        this._settings.items.spiceRefinery,
        this._host.engine.i18n("$space.planet.dune.spiceRefinery.label"),
        true
      ),

      this._getHeader(this._host.engine.i18n("$space.planet.piscine.label")),
      this._getBuildOption(
        "researchVessel",
        this._settings.items.researchVessel,
        this._host.engine.i18n("$space.planet.piscine.researchVessel.label")
      ),
      this._getBuildOption(
        "orbitalArray",
        this._settings.items.orbitalArray,
        this._host.engine.i18n("$space.planet.piscine.orbitalArray.label"),
        true
      ),

      this._getHeader(this._host.engine.i18n("$space.planet.helios.label")),
      this._getBuildOption(
        "sunlifter",
        this._settings.items.sunlifter,
        this._host.engine.i18n("$space.planet.helios.sunlifter.label")
      ),
      this._getBuildOption(
        "containmentChamber",
        this._settings.items.containmentChamber,
        this._host.engine.i18n("$space.planet.helios.containmentChamber.label")
      ),
      this._getBuildOption(
        "heatsink",
        this._settings.items.heatsink,
        this._host.engine.i18n("$space.planet.helios.heatsink.label")
      ),
      this._getBuildOption(
        "sunforge",
        this._settings.items.sunforge,
        this._host.engine.i18n("$space.planet.helios.sunforge.label"),
        true
      ),

      this._getHeader(this._host.engine.i18n("$space.planet.terminus.label")),
      this._getBuildOption(
        "cryostation",
        this._settings.items.cryostation,
        this._host.engine.i18n("$space.planet.terminus.cryostation.label"),
        true
      ),

      this._getHeader(this._host.engine.i18n("$space.planet.kairo.label")),
      this._getBuildOption(
        "spaceBeacon",
        this._settings.items.spaceBeacon,
        this._host.engine.i18n("$space.planet.kairo.spaceBeacon.label"),
        true
      ),

      this._getHeader(this._host.engine.i18n("$space.planet.yarn.label")),
      this._getBuildOption(
        "terraformingStation",
        this._settings.items.terraformingStation,
        this._host.engine.i18n("$space.planet.yarn.terraformingStation.label")
      ),
      this._getBuildOption(
        "hydroponics",
        this._settings.items.hydroponics,
        this._host.engine.i18n("$space.planet.yarn.hydroponics.label"),
        true
      ),

      this._getHeader(this._host.engine.i18n("$space.planet.umbra.label")),
      this._getBuildOption(
        "hrHarvester",
        this._settings.items.hrHarvester,
        this._host.engine.i18n("$space.planet.umbra.hrHarvester.label"),
        true
      ),

      this._getHeader(this._host.engine.i18n("$space.planet.charon.label")),
      this._getBuildOption(
        "entangler",
        this._settings.items.entangler,
        this._host.engine.i18n("$space.planet.charon.entangler.label"),
        true
      ),

      this._getHeader(this._host.engine.i18n("$space.planet.centaurusSystem.label")),
      this._getBuildOption(
        "tectonic",
        this._settings.items.tectonic,
        this._host.engine.i18n("$space.planet.centaurusSystem.tectonic.label")
      ),
      this._getBuildOption(
        "moltenCore",
        this._settings.items.moltenCore,
        this._host.engine.i18n("$space.planet.centaurusSystem.moltenCore.label"),
        true
      ),
    ];

    list.append(...optionButtons);

    const additionOptions = this._getAdditionOptions();
    list.append(additionOptions);

    element.append(this._settings.$trigger);
    element.append(list);

    this.element = element;
  }

  private _getAdditionOptions(): Array<JQuery<HTMLElement>> {
    const header = this._getHeader("Additional options");

    const missionsButton = SettingUi.make(
      this._host,
      "missions",
      this._settings.unlockMissions,
      this._host.engine.i18n("ui.upgrade.missions"),
      {
        onCheck: () =>
          this._host.engine.imessage("status.auto.enable", [
            this._host.engine.i18n("ui.upgrade.missions"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.auto.disable", [
            this._host.engine.i18n("ui.upgrade.missions"),
          ]),
      }
    );

    const missionsList = SettingsSectionUi.getList("items-list-missions");

    const missionButtons = [];
    for (const [missionName, mission] of objectEntries(this._settings.unlockMissions.items)) {
      const missionLabel = this._host.engine.i18n(`$space.${missionName}.label`);
      const missionButton = SettingUi.make(
        this._host,
        `mission-${missionName}`,
        mission,
        missionLabel,
        {
          onCheck: () => this._host.engine.imessage("status.auto.enable", [missionLabel]),
          onUnCheck: () => this._host.engine.imessage("status.auto.disable", [missionLabel]),
        }
      );

      missionButtons.push({ label: missionLabel, button: missionButton });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    missionButtons.sort((a, b) => a.label.localeCompare(b.label));
    missionButtons.forEach(button => missionsList.append(button.button));

    const missionsItemsButton = this._getItemsToggle("missions-show");
    missionsItemsButton.on("click", () => {
      missionsList.toggle();

      this._missionsExpanded = !this._missionsExpanded;

      missionsItemsButton.text(this._missionsExpanded ? "-" : "+");
      missionsItemsButton.prop(
        "title",
        this._missionsExpanded
          ? this._host.engine.i18n("ui.itemsHide")
          : this._host.engine.i18n("ui.itemsShow")
      );
    });
    missionsButton.append(missionsItemsButton, missionsList);

    return [header, missionsButton];
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

    mustExist(this._settings.$enabled).prop("checked", this._settings.enabled);
    mustExist(this._settings.$trigger)[0].title = SettingsSectionUi.renderPercentage(
      this._settings.trigger
    );

    mustExist(this._settings.unlockMissions.$enabled).prop(
      "checked",
      this._settings.unlockMissions.enabled
    );
    for (const [, option] of objectEntries(this._settings.unlockMissions.items)) {
      mustExist(option.$enabled).prop("checked", option.enabled);
    }

    for (const [name, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).prop("checked", this._settings.items[name].enabled);
      mustExist(option.$max).text(
        this._host.engine.i18n("ui.max", [this._renderLimit(this._settings.items[name].max)])
      );
    }
  }
}
