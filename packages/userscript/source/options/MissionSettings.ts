import { cwarn } from "../tools/Log";
import { GamePage, Missions } from "../types";
import { difference, SettingsSection, SettingToggle } from "./SettingsSection";

export type MissionSettingsItem = SettingToggle;
export class MissionSettings extends SettingsSection {
  items: {
    [item in Missions]: MissionSettingsItem;
  } = {
    centaurusSystemMission: { enabled: true },
    charonMission: { enabled: true },
    duneMission: { enabled: true },
    furthestRingMission: { enabled: true },
    heliosMission: { enabled: true },
    kairoMission: { enabled: true },
    moonMission: { enabled: true },
    orbitalLaunch: { enabled: true },
    piscineMission: { enabled: true },
    rorschachMission: { enabled: true },
    terminusMission: { enabled: true },
    umbraMission: { enabled: true },
    yarnMission: { enabled: true },
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
