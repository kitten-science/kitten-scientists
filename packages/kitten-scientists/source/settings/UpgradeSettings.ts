import { difference } from "@oliversalzburg/js-utils/data/array.js";
import { Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { cwarn } from "../tools/Log.js";
import { Game, Upgrade, Upgrades } from "../types/index.js";
import { SettingTrigger } from "./Settings.js";

export class UpgradeSettingsItem extends SettingTrigger {
  readonly #upgrade: Upgrade;

  get upgrade() {
    return this.#upgrade;
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
    super(enabled, 0);
    this.upgrades = this.initUpgrades();
  }

  private initUpgrades(): UpgradeSettingsItems {
    const items = {} as UpgradeSettingsItems;
    Upgrades.forEach(item => {
      items[item] = new UpgradeSettingsItem(item, true);
    });
    return items;
  }

  static validateGame(game: Game, settings: UpgradeSettings) {
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
