import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { SettingOptions } from "../settings/Settings.js";
import { WorkshopSettings } from "../settings/WorkshopSettings.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export declare class WorkshopSettingsUi extends SettingsPanel<WorkshopSettings> {
  private readonly _crafts;
  constructor(
    host: KittenScientists,
    settings: WorkshopSettings,
    locale: SettingOptions<SupportedLocale>,
  );
}
//# sourceMappingURL=WorkshopSettingsUi.d.ts.map
