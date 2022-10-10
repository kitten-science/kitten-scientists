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

  constructor(
    enabled = false,
    policies = new PolicySettings("policies"),
    techs = new TechSettings("techs")
  ) {
    super("science", enabled);
    this.policies = policies;
    this.techs = techs;
  }

  static validateGame(game: GamePage, settings: ScienceSettings) {
    PolicySettings.validateGame(game, settings.policies);
    TechSettings.validateGame(game, settings.techs);
  }

  load(settings: ScienceSettings) {
    this.enabled = settings.enabled;

    this.policies.load(settings.policies);
    this.techs.load(settings.techs);
  }

  static toLegacyOptions(settings: ScienceSettings, subject: KittenStorageType) {
    subject.toggles.upgrade = settings.enabled;

    PolicySettings.toLegacyOptions(settings.policies, subject);
    TechSettings.toLegacyOptions(settings.techs, subject);
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new ScienceSettings();
    options.enabled = subject.toggles.upgrade;

    options.policies = PolicySettings.fromLegacyOptions(subject);
    options.techs = TechSettings.fromLegacyOptions(subject);

    return options;
  }
}
