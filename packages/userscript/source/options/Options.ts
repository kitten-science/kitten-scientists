import { objectEntries } from "../tools/Entries";
import { isNil } from "../tools/Maybe";
import { Resource } from "../types";
import { BonfireSettings } from "./BonfireSettings";
import { CraftSettings } from "./CraftSettings";
import { DistributeSettings } from "./DistributeSettings";
import { FilterSettings } from "./FilterSettings";
import { KittenStorageType } from "./KittenStorage";
import { OptionsSettings } from "./OptionsSettings";
import { ReligionSettings } from "./ReligionSettings";
import { ResourcesSettingsItem } from "./ResourcesSettings";
import { SpaceSettings } from "./SpaceSettings";
import { TimeControlSettings } from "./TimeControlSettings";
import { TimeSettings } from "./TimeSettings";
import { TradingSettings } from "./TradingSettings";
import { UnlockingSettings } from "./UnlockingSettings";

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
    resources: {
      [item in Resource]?: ResourcesSettingsItem;
    };
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
    resources: {
      furs: {
        enabled: true,
        stock: 1000,
      },
    },
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
      result.auto.timeCtrl.items.timeSkip[cycleIndex] =
        subject.items[`toggle-timeSkip-${cycleIndex}` as const] ??
        result.auto.timeCtrl.items.timeSkip[cycleIndex];
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

    for (const [name, item] of objectEntries(subject.resources)) {
      if (item.checkForReset) {
        result.auto.timeCtrl.resources[name] = {
          checkForReset: true,
          stockForReset: item.stockForReset,
        };
      } else {
        result.auto.resources[name] = {
          consume: item.consume,
          enabled: item.enabled,
          stock: item.stock,
        };
      }
    }

    return result;
  }
}
