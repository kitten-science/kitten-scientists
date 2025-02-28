import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { TimeControlSettings } from "../settings/TimeControlSettings.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export declare class TimeControlSettingsUi extends SettingsPanel<TimeControlSettings> {
  protected readonly _items: Array<SettingListItem>;
  private readonly _accelerateTime;
  private readonly _timeSkipUi;
  private readonly _resetUi;
  constructor(
    host: KittenScientists,
    settings: TimeControlSettings,
    locale: SettingOptions<SupportedLocale>,
  );
}
//# sourceMappingURL=TimeControlSettingsUi.d.ts.map
