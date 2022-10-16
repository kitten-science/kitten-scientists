import { FilterSettings } from "./FilterSettings";
import { OptionsSettings } from "./OptionsSettings";
import { ResourcesSettings } from "./ResourcesSettings";
import { Setting } from "./Settings";
import { LegacyStorage } from "./SettingsStorage";

export class EngineSettings extends Setting {
  /**
   * The interval at which the internal processing loop is run, in milliseconds.
   */
  interval = 2000;

  filters: FilterSettings;
  options: OptionsSettings;
  resources: ResourcesSettings;

  constructor(
    enabled = false,
    filters = new FilterSettings(),
    options = new OptionsSettings(),
    resources = new ResourcesSettings()
  ) {
    super(enabled);
    this.filters = filters;
    this.options = options;
    this.resources = resources;
  }

  load(settings: EngineSettings) {
    this.enabled = settings.enabled;
    this.interval = settings.interval;

    this.filters.load(settings.filters);
    this.options.load(settings.options);
    this.resources.load(settings.resources);
  }

  static toLegacyOptions(settings: EngineSettings, subject: LegacyStorage) {
    subject.interval = settings.interval;
    subject.toggles.engine = settings.enabled;

    FilterSettings.toLegacyOptions(settings.filters, subject);
    OptionsSettings.toLegacyOptions(settings.options, subject);
    ResourcesSettings.toLegacyOptions(settings.resources, subject);
  }

  static fromLegacyOptions(subject: LegacyStorage) {
    const options = new EngineSettings();

    options.interval = subject.interval ?? options.interval;
    options.enabled = subject.toggles.engine ?? options.enabled;

    options.filters = FilterSettings.fromLegacyOptions(subject);
    options.options = OptionsSettings.fromLegacyOptions(subject);
    options.resources = ResourcesSettings.fromLegacyOptions(subject);

    return options;
  }
}
