import { isNil, type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import type { GamePage } from "../types/game.js";
import { PolicySettings } from "./PolicySettings.js";
import { Setting } from "./Settings.js";
import { TechSettings } from "./TechSettings.js";

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
    observe = new Setting(),
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
