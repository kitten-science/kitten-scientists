import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { ScienceSettings } from "../settings/ScienceSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { TechSettings } from "../settings/TechSettings.js";
import type { PanelOptions } from "./components/CollapsiblePanel.js";
import type { SettingListItemOptions } from "./components/SettingListItem.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export declare class TechSettingsUi extends SettingsPanel<TechSettings> {
  constructor(
    host: KittenScientists,
    settings: TechSettings,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: ScienceSettings,
    options?: Partial<PanelOptions & SettingListItemOptions>,
  );
}
//# sourceMappingURL=TechSettingsUi.d.ts.map
