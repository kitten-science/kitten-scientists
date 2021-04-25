export type FilterSettingsItem = { enabled: boolean };
export class FilterSettings {
  enabled = false;

  items: {
    buildFilter: FilterSettingsItem;
    craftFilter: FilterSettingsItem;
    upgradeFilter: FilterSettingsItem;
    researchFilter: FilterSettingsItem;
    tradeFilter: FilterSettingsItem;
    huntFilter: FilterSettingsItem;
    praiseFilter: FilterSettingsItem;
    adoreFilter: FilterSettingsItem;
    transcendFilter: FilterSettingsItem;
    faithFilter: FilterSettingsItem;
    accelerateFilter: FilterSettingsItem;
    timeSkipFilter: FilterSettingsItem;
    festivalFilter: FilterSettingsItem;
    starFilter: FilterSettingsItem;
    distributeFilter: FilterSettingsItem;
    promoteFilter: FilterSettingsItem;
    miscFilter: FilterSettingsItem;
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
