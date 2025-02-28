import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { UpgradeSettings } from "../settings/UpgradeSettings.js";
import type { PanelOptions } from "./components/CollapsiblePanel.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export declare class UpgradeSettingsUi extends SettingsPanel<UpgradeSettings> {
  constructor(
    host: KittenScientists,
    settings: UpgradeSettings,
    locale: SettingOptions<SupportedLocale>,
    options?: PanelOptions,
  );
}
//# sourceMappingURL=UpgradeSettingsUi.d.ts.map
