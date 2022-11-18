import { isNil, Maybe } from "../tools/Maybe";
import { FilterSettings } from "./FilterSettings";
import { ResourcesSettings } from "./ResourcesSettings";
import { Setting } from "./Settings";
import { LegacyStorage } from "./SettingsStorage";

export class EngineSettings extends Setting {
  /**
   * The interval at which the internal processing loop is run, in milliseconds.
   */
  interval = 2000;

  filters: FilterSettings;
  resources: ResourcesSettings;

  constructor(
    enabled = false,
    filters = new FilterSettings(),
    resources = new ResourcesSettings()
  ) {
    super(enabled);
    this.filters = filters;
    this.resources = resources;
  }

  load(settings: Maybe<Partial<EngineSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    this.interval = settings.interval ?? this.interval;

    this.filters.load(settings.filters);
    this.resources.load(settings.resources);
  }

  static toLegacyOptions(settings: EngineSettings, subject: LegacyStorage) {
    subject.interval = settings.interval;
    subject.toggles.engine = settings.enabled;

    FilterSettings.toLegacyOptions(settings.filters, subject);
    ResourcesSettings.toLegacyOptions(settings.resources, subject);
  }

  static fromLegacyOptions(subject: LegacyStorage) {
    const options = new EngineSettings();

    options.interval = subject.interval ?? options.interval;
    options.enabled = subject.toggles.engine ?? options.enabled;

    options.filters = FilterSettings.fromLegacyOptions(subject);
    options.resources = ResourcesSettings.fromLegacyOptions(subject);

    return options;
  }
}
