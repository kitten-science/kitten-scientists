import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { ResetUpgradeSettings } from "../settings/ResetUpgradeSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
export declare class ResetUpgradesSettingsUi extends IconSettingsPanel<ResetUpgradeSettings> {
  constructor(
    host: KittenScientists,
    settings: ResetUpgradeSettings,
    locale: SettingOptions<SupportedLocale>,
  );
  private _getResetOption;
}
//# sourceMappingURL=ResetUpgradesSettingsUi.d.ts.map
