import type { KittenScientists } from "../KittenScientists.js";
import type { MissionSettings } from "../settings/MissionSettings.js";
import type { PanelOptions } from "./components/CollapsiblePanel.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export declare class MissionSettingsUi extends SettingsPanel<MissionSettings> {
  private readonly _missions;
  constructor(host: KittenScientists, settings: MissionSettings, options?: PanelOptions);
}
//# sourceMappingURL=MissionSettingsUi.d.ts.map
