import { BonfireSettings } from "./BonfireSettings";
import { EngineSettings } from "./EngineSettings";
import { ReligionSettings } from "./ReligionSettings";
import { ScienceSettings } from "./ScienceSettings";
import { LegacyStorage } from "./SettingsStorage";
import { SpaceSettings } from "./SpaceSettings";
import { TimeControlSettings } from "./TimeControlSettings";
import { TimeSettings } from "./TimeSettings";
import { TradeSettings } from "./TradeSettings";
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
    trading: TradeSettings;
    village: VillageSettings;
    workshop: WorkshopSettings;
  }): LegacyStorage {
    const subject = {} as LegacyStorage;

    subject.toggles = {
      engine: settings.engine.enabled,
      build: settings.bonfire.enabled,
      space: settings.space.enabled,
      craft: settings.workshop.enabled,
      upgrade: settings.science.enabled,
      trade: settings.trading.enabled,
      faith: settings.religion.enabled,
      time: settings.time.enabled,
      timeCtrl: settings.timeControl.enabled,
      distribute: settings.village.enabled,
      options: true,
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

    EngineSettings.toLegacyOptions(settings.engine, subject);

    BonfireSettings.toLegacyOptions(settings.bonfire, subject);
    ReligionSettings.toLegacyOptions(settings.religion, subject);
    ScienceSettings.toLegacyOptions(settings.science, subject);
    SpaceSettings.toLegacyOptions(settings.space, subject);
    TimeControlSettings.toLegacyOptions(settings.timeControl, subject);
    TimeSettings.toLegacyOptions(settings.time, subject);
    TradeSettings.toLegacyOptions(settings.trading, subject);
    VillageSettings.toLegacyOptions(settings.village, subject);
    WorkshopSettings.toLegacyOptions(settings.workshop, subject);

    return subject;
  }
}
