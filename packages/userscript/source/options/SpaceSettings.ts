import { objectEntries } from "../tools/Entries";
import { GamePage, SpaceBuildings } from "../types";
import { MissionSettings } from "./MissionSettings";
import { SettingMax } from "./Settings";
import { SettingsSectionTrigger } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

export type SpaceSettingsItems = {
  [item in SpaceBuildings]: SettingMax;
};

export class SpaceSettings extends SettingsSectionTrigger {
  items: SpaceSettingsItems;

  unlockMissions: MissionSettings;

  constructor(
    enabled = false,
    trigger = 0,
    items = {
      containmentChamber: new SettingMax("containmentChamber"),
      cryostation: new SettingMax("cryostation"),
      entangler: new SettingMax("entangler"),
      heatsink: new SettingMax("heatsink"),
      hrHarvester: new SettingMax("hrHarvester"),
      hydrofracturer: new SettingMax("hydrofracturer"),
      hydroponics: new SettingMax("hydroponics"),
      moltenCore: new SettingMax("moltenCore"),
      moonBase: new SettingMax("moonBase"),
      moonOutpost: new SettingMax("moonOutpost"),
      orbitalArray: new SettingMax("orbitalArray"),
      planetCracker: new SettingMax("planetCracker"),
      researchVessel: new SettingMax("researchVessel"),
      sattelite: new SettingMax("sattelite"),
      spaceBeacon: new SettingMax("spaceBeacon"),
      spaceElevator: new SettingMax("spaceElevator"),
      spaceStation: new SettingMax("spaceStation"),
      spiceRefinery: new SettingMax("spiceRefinery"),
      sunforge: new SettingMax("sunforge"),
      sunlifter: new SettingMax("sunlifter"),
      tectonic: new SettingMax("tectonic"),
      terraformingStation: new SettingMax("terraformingStation"),
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

    this.unlockMissions.enabled = settings.unlockMissions.enabled;
    for (const [name, item] of objectEntries(settings.unlockMissions.items)) {
      this.unlockMissions.items[name].enabled = item.enabled;
    }
  }

  static toLegacyOptions(settings: SpaceSettings, subject: KittenStorageType) {
    subject.toggles.space = settings.enabled;
    subject.triggers.space = settings.trigger;

    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`set-${name}-max` as const] = item.max;
    }

    subject.items["toggle-missions"] = settings.unlockMissions.enabled;
    for (const [name, item] of objectEntries(settings.unlockMissions.items)) {
      subject.items[`toggle-mission-${name}` as const] = item.enabled;
    }
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new SpaceSettings();
    options.enabled = subject.toggles.space;
    options.trigger = subject.triggers.space;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.max = subject.items[`set-${name}-max` as const] ?? item.max;
    }

    options.unlockMissions.enabled =
      subject.items["toggle-missions"] ?? options.unlockMissions.enabled;
    for (const [name, item] of objectEntries(options.unlockMissions.items)) {
      item.enabled = subject.items[`toggle-mission-${name}` as const] ?? item.enabled;
    }

    return options;
  }
}
