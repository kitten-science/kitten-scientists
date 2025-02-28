import type { KittenScientists } from "../KittenScientists.js";
import type { EngineSettings } from "../settings/EngineSettings.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { ExpandoButton } from "./components/buttons/ExpandoButton.js";
export declare class EngineSettingsUi extends SettingListItem {
  readonly expando: ExpandoButton;
  constructor(host: KittenScientists, settings: EngineSettings);
}
//# sourceMappingURL=EngineSettingsUi.d.ts.map
