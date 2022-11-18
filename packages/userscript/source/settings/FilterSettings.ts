import { consumeEntriesPedantic, objectEntries } from "../tools/Entries";
import { isNil, Maybe } from "../tools/Maybe";
import { Setting } from "./Settings";
import { LegacyStorage } from "./SettingsStorage";

export enum FilterItemVariant {
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

export class FilterSettingsItem extends Setting {
  variant: FilterItemVariant;

  constructor(variant: FilterItemVariant) {
    super(true);
    this.variant = variant;
  }
}

export type FilterSettingsItems = {
  build: FilterSettingsItem;
  craft: FilterSettingsItem;
  upgrade: FilterSettingsItem;
  research: FilterSettingsItem;
  trade: FilterSettingsItem;
  hunt: FilterSettingsItem;
  praise: FilterSettingsItem;
  adore: FilterSettingsItem;
  transcend: FilterSettingsItem;
  faith: FilterSettingsItem;
  accelerate: FilterSettingsItem;
  timeSkip: FilterSettingsItem;
  festival: FilterSettingsItem;
  star: FilterSettingsItem;
  distribute: FilterSettingsItem;
  promote: FilterSettingsItem;
  misc: FilterSettingsItem;
};

export class FilterSettings extends Setting {
  filters: FilterSettingsItems;

  constructor(
    enabled = false,
    filters: FilterSettingsItems = {
      build: new FilterSettingsItem(FilterItemVariant.Build),
      craft: new FilterSettingsItem(FilterItemVariant.Craft),
      upgrade: new FilterSettingsItem(FilterItemVariant.Upgrade),
      research: new FilterSettingsItem(FilterItemVariant.Research),
      trade: new FilterSettingsItem(FilterItemVariant.Trade),
      hunt: new FilterSettingsItem(FilterItemVariant.Hunt),
      praise: new FilterSettingsItem(FilterItemVariant.Praise),
      adore: new FilterSettingsItem(FilterItemVariant.Adore),
      transcend: new FilterSettingsItem(FilterItemVariant.Transcend),
      faith: new FilterSettingsItem(FilterItemVariant.Faith),
      accelerate: new FilterSettingsItem(FilterItemVariant.Accelerate),
      timeSkip: new FilterSettingsItem(FilterItemVariant.TimeSkip),
      festival: new FilterSettingsItem(FilterItemVariant.Festival),
      star: new FilterSettingsItem(FilterItemVariant.Star),
      distribute: new FilterSettingsItem(FilterItemVariant.Distribute),
      promote: new FilterSettingsItem(FilterItemVariant.Promote),
      misc: new FilterSettingsItem(FilterItemVariant.Misc),
    }
  ) {
    super(enabled);
    this.filters = filters;
  }

  load(settings: Maybe<Partial<FilterSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.filters, settings.filters, (filter, item) => {
      filter.enabled = item?.enabled ?? filter.enabled;
    });
  }

  static toLegacyOptions(settings: FilterSettings, subject: LegacyStorage) {
    subject.toggles.filter = settings.enabled;

    for (const [name, item] of objectEntries(settings.filters)) {
      subject.items[`toggle-${name}Filter` as const] = item.enabled;
    }
  }

  static fromLegacyOptions(subject: LegacyStorage) {
    const options = new FilterSettings();
    options.enabled = subject.toggles.filter;

    for (const [name, item] of objectEntries(options.filters)) {
      item.enabled = subject.items[`toggle-${name}Filter` as const] ?? item.enabled;
    }
    return options;
  }
}
