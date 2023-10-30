import { Maybe, isNil } from "@oliversalzburg/js-utils/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { SpaceBuildings } from "../types/index.js";
import { Setting, SettingTrigger } from "./Settings.js";

export class ResetSpaceBuildingSetting extends SettingTrigger {
  readonly #building: SpaceBuildings;

  get building() {
    return this.#building;
  }

  constructor(building: SpaceBuildings, enabled = false, trigger = 1) {
    super(enabled, trigger);
    this.#building = building;
  }
}

export type ResetSpaceBuildingSettings = Record<SpaceBuildings, SettingTrigger>;

export class ResetSpaceSettings extends Setting {
  readonly buildings: ResetSpaceBuildingSettings;

  constructor(
    enabled = false,
    buildings: ResetSpaceBuildingSettings = {
      containmentChamber: new ResetSpaceBuildingSetting("containmentChamber", false, -1),
      cryostation: new ResetSpaceBuildingSetting("cryostation", false, -1),
      entangler: new ResetSpaceBuildingSetting("entangler", false, -1),
      heatsink: new ResetSpaceBuildingSetting("heatsink", false, -1),
      hrHarvester: new ResetSpaceBuildingSetting("hrHarvester", false, -1),
      hydrofracturer: new ResetSpaceBuildingSetting("hydrofracturer", false, -1),
      hydroponics: new ResetSpaceBuildingSetting("hydroponics", false, -1),
      moltenCore: new ResetSpaceBuildingSetting("moltenCore", false, -1),
      moonBase: new ResetSpaceBuildingSetting("moonBase", false, -1),
      moonOutpost: new ResetSpaceBuildingSetting("moonOutpost", false, -1),
      orbitalArray: new ResetSpaceBuildingSetting("orbitalArray", false, -1),
      planetCracker: new ResetSpaceBuildingSetting("planetCracker", false, -1),
      researchVessel: new ResetSpaceBuildingSetting("researchVessel", false, -1),
      sattelite: new ResetSpaceBuildingSetting("sattelite", false, -1),
      spaceBeacon: new ResetSpaceBuildingSetting("spaceBeacon", false, -1),
      spaceElevator: new ResetSpaceBuildingSetting("spaceElevator", false, -1),
      spaceStation: new ResetSpaceBuildingSetting("spaceStation", false, -1),
      spiceRefinery: new ResetSpaceBuildingSetting("spiceRefinery", false, -1),
      sunforge: new ResetSpaceBuildingSetting("sunforge", false, -1),
      sunlifter: new ResetSpaceBuildingSetting("sunlifter", false, -1),
      tectonic: new ResetSpaceBuildingSetting("tectonic", false, -1),
      terraformingStation: new ResetSpaceBuildingSetting("terraformingStation", false, -1),
    },
  ) {
    super(enabled);
    this.buildings = buildings;
  }

  load(settings: Maybe<Partial<ResetSpaceSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.buildings, settings.buildings, (building, item) => {
      building.enabled = item?.enabled ?? building.enabled;
      building.trigger = item?.trigger ?? building.trigger;
    });
  }
}
