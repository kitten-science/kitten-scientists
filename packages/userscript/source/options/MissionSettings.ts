import { difference } from "../tools/Array";
import { objectEntries } from "../tools/Entries";
import { cwarn } from "../tools/Log";
import { GamePage, Missions } from "../types";
import { Setting } from "./Settings";
import { KittenStorageType } from "./SettingsStorage";

export class MissionSettings extends Setting {
  items: {
    [item in Missions]: Setting;
  };

  constructor(
    id = "missions",
    enabled = false,
    items = {
      centaurusSystemMission: new Setting("centaurusSystemMission", true),
      charonMission: new Setting("charonMission", true),
      duneMission: new Setting("duneMission", true),
      furthestRingMission: new Setting("furthestRingMission", true),
      heliosMission: new Setting("heliosMission", true),
      kairoMission: new Setting("kairoMission", true),
      moonMission: new Setting("moonMission", true),
      orbitalLaunch: new Setting("orbitalLaunch", true),
      piscineMission: new Setting("piscineMission", true),
      rorschachMission: new Setting("rorschachMission", true),
      terminusMission: new Setting("terminusMission", true),
      umbraMission: new Setting("umbraMission", true),
      yarnMission: new Setting("yarnMission", true),
    }
  ) {
    super(id, enabled);
    this.items = items;
  }

  static validateGame(game: GamePage, settings: MissionSettings) {
    const inSettings = Object.keys(settings.items);
    // TODO: Find a better place in the game where this information is *always* available.
    const inGame = (game.space.programs ?? []).map(program => program.name);

    const missingInSettings = difference(inGame, inSettings);
    const redundantInSettings = difference(inSettings, inGame);

    for (const mission of missingInSettings) {
      cwarn(`The space mission '${mission}' is not tracked in Kitten Scientists!`);
    }
    for (const mission of redundantInSettings) {
      cwarn(`The space mission '${mission}' is not a space mission in Kitten Game!`);
    }
  }

  load(settings: MissionSettings) {
    this.enabled = settings.enabled;

    for (const [name, item] of objectEntries(settings.items)) {
      this.items[name].enabled = item.enabled;
    }
  }

  static toLegacyOptions(settings: MissionSettings, subject: KittenStorageType) {
    subject.items["toggle-missions"] = settings.enabled;

    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-mission-${name}` as const] = item.enabled;
    }
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new MissionSettings();
    options.enabled = subject.items["toggle-missions"] ?? options.enabled;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-mission-${name}` as const] ?? item.enabled;
    }

    return options;
  }
}
