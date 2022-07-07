import { objectEntries } from "../tools/Entries";
import { isNil } from "../tools/Maybe";
import { Resource } from "../types";
import { BonfireItem, BonfireSettings } from "./BonfireSettings";
import { CraftSettings } from "./CraftSettings";
import { FilterSettings } from "./FilterSettings";
import { OptionsSettings } from "./OptionsSettings";
import { PolicySettings } from "./PolicySettings";
import { FaithItem, ReligionItem, ReligionSettings } from "./ReligionSettings";
import { ScienceSettings } from "./ScienceSettings";
import { KittenStorageType } from "./SettingsStorage";
import { SpaceItem, SpaceSettings } from "./SpaceSettings";
import { TimeControlSettings } from "./TimeControlSettings";
import { TimeItem, TimeSettings } from "./TimeSettings";
import { TradingSettings } from "./TradingSettings";
import { VillageSettings } from "./VillageSettings";

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
    bonfire: BonfireSettings;
    space: SpaceSettings;
    craft: CraftSettings;
    unlock: ScienceSettings;
    trade: TradingSettings;
    religion: ReligionSettings;
    time: TimeSettings;
    timeCtrl: TimeControlSettings;
    village: VillageSettings;
    options: OptionsSettings;
    filters: FilterSettings;
  } = {
    engine: { enabled: false },
    bonfire: new BonfireSettings(),
    space: new SpaceSettings(),
    craft: new CraftSettings(),
    unlock: new ScienceSettings(),
    trade: new TradingSettings(),
    religion: new ReligionSettings(),
    time: new TimeSettings(),
    timeCtrl: new TimeControlSettings(),
    village: new VillageSettings(),
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
      build: optionsObject.auto.bonfire.enabled,
      space: optionsObject.auto.space.enabled,
      craft: optionsObject.auto.craft.enabled,
      upgrade: optionsObject.auto.unlock.enabled,
      trade: optionsObject.auto.trade.enabled,
      faith: optionsObject.auto.religion.enabled,
      time: optionsObject.auto.time.enabled,
      timeCtrl: optionsObject.auto.timeCtrl.enabled,
      distribute: optionsObject.auto.village.enabled,
      options: optionsObject.auto.options.enabled,
      filter: optionsObject.auto.filters.enabled,
    };

    subject.triggers = {
      faith: optionsObject.auto.religion.trigger,
      time: optionsObject.auto.time.trigger,
      build: optionsObject.auto.bonfire.trigger,
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
    subject.resources = {};

    BonfireSettings.toLegacyOptions(optionsObject.auto.bonfire, subject);
    CraftSettings.toLegacyOptions(optionsObject.auto.craft, subject);
    VillageSettings.toLegacyOptions(optionsObject.auto.village, subject);
    FilterSettings.toLegacyOptions(optionsObject.auto.filters, subject);

    for (const [name, item] of objectEntries(optionsObject.auto.options.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`set-${name}-subTrigger` as const] = item.subTrigger;
    }

    ReligionSettings.toLegacyOptions(optionsObject.auto.religion, subject);
    SpaceSettings.toLegacyOptions(optionsObject.auto.space, subject);
    TimeSettings.toLegacyOptions(optionsObject.auto.time, subject);
    TimeControlSettings.toLegacyOptions(optionsObject.auto.timeCtrl, subject);
    TradingSettings.toLegacyOptions(optionsObject.auto.trade, subject);

    for (const [name, item] of objectEntries(optionsObject.auto.unlock.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
    }
    for (const [name, item] of objectEntries(
      (optionsObject.auto.unlock.items.policies as PolicySettings).items
    )) {
      subject.items[`toggle-${name}` as const] = item.enabled;
    }

    return subject;
  }

  static parseLegacyOptions(optionsObject: unknown): Options {
    const result = new Options();

    if (isNil(optionsObject)) {
      return result;
    }

    const subject = optionsObject as KittenStorageType;

    result.auto.bonfire = BonfireSettings.fromLegacyOptions(subject);
    result.auto.craft = CraftSettings.fromLegacyOptions(subject);
    result.auto.village = VillageSettings.fromLegacyOptions(subject);
    result.auto.filters = FilterSettings.fromLegacyOptions(subject);
    result.auto.options = OptionsSettings.fromLegacyOptions(subject);
    result.auto.religion = ReligionSettings.fromLegacyOptions(subject);
    result.auto.space = SpaceSettings.fromLegacyOptions(subject);
    result.auto.timeCtrl = TimeControlSettings.fromLegacyOptions(subject);
    result.auto.time = TimeSettings.fromLegacyOptions(subject);
    result.auto.trade = TradingSettings.fromLegacyOptions(subject);
    result.auto.unlock = ScienceSettings.fromLegacyOptions(subject);

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
