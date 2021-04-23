import { BulkManager } from "./BulkManager";
import { CraftManager } from "./CraftManager";
import { TabManager } from "./TabManager";
import { mustExist } from "./tools/Maybe";
import {
  AbstractReligionUpgradeInfo,
  BuildButton,
  ReligionTab,
  ReligionUpgrades,
  TranscendenceUpgrades,
  UnicornItemVariant,
  ZiggurathUpgrades,
} from "./types";
import { UserScript } from "./UserScript";

export class ReligionManager {
  private readonly _host: UserScript;
  readonly manager: TabManager<ReligionTab>;
  private readonly _crafts: CraftManager;
  private readonly _bulkManager: BulkManager;

  constructor(host: UserScript) {
    this._host = host;
    this.manager = new TabManager(this._host, "Religion");
    this._crafts = new CraftManager(this._host);
    this._bulkManager = new BulkManager(this._host);
  }

  build(
    name: ReligionUpgrades | TranscendenceUpgrades | ZiggurathUpgrades,
    variant: UnicornItemVariant,
    amount: number
  ): void {
    const build = this.getBuild(name, variant);
    if (build === null) {
      throw new Error(`Unable to build '${name}'. Build information not available.`);
    }

    const button = this.getBuildButton(name, variant);
    if (!button || !button.model.enabled) return;

    const amountTemp = amount;
    const label = build.label;
    amount = this._bulkManager.construct(button.model, button, amount);
    if (amount !== amountTemp) {
      this._host.warning(`${label} Amount ordered: ${amountTemp} Amount Constructed: ${amount}`);
    }

    if (variant === UnicornItemVariant.OrderOfTheSun) {
      this._host.storeForSummary(label, amount, "faith");
      if (amount === 1) {
        this._host.iactivity("act.sun.discover", [label], "ks-faith");
      } else {
        this._host.iactivity("act.sun.discovers", [label, amount], "ks-faith");
      }
    } else {
      this._host.storeForSummary(label, amount, "build");
      if (amount === 1) {
        this._host.iactivity("act.build", [label], "ks-build");
      } else {
        this._host.iactivity("act.builds", [label, amount], "ks-build");
      }
    }
  }

  /**
   * Retrieve information about an upgrade.
   * @param name The name of the upgrade.
   * @param variant The variant of the upgrade.
   * @returns The build information for the upgrade.
   */
  getBuild(
    name: ReligionUpgrades | TranscendenceUpgrades | ZiggurathUpgrades,
    variant: UnicornItemVariant
  ): AbstractReligionUpgradeInfo | null {
    switch (variant) {
      case UnicornItemVariant.Ziggurat:
        return this._host.gamePage.religion.getZU(name as ZiggurathUpgrades);
      case UnicornItemVariant.OrderOfTheSun:
        return this._host.gamePage.religion.getRU(name as ReligionUpgrades);
      case UnicornItemVariant.Cryptotheology:
        return this._host.gamePage.religion.getTU(name as TranscendenceUpgrades);
    }
    return null;
  }

  /**
   * Find the button that allows purchasing a given upgrade.
   * @param name The name of the upgrade.
   * @param variant The variant of the upgrade.
   * @returns The button to buy the upgrade, or `null`.
   */
  getBuildButton(
    name: ReligionUpgrades | TranscendenceUpgrades | ZiggurathUpgrades,
    variant: UnicornItemVariant
  ): BuildButton | null {
    let buttons: Array<BuildButton>;
    switch (variant) {
      case UnicornItemVariant.Ziggurat:
        buttons = this.manager.tab.zgUpgradeButtons;
        break;
      case UnicornItemVariant.OrderOfTheSun:
        buttons = this.manager.tab.rUpgradeButtons;
        break;
      case UnicornItemVariant.Cryptotheology:
        buttons = this.manager.tab.children[0].children[0].children;
        break;
      default:
        throw new Error(`Invalid variant '${variant}'`);
    }

    const build = this.getBuild(name, variant);
    if (build === null) {
      throw new Error(`Unable to retrieve build information for '${name}'`);
    }

    for (const button of buttons) {
      const haystack = button.model.name;
      if (haystack.indexOf(build.label) !== -1) {
        return button;
      }
    }

    return null;
  }
}
