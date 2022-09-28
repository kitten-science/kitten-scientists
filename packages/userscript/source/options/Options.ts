import { isNil } from "../tools/Maybe";
import { Resource, SpaceBuildings } from "../types";
import { BonfireItem, BonfireSettings } from "./BonfireSettings";
import { EngineSettings } from "./EngineSettings";
import { FilterSettings } from "./FilterSettings";
import { OptionsSettings } from "./OptionsSettings";
import { FaithItem, ReligionItem, ReligionSettings } from "./ReligionSettings";
import { ScienceSettings } from "./ScienceSettings";
import { KittenStorageType } from "./SettingsStorage";
import { SpaceSettings } from "./SpaceSettings";
import { TimeControlSettings } from "./TimeControlSettings";
import { TimeItem, TimeSettings } from "./TimeSettings";
import { TradingSettings } from "./TradingSettings";
import { VillageSettings } from "./VillageSettings";
import { WorkshopSettings } from "./WorkshopSettings";

export type Requirement = Resource | false;

/**
 * The type names of all supported buildings.
 */
export type AllItems = BonfireItem | FaithItem | ReligionItem | SpaceBuildings | TimeItem;

/**
 * The `Options` object resembles the options as they were authored in
 * Kitten Scientists 1.5. It serves as an intermediate structure to import
 * the legacy settings format.
 */
export class Options {
  auto: {
    engine: EngineSettings;
    bonfire: BonfireSettings;
    space: SpaceSettings;
    craft: WorkshopSettings;
    unlock: ScienceSettings;
    trade: TradingSettings;
    religion: ReligionSettings;
    time: TimeSettings;
    timeCtrl: TimeControlSettings;
    village: VillageSettings;
    options: OptionsSettings;
    filters: FilterSettings;
  } = {
    engine: new EngineSettings(),
    bonfire: new BonfireSettings(),
    space: new SpaceSettings(),
    craft: new WorkshopSettings(),
    unlock: new ScienceSettings(),
    trade: new TradingSettings(),
    religion: new ReligionSettings(),
    time: new TimeSettings(),
    timeCtrl: new TimeControlSettings(),
    village: new VillageSettings(),
    options: new OptionsSettings(),
    filters: new FilterSettings(),
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

    subject.items = {};
    subject.resources = {};

    BonfireSettings.toLegacyOptions(optionsObject.auto.bonfire, subject);
    WorkshopSettings.toLegacyOptions(optionsObject.auto.craft, subject);
    VillageSettings.toLegacyOptions(optionsObject.auto.village, subject);
    FilterSettings.toLegacyOptions(optionsObject.auto.filters, subject);
    OptionsSettings.toLegacyOptions(optionsObject.auto.options, subject);
    ReligionSettings.toLegacyOptions(optionsObject.auto.religion, subject);
    ScienceSettings.toLegacyOptions(optionsObject.auto.unlock, subject);
    SpaceSettings.toLegacyOptions(optionsObject.auto.space, subject);
    TimeSettings.toLegacyOptions(optionsObject.auto.time, subject);
    TimeControlSettings.toLegacyOptions(optionsObject.auto.timeCtrl, subject);
    TradingSettings.toLegacyOptions(optionsObject.auto.trade, subject);

    return subject;
  }

  static parseLegacyOptions(optionsObject: unknown): Options {
    const result = new Options();

    if (isNil(optionsObject)) {
      return result;
    }

    const subject = optionsObject as KittenStorageType;

    result.auto.bonfire = BonfireSettings.fromLegacyOptions(subject);
    result.auto.craft = WorkshopSettings.fromLegacyOptions(subject);
    result.auto.village = VillageSettings.fromLegacyOptions(subject);
    result.auto.filters = FilterSettings.fromLegacyOptions(subject);
    result.auto.options = OptionsSettings.fromLegacyOptions(subject);
    result.auto.religion = ReligionSettings.fromLegacyOptions(subject);
    result.auto.space = SpaceSettings.fromLegacyOptions(subject);
    result.auto.timeCtrl = TimeControlSettings.fromLegacyOptions(subject);
    result.auto.time = TimeSettings.fromLegacyOptions(subject);
    result.auto.trade = TradingSettings.fromLegacyOptions(subject);
    result.auto.unlock = ScienceSettings.fromLegacyOptions(subject);

    return result;
  }
}
