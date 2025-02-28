import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { TimeSkipHeatSettings } from "../settings/TimeSkipHeatSettings.js";
import { type Cycle, type Season } from "../types/index.js";
import { Setting, SettingThresholdMax } from "./Settings.js";
export type CyclesSettings = Record<Cycle, Setting>;
export type SeasonsSettings = Record<Season, Setting>;
export declare class TimeSkipSettings extends SettingThresholdMax {
  readonly cycles: CyclesSettings;
  readonly seasons: SeasonsSettings;
  readonly activeHeatTransfer: TimeSkipHeatSettings;
  readonly ignoreOverheat: Setting;
  constructor(ignoreOverheat?: Setting, activeHeatTransfer?: TimeSkipHeatSettings);
  private initCycles;
  private initSeason;
  load(settings: Maybe<Partial<TimeSkipSettings>>): void;
}
//# sourceMappingURL=TimeSkipSettings.d.ts.map
