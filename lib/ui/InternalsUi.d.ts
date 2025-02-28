import type { SupportedLocale } from "../Engine.js";
import { type KittenScientists } from "../KittenScientists.js";
import type { EngineSettings } from "../settings/EngineSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export declare class InternalsUi extends SettingsPanel<EngineSettings> {
  constructor(
    host: KittenScientists,
    settings: EngineSettings,
    locale: SettingOptions<SupportedLocale>,
  );
}
//# sourceMappingURL=InternalsUi.d.ts.map
