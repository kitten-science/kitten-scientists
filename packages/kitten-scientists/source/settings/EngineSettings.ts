import { SupportedLanguage } from "../Engine";
import { isNil, Maybe } from "../tools/Maybe";
import { FallbackLanguage } from "../UserScript";
import { LogFilterSettings } from "./LogFilterSettings";
import { ResourcesSettings } from "./ResourcesSettings";
import { Setting, SettingOptions } from "./Settings";
import { StateSettings } from "./StateSettings";

export class EngineSettings extends Setting {
  /**
   * The interval at which the internal processing loop is run, in milliseconds.
   */
  interval = 2000;

  /**
   * The currently selected language.
   */
  language: SettingOptions<SupportedLanguage>;

  filters: LogFilterSettings;
  resources: ResourcesSettings;
  readonly states: StateSettings;

  constructor(
    enabled = false,
    filters = new LogFilterSettings(),
    resources = new ResourcesSettings(),
    states = new StateSettings(),
    language = FallbackLanguage
  ) {
    super(enabled);
    this.filters = filters;
    this.resources = resources;
    this.states = states;
    this.language = new SettingOptions<SupportedLanguage>(language, [
      { label: "Deutsch", value: "de" },
      { label: "English", value: "en" },
      { label: "עִברִית", value: "he" },
      { label: "中文", value: "zh" },
    ]);
  }

  load(settings: Maybe<Partial<EngineSettings>>, retainMetaBehavior = false) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    if (!retainMetaBehavior) {
      this.interval = settings.interval ?? this.interval;
      this.states.load(settings.states);
      this.language.load(settings.language);
    }

    this.filters.load(settings.filters);
    this.resources.load(settings.resources);
  }
}
