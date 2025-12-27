import { difference } from "@oliversalzburg/js-utils/data/array.js";
import { isNil, type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { cl } from "../tools/Log.js";
import type { GamePage } from "../types/game.js";
import { type UnsafeUpgrade, type Upgrade, Upgrades } from "../types/index.js";
import { SettingTrigger } from "./Settings.js";

export class UpgradeSettingsItem extends SettingTrigger {
  readonly #upgrade: Upgrade;
  #$upgrade: UnsafeUpgrade | undefined;

  get upgrade() {
    return this.#upgrade;
  }
  get $upgrade() {
    return this.#$upgrade;
  }
  set $upgrade(value: UnsafeUpgrade | undefined) {
    this.#$upgrade = value;
  }

  constructor(upgrade: Upgrade, enabled = false) {
    super(enabled, -1);
    this.#upgrade = upgrade;
  }
}

export type UpgradeSettingsItems = Record<Upgrade, UpgradeSettingsItem>;

export class UpgradeSettings extends SettingTrigger {
  readonly upgrades: UpgradeSettingsItems;

  constructor(enabled = false) {
    super(enabled, -1);
    this.upgrades = this.initUpgrades();
  }

  private initUpgrades(): UpgradeSettingsItems {
    const items = {} as UpgradeSettingsItems;
    for (const item of Upgrades) {
      items[item] = new UpgradeSettingsItem(item);
    }
    return items;
  }

  static validateGame(game: GamePage, settings: UpgradeSettings) {
    const inSettings = Object.keys(settings.upgrades);
    const inGame = game.workshop.upgrades.map(upgrade => upgrade.name);

    const missingInSettings = difference(inGame, inSettings);
    const redundantInSettings = difference(inSettings, inGame);

    for (const _ of missingInSettings) {
      console.warn(...cl(`The workshop upgrade '${_}' is not tracked in Kitten Scientists!`));
    }
    for (const _ of redundantInSettings) {
      console.warn(...cl(`The workshop upgrade '${_}' is not an upgrade in Kittens Game!`));
    }
  }

  load(settings: Maybe<Partial<UpgradeSettings>>) {
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
