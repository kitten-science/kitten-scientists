import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { type Building, type StagedBuilding } from "../types/index.js";
import { BuildingUpgradeSettings } from "./BuildingUpgradeSettings.js";
import { Setting, SettingTrigger, SettingTriggerMax } from "./Settings.js";
/**
 * One of the building options in the KS menu.
 * These are not identical to `Building`!
 * `Building` is IDs of buildings as defined by KG. KS defines upgrade stages as well.
 */
export type BonfireItem = Building | StagedBuilding;
export declare class BonfireBuildingSetting extends SettingTriggerMax {
  #private;
  get baseBuilding():
    | "academy"
    | "accelerator"
    | "aiCore"
    | "amphitheatre"
    | "aqueduct"
    | "barn"
    | "biolab"
    | "brewery"
    | "calciner"
    | "chapel"
    | "chronosphere"
    | "factory"
    | "field"
    | "harbor"
    | "hut"
    | "library"
    | "logHouse"
    | "lumberMill"
    | "magneto"
    | "mansion"
    | "mine"
    | "mint"
    | "observatory"
    | "oilWell"
    | "pasture"
    | "quarry"
    | "reactor"
    | "smelter"
    | "steamworks"
    | "temple"
    | "tradepost"
    | "unicornPasture"
    | "warehouse"
    | "workshop"
    | "zebraForge"
    | "zebraOutpost"
    | "zebraWorkshop"
    | "ziggurat"
    | undefined;
  get building(): BonfireItem;
  get stage(): number;
  constructor(
    building: BonfireItem,
    enabled?: boolean,
    trigger?: number,
    max?: number,
    baseStage?: Building | false,
  );
}
export type BonfireBuildingSettings = Record<
  Exclude<BonfireItem, "unicornPasture">,
  BonfireBuildingSetting
>;
export declare class BonfireSettings extends SettingTrigger {
  buildings: BonfireBuildingSettings;
  gatherCatnip: Setting;
  turnOnMagnetos: Setting;
  turnOnSteamworks: Setting;
  turnOnReactors: Setting;
  upgradeBuildings: BuildingUpgradeSettings;
  constructor(
    enabled?: boolean,
    trigger?: number,
    gatherCatnip?: Setting,
    turnOnSteamworks?: Setting,
    turnOnMagnetos?: Setting,
    turnOnReactors?: Setting,
    upgradeBuildings?: BuildingUpgradeSettings,
  );
  private initBuildings;
  load(settings: Maybe<Partial<BonfireSettings>>): void;
}
//# sourceMappingURL=BonfireSettings.d.ts.map
