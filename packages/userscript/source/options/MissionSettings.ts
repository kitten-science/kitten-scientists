import { difference } from "../tools/Array";
import { cwarn } from "../tools/Log";
import { GamePage, Missions } from "../types";
import { Setting } from "./Settings";
import { SettingsSection } from "./SettingsSection";

export class MissionSettings extends SettingsSection {
  items: {
    [item in Missions]: Setting;
  } = {
    centaurusSystemMission: new Setting(true),
    charonMission: new Setting(true),
    duneMission: new Setting(true),
    furthestRingMission: new Setting(true),
    heliosMission: new Setting(true),
    kairoMission: new Setting(true),
    moonMission: new Setting(true),
    orbitalLaunch: new Setting(true),
    piscineMission: new Setting(true),
    rorschachMission: new Setting(true),
    terminusMission: new Setting(true),
    umbraMission: new Setting(true),
    yarnMission: new Setting(true),
  };

  static validateGame(game: GamePage, settings: MissionSettings) {
    const inSettings = Object.keys(settings.items);
    const inGame = game.space.missions.map(mission => mission.name);

    const missingInSettings = difference(inGame, inSettings);
    const redundantInSettings = difference(inSettings, inGame);

    for (const mission of missingInSettings) {
      cwarn(`The space mission '${mission}' is not tracked in Kitten Scientists!`);
    }
    for (const mission of redundantInSettings) {
      cwarn(`The space mission '${mission}' is not a space mission in Kitten Game!`);
    }
  }
}
