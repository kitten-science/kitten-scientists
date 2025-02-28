import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { ResetTimeSettings } from "../settings/ResetTimeSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
export declare class ResetTimeSettingsUi extends IconSettingsPanel<ResetTimeSettings> {
  constructor(
    host: KittenScientists,
    settings: ResetTimeSettings,
    locale: SettingOptions<SupportedLocale>,
  );
  private _getResetOption;
}
//# sourceMappingURL=ResetTimeSettingsUi.d.ts.map
