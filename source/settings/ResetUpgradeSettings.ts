import { type Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { type Upgrade, Upgrades } from "../types/index.js";
import { Setting } from "./Settings.js";

export class ResetUpgradeSettingsItem extends Setting {
  readonly #upgrade: Upgrade;

  get upgrade() {
    return this.#upgrade;
  }

  constructor(upgrade: Upgrade, enabled = false) {
    super(enabled);
    this.#upgrade = upgrade;
  }
}

export type ResetUpgradeSettingsItems = Record<Upgrade, ResetUpgradeSettingsItem>;

export class ResetUpgradeSettings extends Setting {
  readonly upgrades: ResetUpgradeSettingsItems;

  constructor(enabled = false) {
    super(enabled);
    this.upgrades = this.initUpgrades();
  }

  private initUpgrades(): ResetUpgradeSettingsItems {
    const items = {} as ResetUpgradeSettingsItems;
    for (const item of Upgrades) {
      items[item] = new ResetUpgradeSettingsItem(item);
    }
    return items;
  }

  load(settings: Maybe<Partial<ResetUpgradeSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.upgrades, settings.upgrades, (upgrade, item) => {
      upgrade.enabled = item?.enabled ?? upgrade.enabled;
    });
  }
}
