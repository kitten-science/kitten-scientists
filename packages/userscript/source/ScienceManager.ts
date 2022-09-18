import { PolicySettings } from "./options/PolicySettings";
import { TabManager } from "./TabManager";
import { objectEntries } from "./tools/Entries";
import { cerror } from "./tools/Log";
import { isNil } from "./tools/Maybe";
import { PolicyInfo, ScienceTab } from "./types";
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

  autoUnlock() {
    this.manager.render();

    // These behave identically to the workshop uprades above.
    const scienceUpgrades = this._host.gamePage.science.techs;
    techLoop: for (const upgrade of scienceUpgrades) {
      if (upgrade.researched || !upgrade.unlocked) {
        continue;
      }

      let prices = dojo.clone(upgrade.prices);
      prices = this._host.gamePage.village.getEffectLeader("scientist", prices);
      for (const resource of prices) {
        if (this._workshopManager.getValueAvailable(resource.name, true) < resource.val) {
          continue techLoop;
        }
      }
      this.upgrade(upgrade, "science");
    }
  }

  autoPolicy() {
    this.manager.render();

    const policies = this._host.gamePage.science.policies;
    const toResearch = new Array<PolicyInfo>();

    for (const [policy, options] of objectEntries(
      (this._host.options.auto.unlock.items.policies as PolicySettings).items
    )) {
      if (!options.enabled) {
        continue;
      }

      const targetPolicy = policies.find(subject => subject.name === policy);
      if (isNil(targetPolicy)) {
        cerror(`Policy '${policy}' not found in game!`);
        continue;
      }

      if (!targetPolicy.researched && !targetPolicy.blocked && targetPolicy.unlocked) {
        if (
          targetPolicy.requiredLeaderJob === undefined ||
          (this._host.gamePage.village.leader !== null &&
            this._host.gamePage.village.leader.job === targetPolicy.requiredLeaderJob)
        ) {
          toResearch.push(targetPolicy);
        }
      }
    }

    for (const policy of toResearch) {
      this.upgrade(policy, "policy");
    }
  }
}
