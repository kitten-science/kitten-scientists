import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import {
  type ReligionUpgrade,
  type TranscendenceUpgrade,
  UnicornItemVariant,
  type ZiggurathUpgrade,
} from "../types/index.js";
import { Setting, SettingThreshold, SettingTrigger, SettingTriggerMax } from "./Settings.js";
export type FaithItem = Exclude<ReligionItem, UnicornItem>;
export declare const UnicornItems: readonly [
  "ivoryCitadel",
  "ivoryTower",
  "skyPalace",
  "sunspire",
  "unicornPasture",
  "unicornTomb",
  "unicornUtopia",
];
export type UnicornItem = (typeof UnicornItems)[number];
export type ReligionItem = ReligionUpgrade | TranscendenceUpgrade | ZiggurathUpgrade;
export type ReligionAdditionItem = "adore" | "autoPraise" | "bestUnicornBuilding" | "transcend";
export declare const ReligionOptions: readonly [
  "sacrificeUnicorns",
  "sacrificeAlicorns",
  "refineTears",
  "refineTimeCrystals",
  "transcend",
  "adore",
  "autoPraise",
];
export type ReligionOption = (typeof ReligionOptions)[number];
export declare class ReligionSettingsItem extends SettingTriggerMax {
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
  constructor(building: FaithItem | UnicornItem, variant: UnicornItemVariant, enabled?: boolean);
}
export type ReligionSettingsItems = Record<FaithItem | UnicornItem, ReligionSettingsItem>;
export declare class ReligionSettings extends SettingTrigger {
  buildings: ReligionSettingsItems;
  /**
   * Build best unicorn building first.
   */
  bestUnicornBuilding: Setting;
  bestUnicornBuildingCurrent: ZiggurathUpgrade | "unicornPasture" | null;
  /**
   * Sacrifice alicorns for time crystals.
   */
  sacrificeAlicorns: SettingThreshold;
  /**
   * Sacrifice unicorns for tears.
   */
  sacrificeUnicorns: SettingThreshold;
  /**
   * Refine tears into BLS.
   */
  refineTears: SettingThreshold;
  /**
   * Refine time crystals into relics.
   */
  refineTimeCrystals: SettingThreshold;
  /**
   * Praise the sun.
   */
  autoPraise: SettingTrigger;
  /**
   * Adore the galaxy.
   */
  adore: SettingTrigger;
  /**
   * Transcend.
   */
  transcend: Setting;
  constructor(
    enabled?: boolean,
    trigger?: number,
    bestUnicornBuilding?: Setting,
    sacrificeAlicorns?: SettingThreshold,
    sacrificeUnicorns?: SettingThreshold,
    refineTears?: SettingThreshold,
    refineTimeCrystals?: SettingThreshold,
    autoPraise?: SettingTrigger,
    adore?: SettingTrigger,
    transcend?: Setting,
  );
  private initBuildings;
  load(settings: Maybe<Partial<ReligionSettings>>): void;
}
//# sourceMappingURL=ReligionSettings.d.ts.map
