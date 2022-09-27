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
      spaceElevator: new SettingMax(),
      sattelite: new SettingMax(),
      spaceStation: new SettingMax(),

      moonOutpost: new SettingMax(),
      moonBase: new SettingMax(),

      planetCracker: new SettingMax(),
      hydrofracturer: new SettingMax(),
      spiceRefinery: new SettingMax(),

      researchVessel: new SettingMax(),
      orbitalArray: new SettingMax(),

      sunlifter: new SettingMax(),
      containmentChamber: new SettingMax(),
      heatsink: new SettingMax(),
      sunforge: new SettingMax(),

      cryostation: new SettingMax(),

      spaceBeacon: new SettingMax(),

      terraformingStation: new SettingMax(),
      hydroponics: new SettingMax(),

      hrHarvester: new SettingMax(),

      entangler: new SettingMax(),

      tectonic: new SettingMax(),
      moltenCore: new SettingMax(),
    },
    unlockMissions = new MissionSettings()
  ) {
    super(enabled, trigger);
    this.items = items;
    this.unlockMissions = unlockMissions;
  }

  static validateGame(game: GamePage, settings: SpaceSettings) {
    MissionSettings.validateGame(game, settings.unlockMissions);
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
