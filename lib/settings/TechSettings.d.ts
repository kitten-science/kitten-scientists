import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { type Game, type Technology } from "../types/index.js";
import { SettingTrigger } from "./Settings.js";
export declare class TechSetting extends SettingTrigger {
  #private;
  get tech():
    | "steel"
    | "thorium"
    | "antimatter"
    | "hydroponics"
    | "acoustics"
    | "advExogeology"
    | "agriculture"
    | "ai"
    | "animal"
    | "archeology"
    | "archery"
    | "architecture"
    | "artificialGravity"
    | "astronomy"
    | "biochemistry"
    | "biology"
    | "blackchain"
    | "calendar"
    | "chemistry"
    | "chronophysics"
    | "civil"
    | "combustion"
    | "construction"
    | "cryptotheology"
    | "currency"
    | "dimensionalPhysics"
    | "drama"
    | "ecology"
    | "electricity"
    | "electronics"
    | "engineering"
    | "exogeology"
    | "exogeophysics"
    | "genetics"
    | "industrialization"
    | "machinery"
    | "math"
    | "mechanization"
    | "metal"
    | "metalurgy"
    | "metaphysics"
    | "mining"
    | "nanotechnology"
    | "navigation"
    | "nuclearFission"
    | "oilProcessing"
    | "orbitalEngineering"
    | "paradoxalKnowledge"
    | "particlePhysics"
    | "philosophy"
    | "physics"
    | "quantumCryptography"
    | "robotics"
    | "rocketry"
    | "sattelites"
    | "superconductors"
    | "tachyonTheory"
    | "terraformation"
    | "theology"
    | "voidSpace"
    | "writing";
  constructor(tech: Technology, enabled?: boolean);
}
export type TechTechSettings = Record<Technology, TechSetting>;
export declare class TechSettings extends SettingTrigger {
  techs: TechTechSettings;
  constructor(enabled?: boolean);
  private initTechs;
  static validateGame(game: Game, settings: TechSettings): void;
  load(settings: Maybe<Partial<TechSettings>>): void;
}
//# sourceMappingURL=TechSettings.d.ts.map
