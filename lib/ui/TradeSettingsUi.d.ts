import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { TradeSettings } from "../settings/TradeSettings.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export declare class TradeSettingsUi extends SettingsPanel<TradeSettings> {
  constructor(
    host: KittenScientists,
    settings: TradeSettings,
    locale: SettingOptions<SupportedLocale>,
  );
  private _getTradeOption;
}
//# sourceMappingURL=TradeSettingsUi.d.ts.map
