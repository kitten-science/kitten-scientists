import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { type Race, type Season } from "../types/index.js";
import { EmbassySettings } from "./EmbassySettings.js";
import {
  type Requirement,
  Setting,
  SettingBuySellThreshold,
  SettingLimitedTrigger,
  SettingTrigger,
} from "./Settings.js";
export declare class TradeSettingsItem extends SettingLimitedTrigger {
  #private;
  readonly seasons: Record<Season, Setting>;
  get race():
    | "zebras"
    | "dragons"
    | "griffins"
    | "nagas"
    | "leviathans"
    | "lizards"
    | "sharks"
    | "spiders";
  get require(): Requirement;
  constructor(
    race: Race,
    enabled: boolean,
    limited: boolean,
    summer: boolean,
    autumn: boolean,
    winter: boolean,
    spring: boolean,
    require?: Requirement,
  );
}
export type TradeSettingsItems = Record<Race, TradeSettingsItem>;
export declare class TradeSettings extends SettingTrigger {
  races: TradeSettingsItems;
  feedLeviathans: Setting;
  buildEmbassies: EmbassySettings;
  tradeBlackcoin: SettingBuySellThreshold;
  unlockRaces: Setting;
  constructor(
    enabled?: boolean,
    trigger?: number,
    buildEmbassies?: EmbassySettings,
    feedLeviathans?: Setting,
    tradeBlackcoin?: SettingBuySellThreshold,
    unlockRaces?: Setting,
  );
  private initRaces;
  load(settings: Maybe<Partial<TradeSettings>>): void;
}
//# sourceMappingURL=TradeSettings.d.ts.map
