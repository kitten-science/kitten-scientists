import { consumeEntriesPedantic, objectEntries } from "../tools/Entries";
import { isNil, Maybe } from "../tools/Maybe";
import { SpaceBuildings } from "../types";
import { Setting, SettingTrigger } from "./Settings";
import { LegacyStorage } from "./SettingsStorage";

export class ResetSpaceBuildingSetting extends SettingTrigger {
  readonly building: SpaceBuildings;

  constructor(building: SpaceBuildings, enabled = false, trigger = 1) {
    super(enabled, trigger);
    this.building = building;
  }
}

export type ResetSpaceBuildingSettings = Record<SpaceBuildings, SettingTrigger>;

export class ResetSpaceSettings extends Setting {
  readonly buildings: ResetSpaceBuildingSettings;

  constructor(
    enabled = false,
    buildings: ResetSpaceBuildingSettings = {
      containmentChamber: new ResetSpaceBuildingSetting("containmentChamber", true, -1),
      cryostation: new ResetSpaceBuildingSetting("cryostation", true, -1),
      entangler: new ResetSpaceBuildingSetting("entangler", true, -1),
      heatsink: new ResetSpaceBuildingSetting("heatsink", true, -1),
      hrHarvester: new ResetSpaceBuildingSetting("hrHarvester", true, -1),
      hydrofracturer: new ResetSpaceBuildingSetting("hydrofracturer", true, -1),
      hydroponics: new ResetSpaceBuildingSetting("hydroponics", true, -1),
      moltenCore: new ResetSpaceBuildingSetting("moltenCore", true, -1),
      moonBase: new ResetSpaceBuildingSetting("moonBase", true, -1),
      moonOutpost: new ResetSpaceBuildingSetting("moonOutpost", true, -1),
      orbitalArray: new ResetSpaceBuildingSetting("orbitalArray", true, -1),
      planetCracker: new ResetSpaceBuildingSetting("planetCracker", true, -1),
      researchVessel: new ResetSpaceBuildingSetting("researchVessel", true, -1),
      sattelite: new ResetSpaceBuildingSetting("sattelite", true, -1),
      spaceBeacon: new ResetSpaceBuildingSetting("spaceBeacon", true, -1),
      spaceElevator: new ResetSpaceBuildingSetting("spaceElevator", true, -1),
      spaceStation: new ResetSpaceBuildingSetting("spaceStation", true, -1),
      spiceRefinery: new ResetSpaceBuildingSetting("spiceRefinery", true, -1),
      sunforge: new ResetSpaceBuildingSetting("sunforge", true, -1),
      sunlifter: new ResetSpaceBuildingSetting("sunlifter", true, -1),
      tectonic: new ResetSpaceBuildingSetting("tectonic", true, -1),
      terraformingStation: new ResetSpaceBuildingSetting("terraformingStation", true, -1),
    }
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

  static toLegacyOptions(settings: ResetSpaceSettings, subject: LegacyStorage) {
    for (const [name, item] of objectEntries(settings.buildings)) {
      subject.items[`toggle-reset-space-${name}` as const] = item.enabled;
      subject.items[`set-reset-space-${name}-min` as const] = item.trigger;
    }
  }

  static fromLegacyOptions(subject: LegacyStorage) {
    const options = new ResetSpaceSettings();
    options.enabled = true;

    for (const [name, item] of objectEntries(options.buildings)) {
      item.enabled = subject.items[`toggle-reset-space-${name}` as const] ?? item.enabled;
      item.trigger = subject.items[`set-reset-space-${name}-min` as const] ?? item.trigger;
    }

    return options;
  }
}
