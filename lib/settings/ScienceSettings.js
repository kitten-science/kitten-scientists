import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { PolicySettings } from "./PolicySettings.js";
import { Setting } from "./Settings.js";
import { TechSettings } from "./TechSettings.js";
export class ScienceSettings extends Setting {
  policies;
  techs;
  observe;
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
  static validateGame(game, settings) {
    PolicySettings.validateGame(game, settings.policies);
    TechSettings.validateGame(game, settings.techs);
  }
  load(settings) {
    if (isNil(settings)) {
      return;
    }
    super.load(settings);
    this.policies.load(settings.policies);
    this.techs.load(settings.techs);
    this.observe.enabled = settings.observe?.enabled ?? this.observe.enabled;
  }
}
//# sourceMappingURL=ScienceSettings.js.map
