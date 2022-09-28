import { FilterSettings } from "./FilterSettings";
import { OptionsSettings } from "./OptionsSettings";
import { SettingsSection } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

export class EngineSettings extends SettingsSection {
  filters: FilterSettings;

  /**
   * The interval at which the internal processing loop is run, in milliseconds.
   */
  interval = 2000;

  options: OptionsSettings;

  constructor(enabled = false, filters = new FilterSettings(), options = new OptionsSettings()) {
    super(enabled);
    this.filters = filters;
    this.options = options;
  }

  load(settings: EngineSettings) {
    this.enabled = settings.enabled;
    this.interval = settings.interval;

    this.filters.load(settings.filters);
    this.options.load(settings.options);
  }

  static toLegacyOptions(settings: EngineSettings, subject: KittenStorageType) {
    FilterSettings.toLegacyOptions(settings.filters, subject);
    OptionsSettings.toLegacyOptions(settings.options, subject);
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new EngineSettings();

    options.filters = FilterSettings.fromLegacyOptions(subject);
    options.options = OptionsSettings.fromLegacyOptions(subject);

    return options;
  }
}
