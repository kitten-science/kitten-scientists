import { difference } from "@oliversalzburg/js-utils/data/array.js";
import { Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { cwarn } from "../tools/Log.js";
import { Game, ResourceCraftable, ResourcesCraftable } from "../types/index.js";
import { Setting, SettingLimitedMax, SettingTrigger } from "./Settings.js";
import { UpgradeSettings } from "./UpgradeSettings.js";

export class CraftSettingsItem extends SettingLimitedMax {
  readonly #resource: ResourceCraftable;

  get resource() {
    return this.#resource;
  }

  constructor(resource: ResourceCraftable, enabled = true, limited = true) {
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
    trigger = 0.95,
    unlockUpgrades = new UpgradeSettings(),
    shipOverride = new Setting(true),
  ) {
    super(enabled, trigger);
    this.resources = this.initResources();
    this.shipOverride = shipOverride;
    this.unlockUpgrades = unlockUpgrades;
  }

  private initResources(): WorkshopResourceSettings {
    const items = {} as WorkshopResourceSettings;
    ResourcesCraftable.forEach(item => {
      items[item] = new CraftSettingsItem(item, true, item !== "parchment");
    });
    return items;
  }

  static validateGame(game: Game, settings: WorkshopSettings) {
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

  load(settings: Maybe<Partial<WorkshopSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.resources, settings.resources, (resource, item) => {
      resource.enabled = item?.enabled ?? resource.enabled;
      resource.limited = item?.limited ?? resource.limited;
      resource.max = item?.max ?? resource.max;
    });

    this.unlockUpgrades.load(settings.unlockUpgrades);

    this.shipOverride.enabled = settings.shipOverride?.enabled ?? this.shipOverride.enabled;
  }
}
