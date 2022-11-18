import { TickContext } from "./Engine";
import { ScienceSettings } from "./settings/ScienceSettings";
import { TabManager } from "./TabManager";
import { cerror } from "./tools/Log";
import { isNil } from "./tools/Maybe";
import { PolicyInfo, ScienceTab, TechInfo } from "./types";
import { UpgradeManager } from "./UpgradeManager";
import { UserScript } from "./UserScript";
import { WorkshopManager } from "./WorkshopManager";

export class ScienceManager extends UpgradeManager {
  readonly manager: TabManager<ScienceTab>;
  settings: ScienceSettings;
  private readonly _workshopManager: WorkshopManager;

  constructor(
    host: UserScript,
    workshopManager: WorkshopManager,
    settings = new ScienceSettings()
  ) {
    super(host);
    this.settings = settings;
    this.manager = new TabManager(this._host, "Science");
    this._workshopManager = workshopManager;
  }

  async tick(context: TickContext) {
    if (!this.settings.enabled) {
      return;
    }

    // If techs (science items) are enabled...
    if (this.settings.techs.enabled && this._host.gamePage.tabs[2].visible) {
      await this.autoUnlock();
    }

    if (this.settings.policies.enabled && this._host.gamePage.tabs[2].visible) {
      await this.autoPolicy();
    }

    // Observe astronomical events.
    if (this.settings.observe.enabled) {
      this.observeStars();
    }
  }

  load(settings: ScienceSettings) {
    this.settings.load(settings);
  }

  async autoUnlock() {
    this.manager.render();

    const techs = this._host.gamePage.science.techs;
    const toUnlock = new Array<TechInfo>();

    workLoop: for (const setting of Object.values(this.settings.techs.techs)) {
      if (!setting.enabled) {
        continue;
      }

      const tech = techs.find(subject => subject.name === setting.tech);
      if (isNil(tech)) {
        cerror(`Tech '${setting.tech}' not found in game!`);
        continue;
      }

      if (tech.researched || !tech.unlocked) {
        continue;
      }

      let prices = UserScript.window.dojo.clone(tech.prices);
      prices = this._host.gamePage.village.getEffectLeader("scientist", prices);
      for (const resource of prices) {
        if (this._workshopManager.getValueAvailable(resource.name, true) < resource.val) {
          continue workLoop;
        }
      }

      toUnlock.push(tech);
    }

    for (const item of toUnlock) {
      await this.upgrade(item, "science");
    }
  }

  async autoPolicy() {
    this.manager.render();

    const policies = this._host.gamePage.science.policies;
    const toUnlock = new Array<PolicyInfo>();

    for (const setting of Object.values(this.settings.policies.policies)) {
      if (!setting.enabled) {
        continue;
      }

      const targetPolicy = policies.find(subject => subject.name === setting.policy);
      if (isNil(targetPolicy)) {
        cerror(`Policy '${setting.policy}' not found in game!`);
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

  /**
   * If there is currently an astronomical event, observe it.
   */
  observeStars(): void {
    if (this._host.gamePage.calendar.observeBtn !== null) {
      this._host.gamePage.calendar.observeHandler();
      this._host.engine.iactivity("act.observe", [], "ks-star");
      this._host.engine.storeForSummary("stars", 1);
    }
  }
}
