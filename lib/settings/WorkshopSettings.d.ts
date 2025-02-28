import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { type Game, type ResourceCraftable } from "../types/index.js";
import { Setting, SettingLimitedMaxTrigger, SettingTrigger } from "./Settings.js";
import { UpgradeSettings } from "./UpgradeSettings.js";
export declare class CraftSettingsItem extends SettingLimitedMaxTrigger {
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
    | "wood";
  constructor(resource: ResourceCraftable, enabled?: boolean, limited?: boolean);
}
export type WorkshopResourceSettings = Record<ResourceCraftable, CraftSettingsItem>;
export declare class WorkshopSettings extends SettingTrigger {
  resources: WorkshopResourceSettings;
  shipOverride: Setting;
  unlockUpgrades: UpgradeSettings;
  constructor(
    enabled?: boolean,
    trigger?: number,
    unlockUpgrades?: UpgradeSettings,
    shipOverride?: Setting,
  );
  private initResources;
  static validateGame(game: Game, settings: WorkshopSettings): void;
  load(settings: Maybe<Partial<WorkshopSettings>>): void;
}
//# sourceMappingURL=WorkshopSettings.d.ts.map
