import { SettingsSection } from "./SettingsSection";

export type UnlockingSettingsItem = { enabled: boolean; $enabled?: JQuery<HTMLElement> };
export class UnlockingSettings extends SettingsSection {
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
