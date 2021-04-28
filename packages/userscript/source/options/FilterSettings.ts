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

export type FilterSettingsItem = { enabled: boolean; $enabled?: JQuery<HTMLElement> };
export class FilterSettings extends SettingsSection {
  items: {
    [item in FilterItem]: FilterSettingsItem;
  } = {
    buildFilter: { enabled: false },
    craftFilter: { enabled: false },
    upgradeFilter: { enabled: false },
    researchFilter: { enabled: false },
    tradeFilter: { enabled: false },
    huntFilter: { enabled: false },
    praiseFilter: { enabled: false },
    adoreFilter: { enabled: false },
    transcendFilter: { enabled: false },
    faithFilter: { enabled: false },
    accelerateFilter: { enabled: false },
    timeSkipFilter: { enabled: false },
    festivalFilter: { enabled: false },
    starFilter: { enabled: false },
    distributeFilter: { enabled: false },
    promoteFilter: { enabled: false },
    miscFilter: { enabled: false },
  };
}
