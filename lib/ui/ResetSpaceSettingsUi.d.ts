import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { ResetSpaceSettings } from "../settings/ResetSpaceSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
export declare class ResetSpaceSettingsUi extends IconSettingsPanel<ResetSpaceSettings> {
  constructor(
    host: KittenScientists,
    settings: ResetSpaceSettings,
    locale: SettingOptions<SupportedLocale>,
  );
  private _getResetOption;
}
//# sourceMappingURL=ResetSpaceSettingsUi.d.ts.map
