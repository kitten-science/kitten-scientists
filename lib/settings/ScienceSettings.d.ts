import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import type { Game } from "../types/index.js";
import { PolicySettings } from "./PolicySettings.js";
import { Setting } from "./Settings.js";
import { TechSettings } from "./TechSettings.js";
export type ScienceItem = "policies" | "techs";
export type ScienceSettingsItem = TechSettings | PolicySettings;
export declare class ScienceSettings extends Setting {
  policies: PolicySettings;
  techs: TechSettings;
  observe: Setting;
  constructor(
    enabled?: boolean,
    policies?: PolicySettings,
    techs?: TechSettings,
    observe?: Setting,
  );
  static validateGame(game: Game, settings: ScienceSettings): void;
  load(settings: Maybe<Partial<ScienceSettings>>): void;
}
//# sourceMappingURL=ScienceSettings.d.ts.map
