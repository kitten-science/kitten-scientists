import { isNil, Maybe } from "../tools/Maybe";
import { GamePage } from "../types";
import { PolicySettings } from "./PolicySettings";
import { Setting } from "./Settings";
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
}
