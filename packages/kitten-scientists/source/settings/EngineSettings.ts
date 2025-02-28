import { type Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import { FallbackLocale } from "../UserScriptLoader.js";
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
  locale: SettingOptions<SupportedLocale>;

  ksColumn: Setting;

  filters: LogFilterSettings;
  resources: ResourcesSettings;
  readonly states: StateSettings;

  constructor(
    enabled = false,
    filters = new LogFilterSettings(),
    resources = new ResourcesSettings(),
    states = new StateSettings(),
    language = FallbackLocale,
    ksColumn = new Setting(),
  ) {
    super(enabled);
    this.filters = filters;
    this.resources = resources;
    this.states = states;
    this.locale = new SettingOptions<SupportedLocale>(language, [
      { label: "Deutsch", value: "de-DE" },
      { label: "English", value: "en-US" },
      { label: "עִברִית", value: "he-IL" },
      { label: "中文", value: "zh-CN" },
    ]);
    this.ksColumn = ksColumn;
  }

  load(settings: Maybe<Partial<EngineSettings>>, retainMetaBehavior = false) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    if (!retainMetaBehavior) {
      this.interval = settings.interval ?? this.interval;
      this.states.load(settings.states);
      this.locale.load(settings.locale);
      this.ksColumn.load(settings.ksColumn);
    }

    this.filters.load(settings.filters);
    this.resources.load(settings.resources);
  }
}
