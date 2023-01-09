import { isNil, Maybe } from "../tools/Maybe";
import { LogFilterSettings } from "./LogFilterSettings";
import { ResourcesSettings } from "./ResourcesSettings";
import { Setting } from "./Settings";
import { LegacyStorage } from "./SettingsStorage";
import { StateSettings } from "./StateSettings";

export class EngineSettings extends Setting {
  /**
   * The interval at which the internal processing loop is run, in milliseconds.
   */
  interval = 2000;

  filters: LogFilterSettings;
  resources: ResourcesSettings;
  readonly states: StateSettings;

  constructor(
    enabled = false,
    filters = new LogFilterSettings(),
    resources = new ResourcesSettings(),
    states = new StateSettings()
  ) {
    super(enabled);
    this.filters = filters;
    this.resources = resources;
    this.states = states;
  }

  load(settings: Maybe<Partial<EngineSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    this.interval = settings.interval ?? this.interval;

    this.filters.load(settings.filters);
    this.resources.load(settings.resources);
    this.states.load(settings.states);
  }

  static fromLegacyOptions(subject: LegacyStorage) {
    const options = new EngineSettings();

    options.interval = subject.interval ?? options.interval;
    options.enabled = subject.toggles.engine ?? options.enabled;

    options.filters = LogFilterSettings.fromLegacyOptions(subject);
    options.resources = ResourcesSettings.fromLegacyOptions(subject);

    return options;
  }
}
