import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { ResetBonfireSettings } from "../settings/ResetBonfireSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
export declare class ResetBonfireSettingsUi extends IconSettingsPanel<ResetBonfireSettings> {
  private readonly _buildings;
  constructor(
    host: KittenScientists,
    settings: ResetBonfireSettings,
    locale: SettingOptions<SupportedLocale>,
  );
  private _getResetOption;
}
//# sourceMappingURL=ResetBonfireSettingsUi.d.ts.map
