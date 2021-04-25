export type UnlockingSettingsItem = { enabled: boolean };
export class UnlockingSettings {
  enabled = false;

  items: {
    upgrades: { enabled: boolean };
    techs: { enabled: boolean };
    races: { enabled: boolean };
    missions: { enabled: boolean };
    buildings: { enabled: boolean };
  } = {
    upgrades: { enabled: true },
    techs: { enabled: true },
    races: { enabled: true },
    missions: { enabled: true },
    buildings: { enabled: true },
  };
}
