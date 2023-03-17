import { difference } from "../tools/Array";
import { consumeEntriesPedantic } from "../tools/Entries";
import { cwarn } from "../tools/Log";
import { isNil, Maybe } from "../tools/Maybe";
import { GamePage, Missions } from "../types";
import { Setting } from "./Settings";

export class MissionSetting extends Setting {
  readonly #mission: Missions;

  get mission() {
    return this.#mission;
  }

  constructor(mission: Missions, enabled = false) {
    super(enabled);
    this.#mission = mission;
  }
}

export type MissionMissionSettings = Record<Missions, MissionSetting>;

export class MissionSettings extends Setting {
  missions: MissionMissionSettings;

  get missionsList(): Array<MissionSetting> {
    return [
      this.missions.orbitalLaunch,
      this.missions.moonMission,
      this.missions.duneMission,
      this.missions.piscineMission,
      this.missions.heliosMission,
      this.missions.terminusMission,
      this.missions.kairoMission,
      this.missions.rorschachMission,
      this.missions.yarnMission,
      this.missions.umbraMission,
      this.missions.charonMission,
      this.missions.centaurusSystemMission,
      this.missions.furthestRingMission,
    ];
  }

  constructor(
    enabled = false,
    missions: MissionMissionSettings = {
      centaurusSystemMission: new MissionSetting("centaurusSystemMission", true),
      charonMission: new MissionSetting("charonMission", true),
      duneMission: new MissionSetting("duneMission", true),
      furthestRingMission: new MissionSetting("furthestRingMission", true),
      heliosMission: new MissionSetting("heliosMission", true),
      kairoMission: new MissionSetting("kairoMission", true),
      moonMission: new MissionSetting("moonMission", true),
      orbitalLaunch: new MissionSetting("orbitalLaunch", true),
      piscineMission: new MissionSetting("piscineMission", true),
      rorschachMission: new MissionSetting("rorschachMission", true),
      terminusMission: new MissionSetting("terminusMission", true),
      umbraMission: new MissionSetting("umbraMission", true),
      yarnMission: new MissionSetting("yarnMission", true),
    }
  ) {
    super(enabled);
    this.missions = missions;
  }

  static validateGame(game: GamePage, settings: MissionSettings) {
    const inSettings = Object.keys(settings.missions);
    // TODO: Find a better place in the game where this information is *always* available.
    const inGame = (game.space.programs ?? []).map(program => program.name);

    const missingInSettings = difference(inGame, inSettings);
    const redundantInSettings = difference(inSettings, inGame);

    for (const mission of missingInSettings) {
      cwarn(`The space mission '${mission}' is not tracked in Kitten Scientists!`);
    }
    for (const mission of redundantInSettings) {
      cwarn(`The space mission '${mission}' is not a space mission in Kittens Game!`);
    }
  }

  load(settings: Maybe<Partial<MissionSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.missions, settings.missions, (mission, item) => {
      mission.enabled = item?.enabled ?? mission.enabled;
    });
  }
}
