import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { type Job } from "../types/index.js";
import { ElectLeaderSettings } from "./ElectLeaderSettings.js";
import { Setting, SettingMax, SettingTrigger } from "./Settings.js";
export type VillageJobSettings = Record<Job, SettingMax>;
export declare class VillageSettings extends Setting {
  jobs: VillageJobSettings;
  holdFestivals: Setting;
  hunt: SettingTrigger;
  promoteKittens: SettingTrigger;
  promoteLeader: Setting;
  electLeader: ElectLeaderSettings;
  constructor(
    enabled?: boolean,
    holdFestivals?: Setting,
    hunt?: SettingTrigger,
    promoteKittens?: SettingTrigger,
    promoteLeader?: Setting,
    electLeader?: ElectLeaderSettings,
  );
  private initJobs;
  load(settings: Maybe<Partial<VillageSettings>>): void;
}
//# sourceMappingURL=VillageSettings.d.ts.map
