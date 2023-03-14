import { consumeEntriesPedantic } from "../tools/Entries";
import { isNil, Maybe } from "../tools/Maybe";
import { GamePage, SpaceBuildings } from "../types";
import { MissionSettings } from "./MissionSettings";
import { SettingMax, SettingTrigger } from "./Settings";

export class SpaceBuildingSetting extends SettingMax {
  readonly #building: SpaceBuildings;

  get building() {
    return this.#building;
  }

  constructor(building: SpaceBuildings, enabled = false) {
    super(enabled);
    this.#building = building;
  }
}

export type SpaceBuildingSettings = Record<SpaceBuildings, SpaceBuildingSetting>;

export class SpaceSettings extends SettingTrigger {
  buildings: SpaceBuildingSettings;

  unlockMissions: MissionSettings;

  constructor(
    enabled = false,
    trigger = 0,
    buildings = {
      containmentChamber: new SpaceBuildingSetting("containmentChamber"),
      cryostation: new SpaceBuildingSetting("cryostation"),
      entangler: new SpaceBuildingSetting("entangler"),
      heatsink: new SpaceBuildingSetting("heatsink"),
      hrHarvester: new SpaceBuildingSetting("hrHarvester"),
      hydrofracturer: new SpaceBuildingSetting("hydrofracturer"),
      hydroponics: new SpaceBuildingSetting("hydroponics"),
      moltenCore: new SpaceBuildingSetting("moltenCore"),
      moonBase: new SpaceBuildingSetting("moonBase"),
      moonOutpost: new SpaceBuildingSetting("moonOutpost"),
      orbitalArray: new SpaceBuildingSetting("orbitalArray"),
      planetCracker: new SpaceBuildingSetting("planetCracker"),
      researchVessel: new SpaceBuildingSetting("researchVessel"),
      sattelite: new SpaceBuildingSetting("sattelite"),
      spaceBeacon: new SpaceBuildingSetting("spaceBeacon"),
      spaceElevator: new SpaceBuildingSetting("spaceElevator"),
      spaceStation: new SpaceBuildingSetting("spaceStation"),
      spiceRefinery: new SpaceBuildingSetting("spiceRefinery"),
      sunforge: new SpaceBuildingSetting("sunforge"),
      sunlifter: new SpaceBuildingSetting("sunlifter"),
      tectonic: new SpaceBuildingSetting("tectonic"),
      terraformingStation: new SpaceBuildingSetting("terraformingStation"),
    },
    unlockMissions = new MissionSettings()
  ) {
    super(enabled, trigger);
    this.buildings = buildings;
    this.unlockMissions = unlockMissions;
  }

  static validateGame(game: GamePage, settings: SpaceSettings) {
    MissionSettings.validateGame(game, settings.unlockMissions);
  }

  load(settings: Maybe<Partial<SpaceSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.buildings, settings.buildings, (building, item) => {
      building.enabled = item?.enabled ?? building.enabled;
      building.max = item?.max ?? building.max;
    });

    this.unlockMissions.load(settings.unlockMissions);
  }
}
