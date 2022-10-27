import { GamePage } from "../types";
import { PolicySettings } from "./PolicySettings";
import { Setting } from "./Settings";
import { LegacyStorage } from "./SettingsStorage";
import { TechSettings } from "./TechSettings";

export type ScienceItem = "policies" | "techs";
export type ScienceSettingsItem = TechSettings | PolicySettings;

export class ScienceSettings extends Setting {
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

    this.policies.load(settings.policies);
    this.techs.load(settings.techs);
  }

  static toLegacyOptions(settings: ScienceSettings, subject: LegacyStorage) {
    subject.toggles.upgrade = settings.enabled;

    PolicySettings.toLegacyOptions(settings.policies, subject);
    TechSettings.toLegacyOptions(settings.techs, subject);
  }

  static fromLegacyOptions(subject: LegacyStorage) {
    const options = new ScienceSettings();
    options.enabled = subject.toggles.upgrade;

    options.policies = PolicySettings.fromLegacyOptions(subject);
    options.techs = TechSettings.fromLegacyOptions(subject);

    return options;
  }
}
