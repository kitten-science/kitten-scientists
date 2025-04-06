import { difference } from "@oliversalzburg/js-utils/data/array.js";
import { isNil, type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { cl } from "../tools/Log.js";
import type { GamePage } from "../types/game.js";
import { type ResourceCraftable, ResourcesCraftable } from "../types/index.js";
import { Setting, SettingLimitedMaxTrigger, SettingTrigger } from "./Settings.js";
import { UpgradeSettings } from "./UpgradeSettings.js";

export class CraftSettingsItem extends SettingLimitedMaxTrigger {
  readonly #resource: ResourceCraftable;

  get resource() {
    return this.#resource;
  }

  constructor(resource: ResourceCraftable, enabled = false, limited = true) {
    super(enabled, limited);
    this.#resource = resource;
  }
}

export type WorkshopResourceSettings = Record<ResourceCraftable, CraftSettingsItem>;

export class WorkshopSettings extends SettingTrigger {
  resources: WorkshopResourceSettings;

  shipOverride: Setting;
  unlockUpgrades: UpgradeSettings;

  constructor(
    enabled = false,
    trigger = -1,
    unlockUpgrades = new UpgradeSettings(),
    shipOverride = new Setting(),
  ) {
    super(enabled, trigger);
    this.resources = this.initResources();
    this.shipOverride = shipOverride;
    this.unlockUpgrades = unlockUpgrades;
  }

  private initResources(): WorkshopResourceSettings {
    const items = {} as WorkshopResourceSettings;
    for (const item of ResourcesCraftable) {
      items[item] = new CraftSettingsItem(item);
    }
    return items;
  }

  static validateGame(game: GamePage, settings: WorkshopSettings) {
    const inSettings = Object.keys(settings.resources);
    const inGame = game.workshop.crafts.map(craft => craft.name);

    const missingInSettings = difference(inGame, inSettings);
    const redundantInSettings = difference(inSettings, inGame);

    for (const craft of missingInSettings) {
      console.warn(...cl(`The workshop craft '${craft}' is not tracked in Kitten Scientists!`));
    }
    for (const craft of redundantInSettings) {
      console.warn(...cl(`The workshop craft '${craft}' is not an upgrade in Kittens Game!`));
    }

    UpgradeSettings.validateGame(game, settings.unlockUpgrades);
  }

  load(settings: Maybe<Partial<WorkshopSettings>>) {
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
