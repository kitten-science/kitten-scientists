import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import { LogFilterSettings } from "./LogFilterSettings.js";
import { ResourcesSettings } from "./ResourcesSettings.js";
import { Setting, SettingOptions } from "./Settings.js";
import { StateSettings } from "./StateSettings.js";
export declare class EngineSettings extends Setting {
  /**
   * The interval at which the internal processing loop is run, in milliseconds.
   */
  interval: number;
  /**
   * The currently selected language.
   */
  locale: SettingOptions<SupportedLocale>;
  ksColumn: Setting;
  filters: LogFilterSettings;
  resources: ResourcesSettings;
  readonly states: StateSettings;
  constructor(
    enabled?: boolean,
    filters?: LogFilterSettings,
    resources?: ResourcesSettings,
    states?: StateSettings,
    language?: SupportedLocale,
    ksColumn?: Setting,
  );
  load(settings: Maybe<Partial<EngineSettings>>, retainMetaBehavior?: boolean): void;
}
//# sourceMappingURL=EngineSettings.d.ts.map
