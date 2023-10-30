import { Maybe, isNil } from "@oliversalzburg/js-utils/nil.js";
import { SupportedLanguage } from "../Engine.js";
import { FallbackLanguage } from "../UserScript.js";
import { LogFilterSettings } from "./LogFilterSettings.js";
import { ResourcesSettings } from "./ResourcesSettings.js";
import { Setting, SettingOptions } from "./Settings.js";
import { StateSettings } from "./StateSettings.js";

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
    language = FallbackLanguage,
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
