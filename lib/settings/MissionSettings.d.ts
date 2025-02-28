import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { type Game, type Mission } from "../types/index.js";
import { Setting } from "./Settings.js";
export declare class MissionSetting extends Setting {
  #private;
  get mission():
    | "centaurusSystemMission"
    | "charonMission"
    | "duneMission"
    | "furthestRingMission"
    | "heliosMission"
    | "kairoMission"
    | "moonMission"
    | "orbitalLaunch"
    | "piscineMission"
    | "rorschachMission"
    | "terminusMission"
    | "umbraMission"
    | "yarnMission";
  constructor(mission: Mission, enabled?: boolean);
}
export type MissionMissionSettings = Record<Mission, MissionSetting>;
export declare class MissionSettings extends Setting {
  missions: MissionMissionSettings;
  constructor(enabled?: boolean);
  private initMissions;
  static validateGame(game: Game, settings: MissionSettings): void;
  load(settings: Maybe<Partial<MissionSettings>>): void;
}
//# sourceMappingURL=MissionSettings.d.ts.map
