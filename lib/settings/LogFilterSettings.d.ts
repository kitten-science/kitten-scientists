import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { Setting } from "./Settings.js";
export declare enum LogFilterItemVariant {
  build = "ks-activity type_ks-build",
  craft = "ks-activity type_ks-craft",
  upgrade = "ks-activity type_ks-upgrade",
  research = "ks-activity type_ks-research",
  trade = "ks-activity type_ks-trade",
  hunt = "ks-activity type_ks-hunt",
  praise = "ks-activity type_ks-praise",
  adore = "ks-activity type_ks-adore",
  transcend = "ks-activity type_ks-transcend",
  faith = "ks-activity type_ks-faith",
  accelerate = "ks-activity type_ks-accelerate",
  timeSkip = "ks-activity type_ks-timeSkip",
  festival = "ks-activity type_ks-festival",
  star = "ks-activity type_ks-star",
  distribute = "ks-activity type_ks-distribute",
  promote = "ks-activity type_ks-promote",
  misc = "ks-activity",
}
export declare const FilterItems: readonly [
  "accelerate",
  "adore",
  "build",
  "craft",
  "distribute",
  "faith",
  "festival",
  "hunt",
  "misc",
  "praise",
  "promote",
  "research",
  "star",
  "timeSkip",
  "trade",
  "transcend",
  "upgrade",
];
export type FilterItem = (typeof FilterItems)[number];
export declare class LogFilterSettingsItem extends Setting {
  #private;
  get variant(): LogFilterItemVariant;
  constructor(variant: LogFilterItemVariant);
}
export type LogFilterSettingsItems = Record<FilterItem, LogFilterSettingsItem>;
export declare class LogFilterSettings extends Setting {
  filters: LogFilterSettingsItems;
  disableKGLog: Setting;
  constructor(enabled?: boolean, disableKGLog?: Setting);
  private initFilters;
  load(settings: Maybe<Partial<LogFilterSettings>>): void;
}
//# sourceMappingURL=LogFilterSettings.d.ts.map
