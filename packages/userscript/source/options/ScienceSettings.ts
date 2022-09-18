import { objectEntries } from "../tools/Entries";
import { GamePage, Policy, Technology } from "../types";
import { PolicySettings } from "./PolicySettings";
import { SettingsSection } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";
import { TechSettings } from "./TechSettings";

export type ScienceItem = "policies" | "techs";
export type ScienceSettingsItem = TechSettings | PolicySettings;

export class ScienceSettings extends SettingsSection {
  items: {
    [key in ScienceItem]: ScienceSettingsItem;
  } = {
    policies: new PolicySettings(),
    techs: new TechSettings(),
  };

  static validateGame(game: GamePage, settings: ScienceSettings) {
    PolicySettings.validateGame(game, settings.items.policies as PolicySettings);
    TechSettings.validateGame(game, settings.items.techs as TechSettings);
  }

  static toLegacyOptions(settings: ScienceSettings, subject: KittenStorageType) {
    subject.toggles.upgrade = settings.enabled;

    subject.items["toggle-policies"] = settings.items.policies.enabled;
    subject.items["toggle-techs"] = settings.items.techs.enabled;

    for (const [name, item] of objectEntries(settings.items.policies.items)) {
      subject.items[`toggle-policy-${name as Policy}` as const] = item.enabled;
    }
    for (const [name, item] of objectEntries(settings.items.techs.items)) {
      subject.items[`toggle-tech-${name as Technology}` as const] = item.enabled;
    }
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new ScienceSettings();
    options.enabled = subject.toggles.upgrade;

    options.items.policies.enabled =
      subject.items["toggle-policies"] ?? options.items.policies.enabled;
    options.items.techs.enabled = subject.items["toggle-techs"] ?? options.items.techs.enabled;

    for (const [name, item] of objectEntries((options.items.policies as PolicySettings).items)) {
      item.enabled = subject.items[`toggle-policy-${name}` as const] ?? item.enabled;
    }
    for (const [name, item] of objectEntries((options.items.techs as TechSettings).items)) {
      item.enabled = subject.items[`toggle-tech-${name}` as const] ?? item.enabled;
    }

    return options;
  }
}
