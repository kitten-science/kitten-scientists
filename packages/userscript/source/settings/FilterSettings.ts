import { objectEntries } from "../tools/Entries";
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

  constructor(id: string, variant: FilterItemVariant) {
    super(true);
    this.variant = variant;
  }
}

export type FilterSettingsItems = {
  [item in FilterItem]: FilterSettingsItem;
};

export class FilterSettings extends Setting {
  filters: FilterSettingsItems;

  constructor(
    enabled = false,
    filters: FilterSettingsItems = {
      buildFilter: new FilterSettingsItem("buildFilter", FilterItemVariant.Build),
      craftFilter: new FilterSettingsItem("craftFilter", FilterItemVariant.Craft),
      upgradeFilter: new FilterSettingsItem("upgradeFilter", FilterItemVariant.Upgrade),
      researchFilter: new FilterSettingsItem("researchFilter", FilterItemVariant.Research),
      tradeFilter: new FilterSettingsItem("tradeFilter", FilterItemVariant.Trade),
      huntFilter: new FilterSettingsItem("huntFilter", FilterItemVariant.Hunt),
      praiseFilter: new FilterSettingsItem("praiseFilter", FilterItemVariant.Praise),
      adoreFilter: new FilterSettingsItem("adoreFilter", FilterItemVariant.Adore),
      transcendFilter: new FilterSettingsItem("transcendFilter", FilterItemVariant.Transcend),
      faithFilter: new FilterSettingsItem("faithFilter", FilterItemVariant.Faith),
      accelerateFilter: new FilterSettingsItem("accelerateFilter", FilterItemVariant.Accelerate),
      timeSkipFilter: new FilterSettingsItem("timeSkipFilter", FilterItemVariant.TimeSkip),
      festivalFilter: new FilterSettingsItem("festivalFilter", FilterItemVariant.Festival),
      starFilter: new FilterSettingsItem("starFilter", FilterItemVariant.Star),
      distributeFilter: new FilterSettingsItem("distributeFilter", FilterItemVariant.Distribute),
      promoteFilter: new FilterSettingsItem("promoteFilter", FilterItemVariant.Promote),
      miscFilter: new FilterSettingsItem("miscFilter", FilterItemVariant.Misc),
    }
  ) {
    super(enabled);
    this.filters = filters;
  }

  load(settings: FilterSettings) {
    this.enabled = settings.enabled;

    for (const [name, item] of objectEntries(settings.filters)) {
      this.filters[name].enabled = item.enabled;
    }
  }

  static toLegacyOptions(settings: FilterSettings, subject: LegacyStorage) {
    subject.toggles.filter = settings.enabled;

    for (const [name, item] of objectEntries(settings.filters)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
    }
  }

  static fromLegacyOptions(subject: LegacyStorage) {
    const options = new FilterSettings();
    options.enabled = subject.toggles.filter;

    for (const [name, item] of objectEntries(options.filters)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
    }
    return options;
  }
}
