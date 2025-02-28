import { difference } from "@oliversalzburg/js-utils/data/array.js";
import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { cwarn } from "../tools/Log.js";
import { Upgrades } from "../types/index.js";
import { SettingTrigger } from "./Settings.js";
export class UpgradeSettingsItem extends SettingTrigger {
  #upgrade;
  get upgrade() {
    return this.#upgrade;
  }
  constructor(upgrade, enabled = false) {
    super(enabled, -1);
    this.#upgrade = upgrade;
  }
}
export class UpgradeSettings extends SettingTrigger {
  upgrades;
  constructor(enabled = false) {
    super(enabled, 0);
    this.upgrades = this.initUpgrades();
  }
  initUpgrades() {
    const items = {};
    for (const item of Upgrades) {
      items[item] = new UpgradeSettingsItem(item);
    }
    return items;
  }
  static validateGame(game, settings) {
    const inSettings = Object.keys(settings.upgrades);
    const inGame = game.workshop.upgrades.map(upgrade => upgrade.name);
    const missingInSettings = difference(inGame, inSettings);
    const redundantInSettings = difference(inSettings, inGame);
    for (const upgrade of missingInSettings) {
      cwarn(`The workshop upgrade '${upgrade}' is not tracked in Kitten Scientists!`);
    }
    for (const upgrade of redundantInSettings) {
      cwarn(`The workshop upgrade '${upgrade}' is not an upgrade in Kittens Game!`);
    }
  }
  load(settings) {
    if (isNil(settings)) {
      return;
    }
    super.load(settings);
    consumeEntriesPedantic(this.upgrades, settings.upgrades, (upgrade, item) => {
      upgrade.enabled = item?.enabled ?? upgrade.enabled;
      upgrade.trigger = item?.trigger ?? upgrade.trigger;
    });
  }
}
//# sourceMappingURL=UpgradeSettings.js.map
