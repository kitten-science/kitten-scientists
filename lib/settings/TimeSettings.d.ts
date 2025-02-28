import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { type ChronoForgeUpgrade, TimeItemVariant, type VoidSpaceUpgrade } from "../types/index.js";
import { Setting, SettingTrigger, SettingTriggerMax } from "./Settings.js";
/**
 * The upgrades on the Time tab that we have options for.
 */
export type TimeItem = Exclude<ChronoForgeUpgrade | VoidSpaceUpgrade, "usedCryochambers">;
export declare class TimeSettingsItem extends SettingTriggerMax {
  #private;
  get building(): TimeItem;
  get variant(): TimeItemVariant;
  constructor(building: TimeItem, variant: TimeItemVariant, enabled?: boolean);
}
export type TimeBuildingsSettings = Record<TimeItem, TimeSettingsItem>;
export declare class TimeSettings extends SettingTrigger {
  buildings: TimeBuildingsSettings;
  fixCryochambers: Setting;
  constructor(enabled?: boolean, trigger?: number, fixCryochambers?: Setting);
  private initBuildings;
  load(settings: Maybe<Partial<TimeSettings>>): void;
}
//# sourceMappingURL=TimeSettings.d.ts.map
