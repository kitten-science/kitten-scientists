import { PolicySettings } from "./PolicySettings";
import { SettingsSection } from "./SettingsSection";

export type UnlockItem = "buildings" | "missions" | "policies" | "races" | "techs" | "upgrades";
export type UnlockingSettingsItem =
  | { enabled: boolean; $enabled?: JQuery<HTMLElement> }
  | PolicySettings;
export class UnlockingSettings extends SettingsSection {
  items: {
    [key in UnlockItem]: UnlockingSettingsItem;
  } = {
    upgrades: { enabled: true },
    techs: { enabled: true },
    policies: new PolicySettings(),
    races: { enabled: true },
    missions: { enabled: true },
    buildings: { enabled: true },
  };
}
