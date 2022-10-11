import { objectEntries } from "../tools/Entries";
import { SpaceBuildings } from "../types";
import { Setting, SettingTrigger } from "./Settings";
import { KittenStorageType } from "./SettingsStorage";

export class ResetSpaceBuildingSetting extends SettingTrigger {
  readonly building: SpaceBuildings;

  constructor(building: SpaceBuildings, enabled = false, trigger = 1) {
    super(building, enabled, trigger);
    this.building = building;
  }
}

export class ResetSpaceSettings extends Setting {
  readonly items: {
    [item in SpaceBuildings]: SettingTrigger;
  };

  constructor(
    enabled = false,
    items = {
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
    super("", enabled);
    this.items = items;
  }

  load(settings: ResetSpaceSettings) {
    this.enabled = settings.enabled;

    for (const [name, item] of objectEntries(settings.items)) {
      this.items[name].enabled = item.enabled;
      this.items[name].trigger = item.trigger;
    }
  }

  static toLegacyOptions(settings: ResetSpaceSettings, subject: KittenStorageType) {
    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-reset-space-${name}` as const] = item.enabled;
      subject.items[`set-reset-space-${name}-min` as const] = item.trigger;
    }
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new ResetSpaceSettings();
    options.enabled = true;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-reset-space-${name}` as const] ?? item.enabled;
      item.trigger = subject.items[`set-reset-space-${name}-min` as const] ?? item.trigger;
    }

    return options;
  }
}
