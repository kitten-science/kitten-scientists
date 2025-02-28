import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { PolicySettings } from "../settings/PolicySettings.js";
import type { ScienceSettings } from "../settings/ScienceSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { PanelOptions } from "./components/CollapsiblePanel.js";
import { type SettingListItemOptions } from "./components/SettingListItem.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export declare class PolicySettingsUi extends SettingsPanel<PolicySettings> {
  constructor(
    host: KittenScientists,
    settings: PolicySettings,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: ScienceSettings,
    options?: Partial<PanelOptions & SettingListItemOptions>,
  );
}
//# sourceMappingURL=PolicySettingsUi.d.ts.map
