import { objectEntries } from "../tools/Entries";
import { GamePage, SpaceBuildings } from "../types";
import { MissionSettings } from "./MissionSettings";
import { SettingMax, SettingsSection, SettingToggle, SettingTrigger } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

export type SpaceItem = SpaceBuildings;
export type SpaceSettingsItem = SettingToggle & SettingMax;

export type SpaceAdditionSettings = {
  unlockMissions: MissionSettings;
};

export class SpaceSettings extends SettingsSection implements SettingTrigger {
  trigger = 0;
  $trigger?: JQuery<HTMLElement>;

  addition: SpaceAdditionSettings = {
    unlockMissions: new MissionSettings(),
  };

  items: {
    [item in SpaceItem]: SpaceSettingsItem;
  } = {
    spaceElevator: { enabled: false, max: -1 },
    sattelite: { enabled: false, max: -1 },
    spaceStation: { enabled: false, max: -1 },

    moonOutpost: { enabled: false, max: -1 },
    moonBase: { enabled: false, max: -1 },

    planetCracker: { enabled: false, max: -1 },
    hydrofracturer: { enabled: false, max: -1 },
    spiceRefinery: { enabled: false, max: -1 },

    researchVessel: { enabled: false, max: -1 },
    orbitalArray: { enabled: false, max: -1 },

    sunlifter: { enabled: false, max: -1 },
    containmentChamber: { enabled: false, max: -1 },
    heatsink: { enabled: false, max: -1 },
    sunforge: { enabled: false, max: -1 },

    cryostation: { enabled: false, max: -1 },

    spaceBeacon: { enabled: false, max: -1 },

    terraformingStation: { enabled: false, max: -1 },
    hydroponics: { enabled: false, max: -1 },

    hrHarvester: { enabled: false, max: -1 },

    entangler: { enabled: false, max: -1 },

    tectonic: { enabled: false, max: -1 },
    moltenCore: { enabled: false, max: -1 },
  };

  static validateGame(game: GamePage, settings: SpaceSettings) {
    MissionSettings.validateGame(game, settings.addition.unlockMissions);
  }

  static toLegacyOptions(settings: SpaceSettings, subject: KittenStorageType) {
    subject.toggles.space = settings.enabled;
    subject.triggers.space = settings.trigger;

    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`set-${name}-max` as const] = item.max;
    }

    subject.items["toggle-missions"] = settings.addition.unlockMissions.enabled;
    for (const [name, item] of objectEntries(settings.addition.unlockMissions.items)) {
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

    options.addition.unlockMissions.enabled =
      subject.items["toggle-missions"] ?? options.addition.unlockMissions.enabled;
    for (const [name, item] of objectEntries(options.addition.unlockMissions.items)) {
      item.enabled = subject.items[`toggle-mission-${name}` as const] ?? item.enabled;
    }

    return options;
  }
}
