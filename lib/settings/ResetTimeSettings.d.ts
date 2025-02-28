import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { TimeItemVariant } from "../types/index.js";
import { Setting, SettingThreshold } from "./Settings.js";
import type { TimeItem } from "./TimeSettings.js";
export declare class ResetTimeBuildingSetting extends SettingThreshold {
  #private;
  get building(): TimeItem;
  get variant(): TimeItemVariant;
  constructor(id: TimeItem, variant: TimeItemVariant, enabled?: boolean, threshold?: number);
}
export type ResetTimeBuildingSettings = Record<TimeItem, ResetTimeBuildingSetting>;
export declare class ResetTimeSettings extends Setting {
  readonly buildings: ResetTimeBuildingSettings;
  constructor(enabled?: boolean);
  private initBuildings;
  load(settings: Maybe<Partial<ResetTimeSettings>>): void;
}
//# sourceMappingURL=ResetTimeSettings.d.ts.map
