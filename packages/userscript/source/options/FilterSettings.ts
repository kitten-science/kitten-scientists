import { objectEntries } from "../tools/Entries";
import { Setting } from "./Settings";
import { SettingsSection } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

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
    super();
    this.variant = variant;
  }
}

export type FilterSettingsItems = {
  [item in FilterItem]: FilterSettingsItem;
};

export class FilterSettings extends SettingsSection {
  items: FilterSettingsItems;

  constructor(
    enabled = false,
    items: FilterSettingsItems = {
      buildFilter: new FilterSettingsItem(FilterItemVariant.Build),
      craftFilter: new FilterSettingsItem(FilterItemVariant.Craft),
      upgradeFilter: new FilterSettingsItem(FilterItemVariant.Upgrade),
      researchFilter: new FilterSettingsItem(FilterItemVariant.Research),
      tradeFilter: new FilterSettingsItem(FilterItemVariant.Trade),
      huntFilter: new FilterSettingsItem(FilterItemVariant.Hunt),
      praiseFilter: new FilterSettingsItem(FilterItemVariant.Praise),
      adoreFilter: new FilterSettingsItem(FilterItemVariant.Adore),
      transcendFilter: new FilterSettingsItem(FilterItemVariant.Transcend),
      faithFilter: new FilterSettingsItem(FilterItemVariant.Faith),
      accelerateFilter: new FilterSettingsItem(FilterItemVariant.Accelerate),
      timeSkipFilter: new FilterSettingsItem(FilterItemVariant.TimeSkip),
      festivalFilter: new FilterSettingsItem(FilterItemVariant.Festival),
      starFilter: new FilterSettingsItem(FilterItemVariant.Star),
      distributeFilter: new FilterSettingsItem(FilterItemVariant.Distribute),
      promoteFilter: new FilterSettingsItem(FilterItemVariant.Promote),
      miscFilter: new FilterSettingsItem(FilterItemVariant.Misc),
    }
  ) {
    super(enabled);
    this.items = items;
  }

  load(settings: FilterSettings) {
    this.enabled = settings.enabled;

    for (const [name, item] of objectEntries(settings.items)) {
      this.items[name].enabled = item.enabled;
    }
  }

  static toLegacyOptions(settings: FilterSettings, subject: KittenStorageType) {
    subject.toggles.filter = settings.enabled;

    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
    }
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new FilterSettings();
    options.enabled = subject.toggles.filter;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
    }
    return options;
  }
}
