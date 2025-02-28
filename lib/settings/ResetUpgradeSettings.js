import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Upgrades } from "../types/index.js";
import { Setting } from "./Settings.js";
export class ResetUpgradeSettingsItem extends Setting {
  #upgrade;
  get upgrade() {
    return this.#upgrade;
  }
  constructor(upgrade, enabled = false) {
    super(enabled);
    this.#upgrade = upgrade;
  }
}
export class ResetUpgradeSettings extends Setting {
  upgrades;
  constructor(enabled = false) {
    super(enabled);
    this.upgrades = this.initUpgrades();
  }
  initUpgrades() {
    const items = {};
    for (const item of Upgrades) {
      items[item] = new ResetUpgradeSettingsItem(item);
    }
    return items;
  }
  load(settings) {
    if (isNil(settings)) {
      return;
    }
    super.load(settings);
    consumeEntriesPedantic(this.upgrades, settings.upgrades, (upgrade, item) => {
      upgrade.enabled = item?.enabled ?? upgrade.enabled;
    });
  }
}
//# sourceMappingURL=ResetUpgradeSettings.js.map
