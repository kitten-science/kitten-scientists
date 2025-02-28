import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { EmbassySettings } from "../settings/EmbassySettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { PanelOptions } from "./components/CollapsiblePanel.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export declare class EmbassySettingsUi extends SettingsPanel<EmbassySettings> {
  constructor(
    host: KittenScientists,
    settings: EmbassySettings,
    locale: SettingOptions<SupportedLocale>,
    options?: PanelOptions,
  );
  private _makeEmbassySetting;
}
//# sourceMappingURL=EmbassySettingsUi.d.ts.map
