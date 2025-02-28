import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { TimeControlSettings } from "../settings/TimeControlSettings.js";
import type { TimeSkipSettings } from "../settings/TimeSkipSettings.js";
import { type PanelOptions } from "./components/CollapsiblePanel.js";
import { SettingMaxTriggerListItem } from "./components/SettingMaxTriggerListItem.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export declare class TimeSkipSettingsUi extends SettingsPanel<
  TimeSkipSettings,
  SettingMaxTriggerListItem
> {
  private readonly _cycles;
  private readonly _seasons;
  private readonly _activeHeatTransferUI;
  constructor(
    host: KittenScientists,
    settings: TimeSkipSettings,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: TimeControlSettings,
    options?: PanelOptions,
  );
}
//# sourceMappingURL=TimeSkipSettingsUi.d.ts.map
