import { difference } from "../tools/Array";
import { cwarn } from "../tools/Log";
import { GamePage, Missions } from "../types";
import { Setting } from "./Settings";
import { SettingsSection } from "./SettingsSection";

export class MissionSettings extends SettingsSection {
  items: {
    [item in Missions]: Setting;
  } = {
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
  };

  static validateGame(game: GamePage, settings: MissionSettings) {
    const inSettings = Object.keys(settings.items);
    // TODO: Find a better place in the game where this information is *always* available.
    const inGame = (game.space.missions ?? []).map(mission => mission.name);

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
