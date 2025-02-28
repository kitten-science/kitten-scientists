import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { ResetBonfireSettings } from "./ResetBonfireSettings.js";
import { ResetReligionSettings } from "./ResetReligionSettings.js";
import { ResetResourcesSettings } from "./ResetResourcesSettings.js";
import { ResetSpaceSettings } from "./ResetSpaceSettings.js";
import { ResetTimeSettings } from "./ResetTimeSettings.js";
import { ResetUpgradeSettings } from "./ResetUpgradeSettings.js";
import { Setting } from "./Settings.js";
export class ResetSettings extends Setting {
  bonfire;
  religion;
  resources;
  space;
  time;
  upgrades;
  constructor(
    enabled = false,
    bonfire = new ResetBonfireSettings(),
    religion = new ResetReligionSettings(),
    resources = new ResetResourcesSettings(),
    space = new ResetSpaceSettings(),
    time = new ResetTimeSettings(),
    upgrades = new ResetUpgradeSettings(),
  ) {
    super(enabled);
    this.bonfire = bonfire;
    this.religion = religion;
    this.resources = resources;
    this.space = space;
    this.time = time;
    this.upgrades = upgrades;
  }
  load(settings) {
    if (isNil(settings)) {
      return;
    }
    super.load(settings);
    this.bonfire.load(settings.bonfire);
    this.religion.load(settings.religion);
    this.resources.load(settings.resources);
    this.space.load(settings.space);
    this.time.load(settings.time);
    this.upgrades.load(settings.upgrades);
  }
}
//# sourceMappingURL=ResetSettings.js.map
