import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { type Job, type Trait } from "../types/index.js";
import { Setting, SettingOptions } from "./Settings.js";
export declare class ElectLeaderSettings extends Setting {
  readonly job: SettingOptions<Job>;
  readonly trait: SettingOptions<Trait>;
  constructor(
    enabled?: boolean,
    job?: SettingOptions<
      | "any"
      | "engineer"
      | "farmer"
      | "geologist"
      | "hunter"
      | "miner"
      | "priest"
      | "scholar"
      | "woodcutter"
    >,
    trait?: SettingOptions<
      | "engineer"
      | "manager"
      | "scientist"
      | "chemist"
      | "metallurgist"
      | "merchant"
      | "none"
      | "wise"
    >,
  );
  load(settings: Maybe<Partial<ElectLeaderSettings>>): void;
}
//# sourceMappingURL=ElectLeaderSettings.d.ts.map
