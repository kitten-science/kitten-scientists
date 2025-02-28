import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { ResetSettings } from "../settings/ResetSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { PanelOptions } from "./components/CollapsiblePanel.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export declare class ResetSettingsUi extends SettingsPanel<ResetSettings> {
  private readonly _bonfireUi;
  private readonly _religionUi;
  private readonly _resourcesUi;
  private readonly _spaceUi;
  private readonly _timeUi;
  private readonly _upgradesUi;
  constructor(
    host: KittenScientists,
    settings: ResetSettings,
    locale: SettingOptions<SupportedLocale>,
    options?: PanelOptions,
  );
}
//# sourceMappingURL=ResetSettingsUi.d.ts.map
