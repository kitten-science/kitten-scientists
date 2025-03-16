import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { Engine, type FrameContext } from "./Engine.js";
import type { KittenScientists } from "./KittenScientists.js";
import { TabManager } from "./TabManager.js";
import { UpgradeManager } from "./UpgradeManager.js";
import { UserScriptLoader } from "./UserScriptLoader.js";
import type { WorkshopManager } from "./WorkshopManager.js";
import { ScienceSettings } from "./settings/ScienceSettings.js";
import { cerror } from "./tools/Log.js";
import type { Library, UnsafePolicy, UnsafeTech } from "./types/science.js";

export class ScienceManager extends UpgradeManager {
  readonly manager: TabManager<Library>;
  readonly settings: ScienceSettings;
  private readonly _workshopManager: WorkshopManager;

  constructor(
    host: KittenScientists,
    workshopManager: WorkshopManager,
    settings = new ScienceSettings(),
  ) {
    super(host);
    this.settings = settings;
    this.manager = new TabManager(this._host, "Science");
    this._workshopManager = workshopManager;
  }

  async tick(_context: FrameContext) {
    if (!this.settings.enabled) {
      return;
    }

    // We must call `.render()` here, because evaluation of availability of our options
    // is only performed when the game renders the contents of that tab.
    this.manager.render();

    // If techs (science items) are enabled...
    if (this.settings.techs.enabled && this._host.game.tabs[2].visible) {
      await this.autoUnlock();
    }

    if (this.settings.policies.enabled && this._host.game.tabs[2].visible) {
      await this.autoPolicy();
    }

    // Observe astronomical events.
    if (this.settings.observe.enabled) {
      this.observeStars();
    }
  }

  async autoUnlock() {
    const techs = this._host.game.science.techs;
    const toUnlock = new Array<UnsafeTech>();

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

      let prices = UserScriptLoader.window.dojo.clone(tech.prices);
      prices = this._host.game.village.getEffectLeader("scientist", prices);
      for (const price of prices) {
        const available = this._workshopManager.getValueAvailable(price.name);
        const resource = this._workshopManager.getResource(price.name);
        const trigger = Engine.evaluateSubSectionTrigger(
          this.settings.techs.trigger,
          setting.trigger,
        );
        if (trigger < 0 || available < resource.maxValue * trigger || available < price.val) {
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
    const policies = this._host.game.science.policies;
    const toUnlock = new Array<UnsafePolicy>();

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
          (this._host.game.village.leader !== null &&
            this._host.game.village.leader.job === targetPolicy.requiredLeaderJob)
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
    if (this._host.game.calendar.observeBtn !== null) {
      this._host.game.calendar.observeHandler();
      this._host.engine.iactivity("act.observe", [], "ks-star");
      this._host.engine.storeForSummary("stars", 1);
    }
  }
}
