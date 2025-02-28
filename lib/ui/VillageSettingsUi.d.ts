import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { VillageSettings } from "../settings/VillageSettings.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export declare class VillageSettingsUi extends SettingsPanel<VillageSettings> {
  private readonly _hunt;
  private readonly _festivals;
  private readonly _promoteKittens;
  private readonly _promoteLeader;
  private readonly _electLeader;
  constructor(
    host: KittenScientists,
    settings: VillageSettings,
    locale: SettingOptions<SupportedLocale>,
  );
  private _getDistributeOption;
}
//# sourceMappingURL=VillageSettingsUi.d.ts.map
