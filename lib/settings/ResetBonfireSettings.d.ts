import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { type Building } from "../types/index.js";
import type { BonfireItem } from "./BonfireSettings.js";
import { Setting, SettingThreshold } from "./Settings.js";
export declare class ResetBonfireBuildingSetting extends SettingThreshold {
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
    threshold?: number,
    baseStage?: Building | false,
  );
}
export type ResetBonfireBuildingSettings = Record<
  Exclude<BonfireItem, "unicornPasture">,
  ResetBonfireBuildingSetting
>;
export declare class ResetBonfireSettings extends Setting {
  readonly buildings: ResetBonfireBuildingSettings;
  constructor(enabled?: boolean);
  private initBuildings;
  load(settings: Maybe<Partial<ResetBonfireSettings>>): void;
}
//# sourceMappingURL=ResetBonfireSettings.d.ts.map
