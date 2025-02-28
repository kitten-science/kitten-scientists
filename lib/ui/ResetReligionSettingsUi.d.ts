import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { ResetReligionSettings } from "../settings/ResetReligionSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
export declare class ResetReligionSettingsUi extends IconSettingsPanel<ResetReligionSettings> {
  constructor(
    host: KittenScientists,
    settings: ResetReligionSettings,
    locale: SettingOptions<SupportedLocale>,
  );
  private _getResetOption;
}
//# sourceMappingURL=ResetReligionSettingsUi.d.ts.map
