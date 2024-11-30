import { Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Setting } from "./Settings.js";

export enum LogFilterItemVariant {
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

export const FilterItems = [
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
] as const;
export type FilterItem = (typeof FilterItems)[number];

export class LogFilterSettingsItem extends Setting {
  readonly #variant: LogFilterItemVariant;

  get variant() {
    return this.#variant;
  }

  constructor(variant: LogFilterItemVariant) {
    super(true);
    this.#variant = variant;
  }
}

export type LogFilterSettingsItems = Record<FilterItem, LogFilterSettingsItem>;

export class LogFilterSettings extends Setting {
  filters: LogFilterSettingsItems;
  disableKGLog: Setting;

  constructor(enabled = false, disableKGLog = new Setting(true)) {
    super(enabled);
    this.filters = this.initFilters();
    this.disableKGLog = disableKGLog;
  }

  private initFilters(): LogFilterSettingsItems {
    const items = {} as LogFilterSettingsItems;
    FilterItems.forEach(item => {
      items[item] = new LogFilterSettingsItem(LogFilterItemVariant[item]);
    });
    return items;
  }

  load(settings: Maybe<Partial<LogFilterSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.filters, settings.filters, (filter, item) => {
      filter.enabled = item?.enabled ?? filter.enabled;
    });
    this.disableKGLog.enabled = settings.disableKGLog?.enabled ?? this.disableKGLog.enabled;
  }
}
