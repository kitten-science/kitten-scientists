import { FilterItemVariant } from "./OptionsLegacy";
import { SettingsSection } from "./SettingsSection";

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
