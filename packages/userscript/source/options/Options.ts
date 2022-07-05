import { objectEntries } from "../tools/Entries";
import { isNil } from "../tools/Maybe";
import { Resource } from "../types";
import { BonfireItem, BonfireSettings } from "./BonfireSettings";
import { CraftSettings } from "./CraftSettings";
import { DistributeSettings } from "./DistributeSettings";
import { FilterSettings } from "./FilterSettings";
import { OptionsSettings } from "./OptionsSettings";
import { PolicySettings } from "./PolicySettings";
import { FaithItem, ReligionItem, ReligionSettings } from "./ReligionSettings";
import { KittenStorageType } from "./SettingsStorage";
import { SpaceItem, SpaceSettings } from "./SpaceSettings";
import { CycleIndices, TimeControlSettings } from "./TimeControlSettings";
import { TimeItem, TimeSettings } from "./TimeSettings";
import { TradingSettings } from "./TradingSettings";
import { UnlockingSettings } from "./UnlockingSettings";

export type Requirement = Resource | false;

/**
 * The type names of all supported buildings.
 */
export type AllItems = BonfireItem | FaithItem | ReligionItem | SpaceItem | TimeItem;

export class Options {
  /**
   * The interval at which the internal processing loop is run, in milliseconds.
   */
  interval = 2000;

  /**
   * The default consume rate.
   */
  consume = 0.6;

  auto: {
    engine: { enabled: boolean };
    build: BonfireSettings;
    space: SpaceSettings;
    craft: CraftSettings;
    unlock: UnlockingSettings;
    trade: TradingSettings;
    religion: ReligionSettings;
    time: TimeSettings;
    timeCtrl: TimeControlSettings;
    distribute: DistributeSettings;
    options: OptionsSettings;
    filters: FilterSettings;
  } = {
    engine: { enabled: false },
    build: new BonfireSettings(),
    space: new SpaceSettings(),
    craft: new CraftSettings(),
    unlock: new UnlockingSettings(),
    trade: new TradingSettings(),
    religion: new ReligionSettings(),
    time: new TimeSettings(),
    timeCtrl: new TimeControlSettings(),
    distribute: new DistributeSettings(),
    options: new OptionsSettings(),
    filters: new FilterSettings(),
  };

  reset: {
    karmaLastTime: number;
    karmaTotal: number;
    paragonLastTime: number;
    paragonTotal: number;
    times: number;
    reset: boolean;
  } = {
    reset: false,
    times: 0,
    paragonLastTime: 0,
    paragonTotal: 0,
    karmaLastTime: 0,
    karmaTotal: 0,
  };

  asLegacyOptions(optionsObject: Options = this): KittenStorageType {
    const subject = {} as KittenStorageType;

    subject.toggles = {
      build: optionsObject.auto.build.enabled,
      space: optionsObject.auto.space.enabled,
      craft: optionsObject.auto.craft.enabled,
      upgrade: optionsObject.auto.unlock.enabled,
      trade: optionsObject.auto.trade.enabled,
      faith: optionsObject.auto.religion.enabled,
      time: optionsObject.auto.time.enabled,
      timeCtrl: optionsObject.auto.timeCtrl.enabled,
      distribute: optionsObject.auto.distribute.enabled,
      options: optionsObject.auto.options.enabled,
      filter: optionsObject.auto.filters.enabled,
    };

    subject.triggers = {
      faith: optionsObject.auto.religion.trigger,
      time: optionsObject.auto.time.trigger,
      build: optionsObject.auto.build.trigger,
      space: optionsObject.auto.space.trigger,
      craft: optionsObject.auto.craft.trigger,
      trade: optionsObject.auto.trade.trigger,
    };

    subject.reset = {
      reset: optionsObject.reset.reset,
      times: optionsObject.reset.times,
      paragonLastTime: optionsObject.reset.paragonLastTime,
      pargonTotal: optionsObject.reset.paragonTotal,
      karmaLastTime: optionsObject.reset.karmaLastTime,
      karmaTotal: optionsObject.reset.karmaTotal,
    };

    subject.items = {};
    for (const [name, item] of objectEntries(optionsObject.auto.build.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`set-${name}-max` as const] = item.max;
    }
    for (const [name, item] of objectEntries(optionsObject.auto.craft.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`toggle-limited-${name}` as const] = item.limited;
    }
    for (const [name, item] of objectEntries(optionsObject.auto.distribute.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`toggle-limited-${name}` as const] = item.limited;
      subject.items[`set-${name}-max` as const] = item.max;
    }
    for (const [name, item] of objectEntries(optionsObject.auto.filters.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
    }
    for (const [name, item] of objectEntries(optionsObject.auto.options.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`set-${name}-subTrigger` as const] = item.subTrigger;
    }
    for (const [name, item] of objectEntries(optionsObject.auto.religion.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
    }
    for (const [name, item] of objectEntries(optionsObject.auto.space.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`set-${name}-max` as const] = item.max;
    }

    subject.items["toggle-accelerateTime"] =
      optionsObject.auto.timeCtrl.items.accelerateTime.enabled;
    subject.items["set-accelerateTime-subTrigger"] =
      optionsObject.auto.timeCtrl.items.accelerateTime.subTrigger;

    subject.items["toggle-reset"] = optionsObject.auto.timeCtrl.items.reset.enabled;

    subject.items["toggle-timeSkip"] = optionsObject.auto.timeCtrl.items.timeSkip.enabled;
    subject.items["set-timeSkip-subTrigger"] =
      optionsObject.auto.timeCtrl.items.timeSkip.subTrigger;
    subject.items["toggle-timeSkip-autumn"] = optionsObject.auto.timeCtrl.items.timeSkip.autumn;
    subject.items["toggle-timeSkip-spring"] = optionsObject.auto.timeCtrl.items.timeSkip.spring;
    subject.items["toggle-timeSkip-summer"] = optionsObject.auto.timeCtrl.items.timeSkip.summer;
    subject.items["toggle-timeSkip-winter"] = optionsObject.auto.timeCtrl.items.timeSkip.winter;

    for (let cycleIndex = 0; cycleIndex < 10; ++cycleIndex) {
      subject.items[`toggle-timeSkip-${cycleIndex as CycleIndices}` as const] =
        optionsObject.auto.timeCtrl.items.timeSkip[cycleIndex as CycleIndices];
    }

    for (const [name, item] of objectEntries(optionsObject.auto.timeCtrl.buildItems)) {
      subject.items[`toggle-reset-build-${name}` as const] = item.checkForReset;
      subject.items[`set-reset-build-${name}-min` as const] = item.triggerForReset;
    }
    for (const [name, item] of objectEntries(optionsObject.auto.timeCtrl.religionItems)) {
      subject.items[`toggle-reset-faith-${name}` as const] = item.checkForReset;
      subject.items[`set-reset-faith-${name}-min` as const] = item.triggerForReset;
    }
    for (const [name, item] of objectEntries(optionsObject.auto.timeCtrl.spaceItems)) {
      subject.items[`toggle-reset-space-${name}` as const] = item.checkForReset;
      subject.items[`set-reset-space-${name}-min` as const] = item.triggerForReset;
    }
    for (const [name, item] of objectEntries(optionsObject.auto.timeCtrl.timeItems)) {
      subject.items[`toggle-reset-time-${name}` as const] = item.checkForReset;
      subject.items[`set-reset-time-${name}-min` as const] = item.triggerForReset;
    }

    for (const [name, item] of objectEntries(optionsObject.auto.trade.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`toggle-limited-${name}` as const] = item.limited;
      subject.items[`toggle-${name}-autumn` as const] = item.autumn;
      subject.items[`toggle-${name}-spring` as const] = item.spring;
      subject.items[`toggle-${name}-summer` as const] = item.summer;
      subject.items[`toggle-${name}-winter` as const] = item.winter;
    }
    subject.items["toggle-buildEmbassies" as const] =
      optionsObject.auto.trade.addition.buildEmbassies.enabled;
    for (const [name, item] of objectEntries(optionsObject.auto.unlock.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
    }
    for (const [name, item] of objectEntries(
      (optionsObject.auto.unlock.items.policies as PolicySettings).items
    )) {
      subject.items[`toggle-${name}` as const] = item.enabled;
    }

    subject.resources = {};
    for (const [name, item] of objectEntries(optionsObject.auto.craft.resources)) {
      subject.resources[name] = {
        checkForReset: false,
        stockForReset: 0,
        consume: item.consume,
        enabled: item.enabled,
        stock: item.stock,
      };
    }
    for (const [name, item] of objectEntries(optionsObject.auto.timeCtrl.resources)) {
      subject.resources[name] = {
        checkForReset: item.checkForReset,
        stockForReset: item.stockForReset,
        consume: 0,
        enabled: false,
        stock: 0,
      };
    }

    return subject;
  }

  static parseLegacyOptions(optionsObject: unknown): Options {
    const result = new Options();

    if (isNil(optionsObject)) {
      return result;
    }

    const subject = optionsObject as KittenStorageType;

    result.auto.build = BonfireSettings.fromLegacyOptions(subject);
    result.auto.craft = CraftSettings.fromLegacyOptions(subject);
    result.auto.distribute = DistributeSettings.fromLegacyOptions(subject);
    result.auto.filters = FilterSettings.fromLegacyOptions(subject);
    result.auto.options = OptionsSettings.fromLegacyOptions(subject);
    result.auto.religion = ReligionSettings.fromLegacyOptions(subject);
    result.auto.space = SpaceSettings.fromLegacyOptions(subject);
    result.auto.timeCtrl = TimeControlSettings.fromLegacyOptions(subject);
    result.auto.time = TimeSettings.fromLegacyOptions(subject);
    result.auto.trade = TradingSettings.fromLegacyOptions(subject);
    result.auto.unlock = UnlockingSettings.fromLegacyOptions(subject);

    // Reset options. Specific use unclear for now
    result.reset.reset = subject.reset.reset;
    result.reset.times = subject.reset.times;
    result.reset.paragonLastTime = subject.reset.paragonLastTime;
    result.reset.paragonTotal = subject.reset.pargonTotal;
    result.reset.karmaLastTime = subject.reset.karmaLastTime;
    result.reset.karmaTotal = subject.reset.karmaTotal;

    return result;
  }
}
