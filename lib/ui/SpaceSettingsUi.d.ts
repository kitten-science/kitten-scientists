import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { SettingOptions } from "../settings/Settings.js";
import { SpaceSettings } from "../settings/SpaceSettings.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export declare class SpaceSettingsUi extends SettingsPanel<SpaceSettings> {
  private readonly _missionsUi;
  constructor(
    host: KittenScientists,
    settings: SpaceSettings,
    locale: SettingOptions<SupportedLocale>,
  );
}
//# sourceMappingURL=SpaceSettingsUi.d.ts.map
