import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { type Resource } from "../types/index.js";
import { Setting } from "./Settings.js";
export declare class ResourcesSettingsItem extends Setting {
  #private;
  consume: number;
  stock: number;
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
  constructor(resource: Resource, enabled?: boolean, consume?: number, stock?: number);
}
export type ResourcesResourceSettings = Record<Resource, ResourcesSettingsItem>;
export declare class ResourcesSettings extends Setting {
  resources: ResourcesResourceSettings;
  constructor(enabled?: boolean);
  private initResources;
  load(settings: Maybe<Partial<ResourcesSettings>>): void;
}
//# sourceMappingURL=ResourcesSettings.d.ts.map
