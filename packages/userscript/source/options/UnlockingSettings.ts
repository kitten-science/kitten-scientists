import { SettingsSection } from "./SettingsSection";

export type UnlockingSettingsItem = { enabled: boolean; $enabled?: JQuery<HTMLElement> };
export class UnlockingSettings extends SettingsSection {
  items: {
    upgrades: UnlockingSettingsItem;
    techs: UnlockingSettingsItem;
    races: UnlockingSettingsItem;
    missions: UnlockingSettingsItem;
    buildings: UnlockingSettingsItem;
  } = {
    upgrades: { enabled: true },
    techs: { enabled: true },
    races: { enabled: true },
    missions: { enabled: true },
    buildings: { enabled: true },
  };
}
