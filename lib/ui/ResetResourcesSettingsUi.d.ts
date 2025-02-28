import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { ResetResourcesSettings } from "../settings/ResetResourcesSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
export declare class ResetResourcesSettingsUi extends IconSettingsPanel<ResetResourcesSettings> {
  constructor(
    host: KittenScientists,
    settings: ResetResourcesSettings,
    locale: SettingOptions<SupportedLocale>,
  );
}
//# sourceMappingURL=ResetResourcesSettingsUi.d.ts.map
