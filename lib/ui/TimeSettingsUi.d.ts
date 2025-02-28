import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { TimeSettings } from "../settings/TimeSettings.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export declare class TimeSettingsUi extends SettingsPanel<TimeSettings> {
  constructor(
    host: KittenScientists,
    settings: TimeSettings,
    locale: SettingOptions<SupportedLocale>,
  );
}
//# sourceMappingURL=TimeSettingsUi.d.ts.map
