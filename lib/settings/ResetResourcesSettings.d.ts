import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { type Resource } from "../types/index.js";
import { Setting, SettingThreshold } from "./Settings.js";
export declare class ResetResourcesSettingsItem extends SettingThreshold {
  #private;
  get resource():
    | "alloy"
    | "beam"
    | "bloodstone"
    | "blueprint"
    | "compedium"
    | "concrate"
    | "eludium"
    | "gear"
    | "kerosene"
    | "manuscript"
    | "megalith"
    | "parchment"
    | "plate"
    | "scaffold"
    | "ship"
    | "slab"
    | "steel"
    | "tanker"
    | "tMythril"
    | "thorium"
    | "wood"
    | "alicorn"
    | "antimatter"
    | "blackcoin"
    | "burnedParagon"
    | "catnip"
    | "coal"
    | "culture"
    | "elderBox"
    | "faith"
    | "furs"
    | "gflops"
    | "gold"
    | "hashrates"
    | "iron"
    | "ivory"
    | "karma"
    | "kittens"
    | "manpower"
    | "minerals"
    | "necrocorn"
    | "oil"
    | "paragon"
    | "relic"
    | "science"
    | "sorrow"
    | "spice"
    | "starchart"
    | "tears"
    | "temporalFlux"
    | "timeCrystal"
    | "titanium"
    | "unicorns"
    | "unobtainium"
    | "uranium"
    | "void"
    | "wrappingPaper"
    | "zebras";
  constructor(resource: Resource, enabled?: boolean, threshold?: number);
}
export type ResetResourcesResourceSettings = Record<Resource, ResetResourcesSettingsItem>;
export declare class ResetResourcesSettings extends Setting {
  resources: ResetResourcesResourceSettings;
  constructor(enabled?: boolean);
  private initResources;
  load(settings: Maybe<Partial<ResetResourcesSettings>>): void;
}
//# sourceMappingURL=ResetResourcesSettings.d.ts.map
