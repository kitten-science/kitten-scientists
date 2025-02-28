import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { UnicornItemVariant } from "../types/index.js";
import type { FaithItem, UnicornItem } from "./ReligionSettings.js";
import { Setting, SettingThreshold } from "./Settings.js";
export declare class ResetReligionBuildingSetting extends SettingThreshold {
  #private;
  get building():
    | "unicornPasture"
    | "ivoryCitadel"
    | "ivoryTower"
    | "skyPalace"
    | "sunspire"
    | "unicornTomb"
    | "unicornUtopia"
    | FaithItem;
  get variant(): UnicornItemVariant;
  constructor(
    building: FaithItem | UnicornItem,
    variant: UnicornItemVariant,
    enabled?: boolean,
    threshold?: number,
  );
}
export type ResetReligionBuildingSettings = Record<
  FaithItem | UnicornItem,
  ResetReligionBuildingSetting
>;
export declare class ResetReligionSettings extends Setting {
  readonly buildings: ResetReligionBuildingSettings;
  constructor(enabled?: boolean);
  private initBuildings;
  load(settings: Maybe<Partial<ResetReligionSettings>>): void;
}
//# sourceMappingURL=ResetReligionSettings.d.ts.map
