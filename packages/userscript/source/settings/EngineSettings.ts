import { isNil, Maybe } from "../tools/Maybe";
import { LogFilterSettings } from "./LogFilterSettings";
import { ResourcesSettings } from "./ResourcesSettings";
import { Setting } from "./Settings";
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

  load(settings: Maybe<Partial<EngineSettings>>, retainMetaBehavior = false) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    if (!retainMetaBehavior) {
      this.interval = settings.interval ?? this.interval;
      this.states.load(settings.states);
    }

    this.filters.load(settings.filters);
    this.resources.load(settings.resources);
  }
}
