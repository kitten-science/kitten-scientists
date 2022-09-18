import { PolicySettings } from "./options/PolicySettings";
import { TechSettings } from "./options/TechSettings";
import { TabManager } from "./TabManager";
import { objectEntries } from "./tools/Entries";
import { cerror } from "./tools/Log";
import { isNil } from "./tools/Maybe";
import { PolicyInfo, ScienceTab, TechInfo } from "./types";
import { UpgradeManager } from "./UpgradeManager";
import { UserScript } from "./UserScript";
import { WorkshopManager } from "./WorkshopManager";

export class ScienceManager extends UpgradeManager {
  readonly manager: TabManager<ScienceTab>;
  private readonly _workshopManager: WorkshopManager;

  constructor(host: UserScript) {
    super(host);
    this.manager = new TabManager(this._host, "Science");
    this._workshopManager = new WorkshopManager(this._host);
  }

  async autoUnlock() {
    this.manager.render();

    const techs = this._host.gamePage.science.techs;
    const toUnlock = new Array<TechInfo>();

    workLoop: for (const [item, options] of objectEntries(
      (this._host.options.auto.unlock.items.techs as TechSettings).items
    )) {
      if (!options.enabled) {
        continue;
      }

      const upgrade = techs.find(subject => subject.name === item);
      if (isNil(upgrade)) {
        cerror(`Tech '${item}' not found in game!`);
        continue;
      }

      if (upgrade.researched || !upgrade.unlocked) {
        continue;
      }

      let prices = dojo.clone(upgrade.prices);
      prices = this._host.gamePage.village.getEffectLeader("scientist", prices);
      for (const resource of prices) {
        if (this._workshopManager.getValueAvailable(resource.name, true) < resource.val) {
          continue workLoop;
        }
      }

      toUnlock.push(upgrade);
    }

    for (const item of toUnlock) {
      await this.upgrade(item, "science");
    }
  }

  async autoPolicy() {
    this.manager.render();

    const policies = this._host.gamePage.science.policies;
    const toUnlock = new Array<PolicyInfo>();

    for (const [item, options] of objectEntries(
      (this._host.options.auto.unlock.items.policies as PolicySettings).items
    )) {
      if (!options.enabled) {
        continue;
      }

      const targetPolicy = policies.find(subject => subject.name === item);
      if (isNil(targetPolicy)) {
        cerror(`Policy '${item}' not found in game!`);
        continue;
      }

      if (!targetPolicy.researched && !targetPolicy.blocked && targetPolicy.unlocked) {
        if (
          targetPolicy.requiredLeaderJob === undefined ||
          (this._host.gamePage.village.leader !== null &&
            this._host.gamePage.village.leader.job === targetPolicy.requiredLeaderJob)
        ) {
          toUnlock.push(targetPolicy);
        }
      }
    }

    for (const item of toUnlock) {
      await this.upgrade(item, "policy");
    }
  }
}
