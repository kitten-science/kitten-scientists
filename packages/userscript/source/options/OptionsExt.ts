import { objectEntries } from "../tools/Entries";
import { isNil } from "../tools/Maybe";
import { BonfireSettings } from "./BonfireSettings";
import { CraftSettings } from "./CraftSettings";
import { DistributeSettings } from "./DistributeSettings";
import { FilterSettings } from "./FilterSettings";
import { KittenStorageType } from "./KittenStorage";
import { OptionsSettings } from "./OptionsSettings";
import { ReligionSettings } from "./ReligionSettings";
import { ResourceSettings } from "./ResourcesSettings";
import { SpaceSettings } from "./SpaceSettings";
import { TimeControlSettings } from "./TimeControlSettings";
import { TimeSettings } from "./TimeSettings";
import { TradingSettings } from "./TradingSettings";
import { UnlockingSettings } from "./UnlockingSettings";

export class OptionsExt {
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
    resources: ResourceSettings;
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
      timeCrystal: { enabled: false, stock: 0 },
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

  static parse(optionsObject: unknown): OptionsExt {
    const result = new OptionsExt();

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
      item.enabled = subject.items[`toggle-${name}`] ?? item.enabled;
      item.max = subject.items[`set-${name}-max`] ?? item.max;
    }

    for (const [name, item] of objectEntries(subject.resources)) {
      result.auto.resources[name] = {
        consume: item.consume,
        enabled: item.enabled,
        stock: item.stock,
      };
    }

    return result;
  }
}
