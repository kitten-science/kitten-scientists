import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { type Race } from "../types/index.js";
import { SettingMax, SettingTrigger } from "./Settings.js";
export declare class EmbassySetting extends SettingMax {
  #private;
  get race():
    | "zebras"
    | "dragons"
    | "griffins"
    | "nagas"
    | "leviathans"
    | "lizards"
    | "sharks"
    | "spiders";
  constructor(race: Race, enabled?: boolean);
}
export type EmbassyRaceSettings = Record<Race, SettingMax>;
export declare class EmbassySettings extends SettingTrigger {
  races: EmbassyRaceSettings;
  constructor(enabled?: boolean);
  private initRaces;
  load(settings: Maybe<Partial<EmbassySettings>>): void;
}
//# sourceMappingURL=EmbassySettings.d.ts.map
