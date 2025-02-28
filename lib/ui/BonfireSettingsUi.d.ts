import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import { BonfireSettings } from "../settings/BonfireSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export declare class BonfireSettingsUi extends SettingsPanel<BonfireSettings> {
  constructor(
    host: KittenScientists,
    settings: BonfireSettings,
    locale: SettingOptions<SupportedLocale>,
  );
  private _getBuildOptions;
}
//# sourceMappingURL=BonfireSettingsUi.d.ts.map
