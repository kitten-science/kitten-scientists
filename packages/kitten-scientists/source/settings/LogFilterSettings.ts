import { Maybe, isNil } from "@oliversalzburg/js-utils/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Setting } from "./Settings.js";

export enum LogFilterItemVariant {
  Build = "ks-activity type_ks-build",
  Craft = "ks-activity type_ks-craft",
  Upgrade = "ks-activity type_ks-upgrade",
  Research = "ks-activity type_ks-research",
  Trade = "ks-activity type_ks-trade",
  Hunt = "ks-activity type_ks-hunt",
  Praise = "ks-activity type_ks-praise",
  Adore = "ks-activity type_ks-adore",
  Transcend = "ks-activity type_ks-transcend",
  Faith = "ks-activity type_ks-faith",
  Accelerate = "ks-activity type_ks-accelerate",
  TimeSkip = "ks-activity type_ks-timeSkip",
  Festival = "ks-activity type_ks-festival",
  Star = "ks-activity type_ks-star",
  Distribute = "ks-activity type_ks-distribute",
  Promote = "ks-activity type_ks-promote",
  Misc = "ks-activity",
}

export type FilterItem =
  | "accelerateFilter"
  | "adoreFilter"
  | "buildFilter"
  | "craftFilter"
  | "distributeFilter"
  | "faithFilter"
  | "festivalFilter"
  | "huntFilter"
  | "miscFilter"
  | "praiseFilter"
  | "promoteFilter"
  | "researchFilter"
  | "starFilter"
  | "timeSkipFilter"
  | "tradeFilter"
  | "transcendFilter"
  | "upgradeFilter";

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

export type LogFilterSettingsItems = {
  build: LogFilterSettingsItem;
  craft: LogFilterSettingsItem;
  upgrade: LogFilterSettingsItem;
  research: LogFilterSettingsItem;
  trade: LogFilterSettingsItem;
  hunt: LogFilterSettingsItem;
  praise: LogFilterSettingsItem;
  adore: LogFilterSettingsItem;
  transcend: LogFilterSettingsItem;
  faith: LogFilterSettingsItem;
  accelerate: LogFilterSettingsItem;
  timeSkip: LogFilterSettingsItem;
  festival: LogFilterSettingsItem;
  star: LogFilterSettingsItem;
  distribute: LogFilterSettingsItem;
  promote: LogFilterSettingsItem;
  misc: LogFilterSettingsItem;
};

export class LogFilterSettings extends Setting {
  filters: LogFilterSettingsItems;
  disableKGLog: Setting;

  constructor(
    enabled = false,
    filters: LogFilterSettingsItems = {
      build: new LogFilterSettingsItem(LogFilterItemVariant.Build),
      craft: new LogFilterSettingsItem(LogFilterItemVariant.Craft),
      upgrade: new LogFilterSettingsItem(LogFilterItemVariant.Upgrade),
      research: new LogFilterSettingsItem(LogFilterItemVariant.Research),
      trade: new LogFilterSettingsItem(LogFilterItemVariant.Trade),
      hunt: new LogFilterSettingsItem(LogFilterItemVariant.Hunt),
      praise: new LogFilterSettingsItem(LogFilterItemVariant.Praise),
      adore: new LogFilterSettingsItem(LogFilterItemVariant.Adore),
      transcend: new LogFilterSettingsItem(LogFilterItemVariant.Transcend),
      faith: new LogFilterSettingsItem(LogFilterItemVariant.Faith),
      accelerate: new LogFilterSettingsItem(LogFilterItemVariant.Accelerate),
      timeSkip: new LogFilterSettingsItem(LogFilterItemVariant.TimeSkip),
      festival: new LogFilterSettingsItem(LogFilterItemVariant.Festival),
      star: new LogFilterSettingsItem(LogFilterItemVariant.Star),
      distribute: new LogFilterSettingsItem(LogFilterItemVariant.Distribute),
      promote: new LogFilterSettingsItem(LogFilterItemVariant.Promote),
      misc: new LogFilterSettingsItem(LogFilterItemVariant.Misc),
    },
    disableKGLog = new Setting(false),
  ) {
    super(enabled);
    this.filters = filters;
    this.disableKGLog = disableKGLog;
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
