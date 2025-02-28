import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { ScienceSettings } from "../settings/ScienceSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export declare class ScienceSettingsUi extends SettingsPanel<ScienceSettings> {
  private readonly _policiesUi;
  private readonly _techsUi;
  private readonly _observeStars;
  constructor(
    host: KittenScientists,
    settings: ScienceSettings,
    locale: SettingOptions<SupportedLocale>,
  );
  refreshUi(): void;
}
//# sourceMappingURL=ScienceSettingsUi.d.ts.map
