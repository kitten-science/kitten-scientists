import { objectEntries } from "../tools/Entries";
import { GamePage, SpaceBuildings } from "../types";
import { MissionSettings } from "./MissionSettings";
import { SettingMax, SettingTrigger } from "./Settings";
import { KittenStorageType } from "./SettingsStorage";

export class SpaceBuildingSetting extends SettingMax {
  readonly building: SpaceBuildings;
  constructor(building: SpaceBuildings, enabled = false) {
    super("", enabled);
    this.building = building;
  }
}

export type SpaceSettingsItems = {
  [item in SpaceBuildings]: SpaceBuildingSetting;
};

export class SpaceSettings extends SettingTrigger {
  items: SpaceSettingsItems;

  unlockMissions: MissionSettings;

  constructor(
    enabled = false,
    trigger = 0,
    items = {
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
    unlockMissions = new MissionSettings("unlockMissions")
  ) {
    super("space", enabled, trigger);
    this.items = items;
    this.unlockMissions = unlockMissions;
  }

  static validateGame(game: GamePage, settings: SpaceSettings) {
    MissionSettings.validateGame(game, settings.unlockMissions);
  }

  load(settings: SpaceSettings) {
    this.enabled = settings.enabled;
    this.trigger = settings.trigger;

    for (const [name, item] of objectEntries(settings.items)) {
      this.items[name].enabled = item.enabled;
      this.items[name].max = item.max;
    }

    this.unlockMissions.load(settings.unlockMissions);
  }

  static toLegacyOptions(settings: SpaceSettings, subject: KittenStorageType) {
    subject.toggles.space = settings.enabled;
    subject.triggers.space = settings.trigger;

    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`set-${name}-max` as const] = item.max;
    }

    MissionSettings.toLegacyOptions(settings.unlockMissions, subject);
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new SpaceSettings();
    options.enabled = subject.toggles.space;
    options.trigger = subject.triggers.space;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.max = subject.items[`set-${name}-max` as const] ?? item.max;
    }

    options.unlockMissions = MissionSettings.fromLegacyOptions(subject);

    return options;
  }
}
