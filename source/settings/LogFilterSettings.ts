import { isNil, type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Setting } from "./Settings.js";

export enum LogFilterItemVariant {
  accelerate = "ks-activity type_ks-accelerate",
  adore = "ks-activity type_ks-adore",
  build = "ks-activity type_ks-build",
  craft = "ks-activity type_ks-craft",
  distribute = "ks-activity type_ks-distribute",
  faith = "ks-activity type_ks-faith",
  festival = "ks-activity type_ks-festival",
  hunt = "ks-activity type_ks-hunt",
  misc = "ks-activity",
  praise = "ks-activity type_ks-praise",
  promote = "ks-activity type_ks-promote",
  research = "ks-activity type_ks-research",
  star = "ks-activity type_ks-star",
  timeSkip = "ks-activity type_ks-timeSkip",
  trade = "ks-activity type_ks-trade",
  transcend = "ks-activity type_ks-transcend",
  upgrade = "ks-activity type_ks-upgrade",
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

export const FilterItemsGame = [
  "alicornCorruption",
  "alicornRift",
  "alicornSacrifice",
  "astronomicalEvent",
  "blackcoin",
  "craft",
  "elders",
  "faith",
  "festival",
  "hunt",
  "ivoryMeteor",
  "meteor",
  "tcRefine",
  "tcShatter",
  "trade",
  "unicornRift",
  "unicornSacrifice",
  "workshopAutomation",
] as const;
export type FilterItemGame = (typeof FilterItemsGame)[number];

export class LogFilterSettingsItem extends Setting {
  readonly #variant: LogFilterItemVariant | null;

  get variant() {
    return this.#variant;
  }

  constructor(variant: LogFilterItemVariant | null) {
    super(true);
    this.#variant = variant;
  }
}

export type LogFilterSettingsItems = Record<FilterItem, LogFilterSettingsItem>;
export type LogFilterSettingsItemsGame = Record<FilterItemGame, LogFilterSettingsItem>;

export class LogFilterSettings extends Setting {
  filters: LogFilterSettingsItems;
  filtersGame: LogFilterSettingsItemsGame;

  constructor(enabled = false) {
    super(enabled);

    this.filters = {} as LogFilterSettingsItems;
    for (const item of FilterItems) {
      this.filters[item] = new LogFilterSettingsItem(LogFilterItemVariant[item]);
    }
    this.filtersGame = {} as LogFilterSettingsItemsGame;
    for (const item of FilterItemsGame) {
      this.filtersGame[item] = new LogFilterSettingsItem(null);
    }
  }

  load(settings: Maybe<Partial<LogFilterSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.filters, settings.filters, (filter, item) => {
      filter.enabled = item?.enabled ?? filter.enabled;
    });
    consumeEntriesPedantic(this.filtersGame, settings.filtersGame, (filter, item) => {
      filter.enabled = item?.enabled ?? filter.enabled;
    });
  }
}
