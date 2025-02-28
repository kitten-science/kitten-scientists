import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { TimeControlSettings } from "../settings/TimeControlSettings.js";
import type { TimeSkipHeatSettings } from "../settings/TimeSkipHeatSettings.js";
import type { TimeSkipSettings } from "../settings/TimeSkipSettings.js";
import type { PanelOptions } from "./components/CollapsiblePanel.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export declare class TimeSkipHeatSettingsUi extends SettingsPanel<TimeSkipHeatSettings> {
  constructor(
    host: KittenScientists,
    settings: TimeSkipHeatSettings,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: TimeSkipSettings,
    sectionParentSetting: TimeControlSettings,
    options?: PanelOptions,
  );
}
//# sourceMappingURL=TimeSkipHeatSettingsUi.d.ts.map
