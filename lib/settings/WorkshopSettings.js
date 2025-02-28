import { difference } from "@oliversalzburg/js-utils/data/array.js";
import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { cwarn } from "../tools/Log.js";
import { ResourcesCraftable } from "../types/index.js";
import { Setting, SettingLimitedMaxTrigger, SettingTrigger } from "./Settings.js";
import { UpgradeSettings } from "./UpgradeSettings.js";
export class CraftSettingsItem extends SettingLimitedMaxTrigger {
  #resource;
  get resource() {
    return this.#resource;
  }
  constructor(resource, enabled = false, limited = true) {
    super(enabled, limited);
    this.#resource = resource;
  }
}
export class WorkshopSettings extends SettingTrigger {
  resources;
  shipOverride;
  unlockUpgrades;
  constructor(
    enabled = false,
    trigger = 0.95,
    unlockUpgrades = new UpgradeSettings(),
    shipOverride = new Setting(),
  ) {
    super(enabled, trigger);
    this.resources = this.initResources();
    this.shipOverride = shipOverride;
    this.unlockUpgrades = unlockUpgrades;
  }
  initResources() {
    const items = {};
    for (const item of ResourcesCraftable) {
      items[item] = new CraftSettingsItem(item);
    }
    return items;
  }
  static validateGame(game, settings) {
    const inSettings = Object.keys(settings.resources);
    const inGame = game.workshop.crafts.map(craft => craft.name);
    const missingInSettings = difference(inGame, inSettings);
    const redundantInSettings = difference(inSettings, inGame);
    for (const craft of missingInSettings) {
      cwarn(`The workshop craft '${craft}' is not tracked in Kitten Scientists!`);
    }
    for (const craft of redundantInSettings) {
      cwarn(`The workshop craft '${craft}' is not an upgrade in Kittens Game!`);
    }
    UpgradeSettings.validateGame(game, settings.unlockUpgrades);
  }
  load(settings) {
    if (isNil(settings)) {
      return;
    }
    super.load(settings);
    consumeEntriesPedantic(this.resources, settings.resources, (resource, item) => {
      resource.enabled = item?.enabled ?? resource.enabled;
      resource.limited = item?.limited ?? resource.limited;
      resource.max = item?.max ?? resource.max;
      resource.trigger = item?.trigger ?? resource.trigger;
    });
    this.unlockUpgrades.load(settings.unlockUpgrades);
    this.shipOverride.enabled = settings.shipOverride?.enabled ?? this.shipOverride.enabled;
  }
}
//# sourceMappingURL=WorkshopSettings.js.map
