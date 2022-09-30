import { objectEntries } from "../tools/Entries";
import { GamePage } from "../types";
import { PolicySettings } from "./PolicySettings";
import { SettingsSection } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";
import { TechSettings } from "./TechSettings";

export type ScienceItem = "policies" | "techs";
export type ScienceSettingsItem = TechSettings | PolicySettings;

export class ScienceSettings extends SettingsSection {
  policies: PolicySettings;
  techs: TechSettings;

  constructor(enabled = false, policies = new PolicySettings(), techs = new TechSettings()) {
    super(enabled);
    this.policies = policies;
    this.techs = techs;
  }

  static validateGame(game: GamePage, settings: ScienceSettings) {
    PolicySettings.validateGame(game, settings.policies);
    TechSettings.validateGame(game, settings.techs);
  }

  load(settings: ScienceSettings) {
    this.enabled = settings.enabled;

    this.policies.enabled = settings.policies.enabled;
    this.techs.enabled = settings.techs.enabled;

    for (const [name, item] of objectEntries(settings.policies.items)) {
      this.policies.items[name].enabled = item.enabled;
    }
    for (const [name, item] of objectEntries(settings.techs.items)) {
      this.techs.items[name].enabled = item.enabled;
    }
  }

  static toLegacyOptions(settings: ScienceSettings, subject: KittenStorageType) {
    subject.toggles.upgrade = settings.enabled;

    subject.items["toggle-policies"] = settings.policies.enabled;
    subject.items["toggle-techs"] = settings.techs.enabled;

    for (const [name, item] of objectEntries(settings.policies.items)) {
      subject.items[`toggle-policy-${name}` as const] = item.enabled;
    }
    for (const [name, item] of objectEntries(settings.techs.items)) {
      subject.items[`toggle-tech-${name}` as const] = item.enabled;
    }
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new ScienceSettings();
    options.enabled = subject.toggles.upgrade;

    options.policies.enabled = subject.items["toggle-policies"] ?? options.policies.enabled;
    options.techs.enabled = subject.items["toggle-techs"] ?? options.techs.enabled;

    for (const [name, item] of objectEntries(options.policies.items)) {
      item.enabled = subject.items[`toggle-policy-${name}` as const] ?? item.enabled;
    }
    for (const [name, item] of objectEntries(options.techs.items)) {
      item.enabled = subject.items[`toggle-tech-${name}` as const] ?? item.enabled;
    }

    return options;
  }
}
