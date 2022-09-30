import { BonfireSettings } from "./BonfireSettings";
import { EngineSettings } from "./EngineSettings";
import { FilterSettings } from "./FilterSettings";
import { OptionsSettings } from "./OptionsSettings";
import { ReligionSettings } from "./ReligionSettings";
import { ScienceSettings } from "./ScienceSettings";
import { KittenStorageType } from "./SettingsStorage";
import { SpaceSettings } from "./SpaceSettings";
import { TimeControlSettings } from "./TimeControlSettings";
import { TimeSettings } from "./TimeSettings";
import { TradingSettings } from "./TradingSettings";
import { VillageSettings } from "./VillageSettings";
import { WorkshopSettings } from "./WorkshopSettings";

/**
 * The `Options` object resembles the options as they were authored in
 * Kitten Scientists 1.5. It serves as an intermediate structure to import
 * the legacy settings format.
 */
export class Options {
  static asLegacyOptions(settings: {
    bonfire: BonfireSettings;
    engine: EngineSettings;
    religion: ReligionSettings;
    science: ScienceSettings;
    space: SpaceSettings;
    time: TimeSettings;
    timeControl: TimeControlSettings;
    trading: TradingSettings;
    village: VillageSettings;
    workshop: WorkshopSettings;
  }): KittenStorageType {
    const subject = {} as KittenStorageType;

    subject.toggles = {
      build: settings.bonfire.enabled,
      space: settings.space.enabled,
      craft: settings.workshop.enabled,
      upgrade: settings.science.enabled,
      trade: settings.trading.enabled,
      faith: settings.religion.enabled,
      time: settings.time.enabled,
      timeCtrl: settings.timeControl.enabled,
      distribute: settings.village.enabled,
      options: settings.engine.options.enabled,
      filter: settings.engine.filters.enabled,
    };

    subject.triggers = {
      faith: settings.religion.trigger,
      time: settings.time.trigger,
      build: settings.bonfire.trigger,
      space: settings.space.trigger,
      craft: settings.workshop.trigger,
      trade: settings.trading.trigger,
    };

    subject.items = {};
    subject.resources = {};

    BonfireSettings.toLegacyOptions(settings.bonfire, subject);
    WorkshopSettings.toLegacyOptions(settings.workshop, subject);
    VillageSettings.toLegacyOptions(settings.village, subject);
    FilterSettings.toLegacyOptions(settings.engine.filters, subject);
    OptionsSettings.toLegacyOptions(settings.engine.options, subject);
    ReligionSettings.toLegacyOptions(settings.religion, subject);
    ScienceSettings.toLegacyOptions(settings.science, subject);
    SpaceSettings.toLegacyOptions(settings.space, subject);
    TimeSettings.toLegacyOptions(settings.time, subject);
    TimeControlSettings.toLegacyOptions(settings.timeControl, subject);
    TradingSettings.toLegacyOptions(settings.trading, subject);

    return subject;
  }
}
