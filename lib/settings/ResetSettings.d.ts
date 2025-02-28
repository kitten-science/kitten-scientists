import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { ResetBonfireSettings } from "./ResetBonfireSettings.js";
import { ResetReligionSettings } from "./ResetReligionSettings.js";
import { ResetResourcesSettings } from "./ResetResourcesSettings.js";
import { ResetSpaceSettings } from "./ResetSpaceSettings.js";
import { ResetTimeSettings } from "./ResetTimeSettings.js";
import { ResetUpgradeSettings } from "./ResetUpgradeSettings.js";
import { Setting } from "./Settings.js";
export declare class ResetSettings extends Setting {
  bonfire: ResetBonfireSettings;
  religion: ResetReligionSettings;
  resources: ResetResourcesSettings;
  space: ResetSpaceSettings;
  time: ResetTimeSettings;
  upgrades: ResetUpgradeSettings;
  constructor(
    enabled?: boolean,
    bonfire?: ResetBonfireSettings,
    religion?: ResetReligionSettings,
    resources?: ResetResourcesSettings,
    space?: ResetSpaceSettings,
    time?: ResetTimeSettings,
    upgrades?: ResetUpgradeSettings,
  );
  load(settings: Maybe<Partial<ResetSettings>>): void;
}
//# sourceMappingURL=ResetSettings.d.ts.map
