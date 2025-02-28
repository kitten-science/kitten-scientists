import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { ResetSettings } from "./ResetSettings.js";
import { Setting, SettingTrigger } from "./Settings.js";
import { TimeSkipSettings } from "./TimeSkipSettings.js";
export type CycleIndices = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type TimeControlItem = "accelerateTime" | "reset" | "timeSkip";
export declare class TimeControlSettings extends Setting {
  accelerateTime: SettingTrigger;
  timeSkip: TimeSkipSettings;
  reset: ResetSettings;
  constructor(
    enabled?: boolean,
    accelerateTime?: SettingTrigger,
    reset?: ResetSettings,
    timeSkip?: TimeSkipSettings,
  );
  load(settings: Maybe<Partial<TimeControlSettings>>): void;
}
//# sourceMappingURL=TimeControlSettings.d.ts.map
