import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import type { Resource, SpaceBuilding } from "../types/index.js";
import type { BonfireItem } from "./BonfireSettings.js";
import type { ReligionItem } from "./ReligionSettings.js";
import type { TimeItem } from "./TimeSettings.js";
export type Requirement = Resource | false;
/**
 * The type names of all supported buildings.
 */
export type AllItems = BonfireItem | ReligionItem | SpaceBuilding | TimeItem;
export declare class Setting {
  enabled: boolean;
  constructor(enabled?: boolean);
  load(setting: Maybe<Partial<Setting>>): void;
  serialize(): this;
}
export declare class SettingLimited extends Setting {
  limited: boolean;
  constructor(enabled?: boolean, limited?: boolean);
  load(setting: Maybe<Partial<SettingLimited>>): void;
}
/**
 * A setting that also includes a trigger value.
 * Trigger values range from 0 to 1. They reflect a percentage.
 */
export declare class SettingTrigger extends Setting {
  trigger: number;
  constructor(enabled?: boolean, trigger?: number);
  load(setting: Maybe<Partial<SettingTrigger>>): void;
}
/**
 * A setting that also includes an absolute value trigger.
 * Trigger values range from 0 to Infinity, while -1 designates Infinity explicitly.
 */
export declare class SettingThreshold extends Setting {
  trigger: number;
  constructor(enabled?: boolean, threshold?: number);
  load(setting: Maybe<Partial<SettingThreshold>>): void;
}
export declare class SettingMax extends Setting {
  max: number;
  constructor(enabled?: boolean, max?: number);
  load(setting: Maybe<Partial<SettingMax>>): void;
}
export declare class SettingLimitedMax extends SettingLimited implements SettingMax {
  max: number;
  constructor(enabled?: boolean, limited?: boolean, max?: number);
  load(setting: Maybe<Partial<SettingLimitedMax>>): void;
}
export declare class SettingLimitedMaxTrigger extends SettingLimitedMax implements SettingTrigger {
  trigger: number;
  constructor(enabled?: boolean, limited?: boolean, max?: number, trigger?: number);
  load(setting: Maybe<Partial<SettingLimitedMaxTrigger>>): void;
}
export declare class SettingLimitedTrigger extends SettingLimited implements SettingTrigger {
  trigger: number;
  constructor(enabled?: boolean, limited?: boolean, trigger?: number);
  load(setting: Maybe<Partial<SettingLimitedTrigger>>): void;
}
export declare class SettingTriggerMax extends SettingTrigger implements SettingMax {
  max: number;
  constructor(enabled?: boolean, trigger?: number, max?: number);
  load(setting: Maybe<Partial<SettingTriggerMax>>): void;
}
export declare class SettingThresholdMax extends SettingThreshold implements SettingMax {
  max: number;
  constructor(enabled?: boolean, trigger?: number, max?: number);
  load(setting: Maybe<Partial<SettingTriggerMax>>): void;
}
export declare class SettingOptions<T = string> {
  #private;
  selected: T;
  get options(): {
    label: string;
    value: T;
  }[];
  constructor(
    selected: T,
    options?: {
      label: string;
      value: T;
    }[],
  );
  load(setting: Maybe<Partial<SettingOptions<T>>>): void;
}
export declare class SettingBuy extends Setting {
  buy: number;
  constructor(enabled?: boolean, buy?: number);
  load(setting: Maybe<Partial<SettingBuy>>): void;
}
export declare class SettingSell extends Setting {
  sell: number;
  constructor(enabled?: boolean, sell?: number);
  load(setting: Maybe<Partial<SettingSell>>): void;
}
export declare class SettingBuySellThreshold
  extends SettingThreshold
  implements SettingBuy, SettingSell
{
  buy: number;
  sell: number;
  constructor(enabled?: boolean, buy?: number, sell?: number, trigger?: number);
  load(setting: Maybe<Partial<SettingBuySellThreshold>>): void;
}
//# sourceMappingURL=Settings.d.ts.map
