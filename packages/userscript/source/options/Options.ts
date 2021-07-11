import { objectEntries } from "../tools/Entries";
import { isNil } from "../tools/Maybe";
import { Resource } from "../types";
import { BonfireSettings, BuildItem } from "./BonfireSettings";
import { CraftSettings } from "./CraftSettings";
import { DistributeSettings } from "./DistributeSettings";
import { FilterSettings } from "./FilterSettings";
import { KittenStorageType } from "./KittenStorage";
import { OptionsSettings } from "./OptionsSettings";
import { FaithItem, ReligionSettings } from "./ReligionSettings";
import { SpaceItem, SpaceSettings } from "./SpaceSettings";
import { CycleIndices, TimeControlSettings } from "./TimeControlSettings";
import { TimeItem, TimeSettings } from "./TimeSettings";
import { TradingSettings } from "./TradingSettings";
import { UnlockingSettings } from "./UnlockingSettings";

export type Requirement = Resource | false;

/**
 * The type names of all supported buildings.
 */
export type AllItems = BuildItem | FaithItem | SpaceItem | TimeItem;

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

  asLegacyOptions(): KittenStorageType {
    const subject = {} as KittenStorageType;

    subject.toggles = {
      build: this.auto.build.enabled,
      space: this.auto.space.enabled,
      craft: this.auto.craft.enabled,
      upgrade: this.auto.unlock.enabled,
      trade: this.auto.trade.enabled,
      faith: this.auto.religion.enabled,
      time: this.auto.time.enabled,
      timeCtrl: this.auto.timeCtrl.enabled,
      distribute: this.auto.distribute.enabled,
      options: this.auto.options.enabled,
      filter: this.auto.filters.enabled,
    };

    subject.triggers = {
      faith: this.auto.religion.trigger,
      time: this.auto.time.trigger,
      build: this.auto.build.trigger,
      space: this.auto.space.trigger,
      craft: this.auto.craft.trigger,
      trade: this.auto.trade.trigger,
    };

    subject.reset = {
      reset: this.reset.reset,
      times: this.reset.times,
      paragonLastTime: this.reset.paragonLastTime,
      pargonTotal: this.reset.paragonTotal,
      karmaLastTime: this.reset.karmaLastTime,
      karmaTotal: this.reset.karmaTotal,
    };

    subject.items = {};
    for (const [name, item] of objectEntries(this.auto.build.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`set-${name}-max` as const] = item.max;
    }
    for (const [name, item] of objectEntries(this.auto.craft.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`toggle-limited-${name}` as const] = item.limited;
    }
    for (const [name, item] of objectEntries(this.auto.distribute.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`toggle-limited-${name}` as const] = item.limited;
      subject.items[`set-${name}-max` as const] = item.max;
    }
    for (const [name, item] of objectEntries(this.auto.filters.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
    }
    for (const [name, item] of objectEntries(this.auto.options.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`set-${name}-subTrigger` as const] = item.subTrigger;
    }
    for (const [name, item] of objectEntries(this.auto.religion.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
    }
    for (const [name, item] of objectEntries(this.auto.space.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`set-${name}-max` as const] = item.max;
    }

    subject.items["toggle-accelerateTime"] = this.auto.timeCtrl.items.accelerateTime.enabled;
    subject.items["set-accelerateTime-subTrigger"] =
      this.auto.timeCtrl.items.accelerateTime.subTrigger;

    subject.items["toggle-reset"] = this.auto.timeCtrl.items.reset.enabled;

    subject.items["toggle-timeSkip"] = this.auto.timeCtrl.items.timeSkip.enabled;
    subject.items["set-timeSkip-subTrigger"] = this.auto.timeCtrl.items.timeSkip.subTrigger;
    subject.items["toggle-timeSkip-autumn"] = this.auto.timeCtrl.items.timeSkip.autumn;
    subject.items["toggle-timeSkip-spring"] = this.auto.timeCtrl.items.timeSkip.spring;
    subject.items["toggle-timeSkip-summer"] = this.auto.timeCtrl.items.timeSkip.summer;
    subject.items["toggle-timeSkip-winter"] = this.auto.timeCtrl.items.timeSkip.winter;

    for (let cycleIndex = 0; cycleIndex < 10; ++cycleIndex) {
      subject.items[`toggle-timeSkip-${cycleIndex as CycleIndices}` as const] =
        this.auto.timeCtrl.items.timeSkip[cycleIndex as CycleIndices];
    }

    for (const [name, item] of objectEntries(this.auto.timeCtrl.buildItems)) {
      subject.items[`toggle-reset-build-${name}` as const] = item.checkForReset;
      subject.items[`set-reset-build-${name}-min` as const] = item.triggerForReset;
    }
    for (const [name, item] of objectEntries(this.auto.timeCtrl.religionItems)) {
      subject.items[`toggle-reset-faith-${name}` as const] = item.checkForReset;
      subject.items[`set-reset-faith-${name}-min` as const] = item.triggerForReset;
    }
    for (const [name, item] of objectEntries(this.auto.timeCtrl.spaceItems)) {
      subject.items[`toggle-reset-space-${name}` as const] = item.checkForReset;
      subject.items[`set-reset-space-${name}-min` as const] = item.triggerForReset;
    }
    for (const [name, item] of objectEntries(this.auto.timeCtrl.timeItems)) {
      subject.items[`toggle-reset-time-${name}` as const] = item.checkForReset;
      subject.items[`set-reset-time-${name}-min` as const] = item.triggerForReset;
    }

    for (const [name, item] of objectEntries(this.auto.trade.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`toggle-limited-${name}` as const] = item.limited;
      subject.items[`toggle-${name}-autumn` as const] = item.autumn;
      subject.items[`toggle-${name}-spring` as const] = item.spring;
      subject.items[`toggle-${name}-summer` as const] = item.summer;
      subject.items[`toggle-${name}-winter` as const] = item.winter;
    }
    for (const [name, item] of objectEntries(this.auto.unlock.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
    }

    subject.resources = {};
    for (const [name, item] of objectEntries(this.auto.craft.resources)) {
      subject.resources[name] = {
        checkForReset: false,
        stockForReset: 0,
        consume: item.consume,
        enabled: item.enabled,
        stock: item.stock,
      };
    }
    for (const [name, item] of objectEntries(this.auto.timeCtrl.resources)) {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subject = optionsObject as KittenStorageType;

    // Toggles for sections.
    result.auto.build.enabled = subject.toggles.build;
    result.auto.space.enabled = subject.toggles.space;
    result.auto.craft.enabled = subject.toggles.craft;
    result.auto.unlock.enabled = subject.toggles.upgrade;
    result.auto.trade.enabled = subject.toggles.trade;
    result.auto.religion.enabled = subject.toggles.faith;
    result.auto.time.enabled = subject.toggles.time;
    result.auto.timeCtrl.enabled = subject.toggles.timeCtrl;
    result.auto.distribute.enabled = subject.toggles.distribute;
    result.auto.options.enabled = subject.toggles.options;
    result.auto.filters.enabled = subject.toggles.filter;

    // Trigger values for sections.
    result.auto.religion.trigger = subject.triggers.faith;
    result.auto.time.trigger = subject.triggers.time;
    result.auto.build.trigger = subject.triggers.build;
    result.auto.space.trigger = subject.triggers.space;
    result.auto.craft.trigger = subject.triggers.craft;
    result.auto.trade.trigger = subject.triggers.trade;

    // Reset options. Specific use unclear for now
    result.reset.reset = subject.reset.reset;
    result.reset.times = subject.reset.times;
    result.reset.paragonLastTime = subject.reset.paragonLastTime;
    result.reset.paragonTotal = subject.reset.pargonTotal;
    result.reset.karmaLastTime = subject.reset.karmaLastTime;
    result.reset.karmaTotal = subject.reset.karmaTotal;

    for (const [name, item] of objectEntries(result.auto.build.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.max = subject.items[`set-${name}-max` as const] ?? item.max;
    }
    for (const [name, item] of objectEntries(result.auto.craft.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.limited = subject.items[`toggle-limited-${name}` as const] ?? item.limited;
    }
    for (const [name, item] of objectEntries(result.auto.distribute.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.limited = subject.items[`toggle-limited-${name}` as const] ?? item.limited;
      item.max = subject.items[`set-${name}-max` as const] ?? item.max;
    }
    for (const [name, item] of objectEntries(result.auto.filters.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
    }
    for (const [name, item] of objectEntries(result.auto.options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.subTrigger = subject.items[`set-${name}-subTrigger` as const] ?? item.subTrigger;
    }
    for (const [name, item] of objectEntries(result.auto.religion.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
    }
    for (const [name, item] of objectEntries(result.auto.space.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.max = subject.items[`set-${name}-max` as const] ?? item.max;
    }

    // Load remaining religion settings.
    result.auto.religion.addition.adore.enabled =
      subject.items["toggle-adore"] ?? result.auto.religion.addition.adore.enabled;

    result.auto.religion.addition.autoPraise.enabled =
      subject.items["toggle-autoPraise"] ?? result.auto.religion.addition.autoPraise.enabled;

    result.auto.religion.addition.bestUnicornBuilding.enabled =
      subject.items["toggle-bestUnicornBuilding"] ??
      result.auto.religion.addition.bestUnicornBuilding.enabled;

    result.auto.religion.addition.transcend.enabled =
      subject.items["toggle-transcend"] ?? result.auto.religion.addition.transcend.enabled;

    result.auto.religion.addition.adore.subTrigger =
      subject.items["set-adore-subTrigger"] ?? result.auto.religion.addition.adore.subTrigger;

    result.auto.religion.addition.autoPraise.subTrigger =
      subject.items["set-autoPraise-subTrigger"] ??
      result.auto.religion.addition.autoPraise.subTrigger;

    for (const [name, item] of objectEntries(result.auto.space.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.max = subject.items[`set-${name}-max` as const] ?? item.max;
    }
    for (const [name, item] of objectEntries(result.auto.time.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
    }
    for (const [name, item] of objectEntries(result.auto.timeCtrl.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
    }

    // Time control items have almost no shared schema. Process individually.
    result.auto.timeCtrl.items.accelerateTime.enabled =
      subject.items["toggle-accelerateTime"] ?? result.auto.timeCtrl.items.accelerateTime.enabled;
    result.auto.timeCtrl.items.accelerateTime.subTrigger =
      subject.items["set-accelerateTime-subTrigger"] ??
      result.auto.timeCtrl.items.accelerateTime.subTrigger;

    result.auto.timeCtrl.items.reset.enabled =
      subject.items["toggle-reset"] ?? result.auto.timeCtrl.items.reset.enabled;

    result.auto.timeCtrl.items.timeSkip.enabled =
      subject.items["toggle-timeSkip"] ?? result.auto.timeCtrl.items.timeSkip.enabled;
    result.auto.timeCtrl.items.timeSkip.subTrigger =
      subject.items["set-timeSkip-subTrigger"] ?? result.auto.timeCtrl.items.timeSkip.subTrigger;
    result.auto.timeCtrl.items.timeSkip.autumn =
      subject.items["toggle-timeSkip-autumn"] ?? result.auto.timeCtrl.items.timeSkip.autumn;
    result.auto.timeCtrl.items.timeSkip.spring =
      subject.items["toggle-timeSkip-spring"] ?? result.auto.timeCtrl.items.timeSkip.spring;
    result.auto.timeCtrl.items.timeSkip.summer =
      subject.items["toggle-timeSkip-summer"] ?? result.auto.timeCtrl.items.timeSkip.summer;
    result.auto.timeCtrl.items.timeSkip.winter =
      subject.items["toggle-timeSkip-winter"] ?? result.auto.timeCtrl.items.timeSkip.winter;

    for (let cycleIndex = 0; cycleIndex < 10; ++cycleIndex) {
      result.auto.timeCtrl.items.timeSkip[cycleIndex as CycleIndices] =
        subject.items[`toggle-timeSkip-${cycleIndex as CycleIndices}` as const] ??
        result.auto.timeCtrl.items.timeSkip[cycleIndex as CycleIndices];
    }

    for (const [name, item] of objectEntries(result.auto.timeCtrl.buildItems)) {
      item.checkForReset =
        subject.items[`toggle-reset-build-${name}` as const] ?? item.checkForReset;
      item.triggerForReset =
        subject.items[`set-reset-build-${name}-min` as const] ?? item.triggerForReset;
    }
    for (const [name, item] of objectEntries(result.auto.timeCtrl.religionItems)) {
      item.checkForReset =
        subject.items[`toggle-reset-faith-${name}` as const] ?? item.checkForReset;
      item.triggerForReset =
        subject.items[`set-reset-faith-${name}-min` as const] ?? item.triggerForReset;
    }
    for (const [name, item] of objectEntries(result.auto.timeCtrl.spaceItems)) {
      item.checkForReset =
        subject.items[`toggle-reset-space-${name}` as const] ?? item.checkForReset;
      item.triggerForReset =
        subject.items[`set-reset-space-${name}-min` as const] ?? item.triggerForReset;
    }
    for (const [name, item] of objectEntries(result.auto.timeCtrl.timeItems)) {
      item.checkForReset =
        subject.items[`toggle-reset-time-${name}` as const] ?? item.checkForReset;
      item.triggerForReset =
        subject.items[`set-reset-time-${name}-min` as const] ?? item.triggerForReset;
    }

    for (const [name, item] of objectEntries(result.auto.trade.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.limited = subject.items[`toggle-limited-${name}` as const] ?? item.limited;
      item.autumn = subject.items[`toggle-${name}-autumn` as const] ?? item.autumn;
      item.spring = subject.items[`toggle-${name}-spring` as const] ?? item.spring;
      item.summer = subject.items[`toggle-${name}-summer` as const] ?? item.summer;
      item.winter = subject.items[`toggle-${name}-winter` as const] ?? item.winter;
    }
    for (const [name, item] of objectEntries(result.auto.unlock.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
    }

    // Remove all default items before parsing.
    result.auto.craft.resources = {};
    result.auto.timeCtrl.resources = {};
    for (const [name, item] of objectEntries(subject.resources)) {
      if (item.checkForReset) {
        result.auto.timeCtrl.resources[name] = {
          checkForReset: item.checkForReset,
          stockForReset: item.stockForReset,
        };
      } else {
        result.auto.craft.resources[name] = {
          consume: item.consume,
          enabled: item.enabled,
          stock: item.stock,
        };
      }
    }

    return result;
  }
}
