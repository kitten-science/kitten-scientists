import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import { ReligionSettings } from "../settings/ReligionSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export declare class ReligionSettingsUi extends SettingsPanel<ReligionSettings> {
  private readonly _unicornBuildings;
  private readonly _bestUnicornBuilding;
  constructor(
    host: KittenScientists,
    settings: ReligionSettings,
    locale: SettingOptions<SupportedLocale>,
  );
  refreshUi(): void;
}
//# sourceMappingURL=ReligionSettingsUi.d.ts.map
