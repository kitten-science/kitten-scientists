import { SettingsSection } from "./SettingsSection";

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

export type FilterSettingsItem = { enabled: boolean; $enabled?: JQuery<HTMLElement> } & {
  variant: FilterItemVariant;
};
export class FilterSettings extends SettingsSection {
  items: {
    [item in FilterItem]: FilterSettingsItem;
  } = {
    buildFilter: { enabled: false, variant: FilterItemVariant.Build },
    craftFilter: { enabled: false, variant: FilterItemVariant.Craft },
    upgradeFilter: { enabled: false, variant: FilterItemVariant.Upgrade },
    researchFilter: { enabled: false, variant: FilterItemVariant.Research },
    tradeFilter: { enabled: false, variant: FilterItemVariant.Trade },
    huntFilter: { enabled: false, variant: FilterItemVariant.Hunt },
    praiseFilter: { enabled: false, variant: FilterItemVariant.Praise },
    adoreFilter: { enabled: false, variant: FilterItemVariant.Adore },
    transcendFilter: { enabled: false, variant: FilterItemVariant.Transcend },
    faithFilter: { enabled: false, variant: FilterItemVariant.Faith },
    accelerateFilter: { enabled: false, variant: FilterItemVariant.Accelerate },
    timeSkipFilter: { enabled: false, variant: FilterItemVariant.TimeSkip },
    festivalFilter: { enabled: false, variant: FilterItemVariant.Festival },
    starFilter: { enabled: false, variant: FilterItemVariant.Star },
    distributeFilter: { enabled: false, variant: FilterItemVariant.Distribute },
    promoteFilter: { enabled: false, variant: FilterItemVariant.Promote },
    miscFilter: { enabled: false, variant: FilterItemVariant.Misc },
  };
}
