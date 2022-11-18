import { isNil, Maybe } from "../tools/Maybe";
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
  observe: Setting;

  constructor(
    enabled = false,
    policies = new PolicySettings(),
    techs = new TechSettings(),
    observe = new Setting(true)
  ) {
    super(enabled);
    this.policies = policies;
    this.techs = techs;
    this.observe = observe;
  }

  static validateGame(game: GamePage, settings: ScienceSettings) {
    PolicySettings.validateGame(game, settings.policies);
    TechSettings.validateGame(game, settings.techs);
  }

  load(settings: Maybe<Partial<ScienceSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    this.policies.load(settings.policies);
    this.techs.load(settings.techs);

    this.observe.enabled = settings.observe?.enabled ?? this.observe.enabled;
  }

  static toLegacyOptions(settings: ScienceSettings, subject: LegacyStorage) {
    subject.toggles.upgrade = settings.enabled;

    PolicySettings.toLegacyOptions(settings.policies, subject);
    TechSettings.toLegacyOptions(settings.techs, subject);

    subject.items["toggle-observe"] = settings.observe.enabled;
  }

  static fromLegacyOptions(subject: LegacyStorage) {
    const options = new ScienceSettings();
    options.enabled = subject.toggles.upgrade;

    options.policies = PolicySettings.fromLegacyOptions(subject);
    options.techs = TechSettings.fromLegacyOptions(subject);

    options.observe.enabled = subject.items["toggle-observe"] ?? options.observe.enabled;

    return options;
  }
}
