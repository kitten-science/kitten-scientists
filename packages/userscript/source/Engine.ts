import { BonfireManager } from "./BonfireManager";
import { CacheManager } from "./CacheManager";
import { BonfireItem, BonfireSettingsItem } from "./options/BonfireSettings";
import { CraftSettingsItem } from "./options/CraftSettings";
import { SpaceItem, SpaceSettingsItem } from "./options/SpaceSettings";
import { ReligionManager } from "./ReligionManager";
import { ScienceManager } from "./ScienceManager";
import { SpaceManager } from "./SpaceManager";
import { TimeManager } from "./TimeManager";
import { mustExist } from "./tools/Maybe";
import { TradeManager } from "./TradeManager";
import { ResourceCraftable } from "./types";
import { UserScript } from "./UserScript";
import { VillageManager } from "./VillageManager";
import { WorkshopManager } from "./WorkshopManager";

export class Engine {
  private readonly _host: UserScript;
  private readonly _bonfireManager: BonfireManager;
  private readonly _spaceManager: SpaceManager;
  private readonly _tradeManager: TradeManager;
  private readonly _religionManager: ReligionManager;
  private readonly _timeManager: TimeManager;
  private readonly _scienceManager: ScienceManager;
  private readonly _workshopManager: WorkshopManager;
  private readonly _villageManager: VillageManager;
  private readonly _cacheManager: CacheManager;

  private _intervalMainLoop: number | undefined = undefined;

  constructor(host: UserScript) {
    this._host = host;

    // The managers are really weakly defined concepts.
    // Most commonly, they are a wrapper around the functionality of a KG tab.
    // Very often though, key functionality of the automation of the tab is located
    // in the Engine itself. This will likely be refactored.
    this._bonfireManager = new BonfireManager(this._host);
    this._villageManager = new VillageManager(this._host);
    this._scienceManager = new ScienceManager(this._host);
    this._workshopManager = new WorkshopManager(this._host);
    this._tradeManager = new TradeManager(this._host);
    this._religionManager = new ReligionManager(this._host);
    this._timeManager = new TimeManager(this._host);
    this._spaceManager = new SpaceManager(this._host);

    this._cacheManager = new CacheManager(this._host);
  }

  /**
   * Start the Kitten Scientists engine.
   *
   * @param msg Should we print to the log that the engine was started?
   */
  start(msg = true): void {
    if (this._intervalMainLoop) {
      return;
    }

    const loop = () => {
      const entry = Date.now();
      this._iterate()
        .then(() => {
          const exit = Date.now();
          const timeTaken = exit - entry;
          this._intervalMainLoop = setTimeout(
            loop,
            Math.max(10, this._host.options.interval - timeTaken)
          );
        })
        .catch(error => {
          this._host.warning(error as string);
        });
    };
    this._intervalMainLoop = setTimeout(loop, this._host.options.interval);

    if (msg) {
      this._host.imessage("status.ks.enable");
    }
  }

  /**
   * Stop the Kitten Scientists engine.
   *
   * @param msg Should we print to the log that the engine was stopped?
   */
  stop(msg = true): void {
    if (!this._intervalMainLoop) {
      return;
    }

    clearTimeout(this._intervalMainLoop);
    this._intervalMainLoop = undefined;

    if (msg) {
      this._host.imessage("status.ks.disable");
    }
  }

  /**
   * The main loop of the automation script.
   */
  private async _iterate(): Promise<void> {
    const subOptions = this._host.options.auto.options;

    // The order in which these actions are performed is probably
    // semi-intentional and should be preserved or improved.

    // Observe astronomical events.
    if (subOptions.enabled && subOptions.items.observe.enabled) {
      this.observeStars();
    }
    // Unlock upgrades.
    if (this._host.options.auto.unlock.enabled) {
      await this.unlock();
    }

    // Build bonfire buildings.
    if (this._host.options.auto.bonfire.enabled) {
      this.buildBonfire();
      this._bonfireManager.autoMisc();
    }
    // Build space buildings.
    if (this._host.options.auto.space.enabled) {
      this.buildSpace();
    }
    // Craft configured resources.
    if (this._host.options.auto.craft.enabled) {
      this.craft();

      if (this._host.options.auto.craft.addition.unlockUpgrades.enabled) {
        this._workshopManager.autoUnlock();
      }
    }

    // Trade with other races.
    if (this._host.options.auto.trade.enabled) {
      this.trade();
    }
    // Religion upgrades.
    if (this._host.options.auto.religion.enabled) {
      this.worship();
    }
    // Time buildings.
    if (this._host.options.auto.time.enabled) {
      this.chrono();
    }
    // Blackcoin trading.
    if (subOptions.enabled && subOptions.items.crypto.enabled) {
      this.crypto();
    }
    // Feed leviathans.
    if (subOptions.enabled && subOptions.items.autofeed.enabled) {
      this.autofeed();
    }

    // Distribute kittens to jobs.
    if (this._host.options.auto.village.enabled) {
      this.distributeKittens();

      // Go hunting.
      if (this._host.options.auto.village.addition.hunt.enabled) {
        this.hunt();
      }

      // Hold festival.
      if (this._host.options.auto.village.addition.holdFestivals.enabled) {
        this.holdFestival();
      }

      // Promote kittens.
      if (this._host.options.auto.village.addition.promoteLeader.enabled) {
        this.promote();
      }
    }
    // Time automations (Tempus Fugit & Shatter TC)
    if (this._host.options.auto.timeCtrl.enabled) {
      this.timeCtrl();
    }
    // Miscelaneous automations.
    if (subOptions.enabled) {
      this.miscOptions();
    }
    // Reset automation.
    if (
      this._host.options.auto.timeCtrl.enabled &&
      this._host.options.auto.timeCtrl.items.reset.enabled
    ) {
      await this.reset();
    }
  }

  async reset(): Promise<void> {
    await this._timeManager.autoReset(this);
  }

  /**
   * Perform time automation, like Tempus Fugit and TC shattering.
   */
  timeCtrl(): void {
    this._timeManager.autoTimeControl();
  }

  /**
   * Promote kittens.
   */
  promote(): void {
    this._villageManager.autoPromote();
  }

  /**
   * Distribute kittens to jobs.
   */
  distributeKittens(): void {
    this._villageManager.autoDistributeKittens();
  }

  /**
   * Feed leviathans.
   */
  autofeed(): void {
    this._tradeManager.autoFeedElders();
  }

  private waitForBestPrice = false;

  /**
   * Blackcoin trading automation.
   */
  crypto(): void {
    const coinPrice = this._host.gamePage.calendar.cryptoPrice;
    const relicsInitial = this._host.gamePage.resPool.get("relic").value;
    const coinsInitial = this._host.gamePage.resPool.get("blackcoin").value;
    let coinsExchanged = 0.0;
    let relicsExchanged = 0.0;

    // Waits for coin price to drop below a certain treshold before starting the exchange process
    if (this.waitForBestPrice === true && coinPrice < 860.0) {
      this.waitForBestPrice = false;
    }

    // All of this code is straight-forward. Buy low, sell high.

    // Exchanges up to a certain threshold, in order to keep a good exchange rate, then waits for a higher treshold before exchanging for relics.
    if (
      this.waitForBestPrice === false &&
      coinPrice < 950.0 &&
      (this._host.options.auto.options.items.crypto.subTrigger ?? 0) < relicsInitial
    ) {
      // function name changed in v1.4.8.0
      if (typeof this._host.gamePage.diplomacy.buyEcoin === "function") {
        this._host.gamePage.diplomacy.buyEcoin();
      } else {
        this._host.gamePage.diplomacy.buyBcoin();
      }

      const currentCoin = this._host.gamePage.resPool.get("blackcoin").value;
      coinsExchanged = Math.round(currentCoin - coinsInitial);
      this._host.iactivity("blackcoin.buy", [coinsExchanged]);
    } else if (coinPrice > 1050.0 && 0 < this._host.gamePage.resPool.get("blackcoin").value) {
      this.waitForBestPrice = true;

      // function name changed in v1.4.8.0
      if (typeof this._host.gamePage.diplomacy.sellEcoin === "function") {
        this._host.gamePage.diplomacy.sellEcoin();
      } else {
        this._host.gamePage.diplomacy.sellBcoin();
      }

      const relicsCurrent = mustExist(this._host.gamePage.resPool.get("relic")).value;
      relicsExchanged = Math.round(relicsCurrent - relicsInitial);

      this._host.iactivity("blackcoin.sell", [relicsExchanged]);
    }
  }

  /**
   * Perform all the religion automations.
   */
  worship(): void {
    this._religionManager.autoWorship();
  }

  /**
   * Build selected time-related buildings.
   */
  chrono(): void {
    this._timeManager.autoBuild();
  }

  /**
   * Upgrade all possible unlockables.
   */
  async unlock(): Promise<void> {
    const upgrades = this._host.options.auto.unlock.items;

    // If techs (science items) are enabled...
    if (upgrades.techs.enabled && this._host.gamePage.tabs[2].visible) {
      await this._scienceManager.autoUnlock();
    }

    if (upgrades.policies.enabled && this._host.gamePage.tabs[2].visible) {
      await this._scienceManager.autoPolicy();
    }
  }

  /**
   * Try to build some buildings.
   *
   * @param builds The buildings to build.
   */
  buildBonfire(
    builds: Partial<Record<BonfireItem, BonfireSettingsItem>> = this._host.options.auto.bonfire
      .items
  ): void {
    this._bonfireManager.autoBuild(builds);
  }

  /**
   * Build space buildings.
   * This is pretty much identical to the bonfire buildings.
   *
   * @param builds The buildings to build.
   */
  buildSpace(
    builds: Partial<Record<SpaceItem, SpaceSettingsItem>> = this._host.options.auto.space.items
  ): void {
    this._spaceManager.autoBuild(builds);

    if (this._host.options.auto.space.addition.unlockMissions.enabled) {
      this._spaceManager.autoUnlock();
    }
  }

  /**
   * Perform crafting as configured in the crafting options.
   *
   * @param crafts The resources to craft.
   */
  craft(
    crafts: Partial<Record<ResourceCraftable, CraftSettingsItem>> = this._host.options.auto.craft
      .items
  ): void {
    this._workshopManager.autoCraft(crafts);
  }

  holdFestival(): void {
    this._villageManager.autoFestival(this._cacheManager);
  }

  /**
   * If there is currently an astronomical event, observe it.
   */
  observeStars(): void {
    if (this._host.gamePage.calendar.observeBtn !== null) {
      this._host.gamePage.calendar.observeHandler();
      this._host.iactivity("act.observe", [], "ks-star");
      this._host.storeForSummary("stars", 1);
    }
  }

  /**
   * Send kittens on a hunt.
   */
  hunt(): void {
    this._villageManager.autoHunt(this._cacheManager);
  }

  trade(): void {
    this._tradeManager.autoTrade(this._cacheManager);

    if (this._host.options.auto.trade.addition.unlockRaces.enabled) {
      this._tradeManager.autoUnlock();
    }
    if (this._host.options.auto.trade.addition.buildEmbassies.enabled) {
      this._tradeManager.autoBuildEmbassies();
    }
  }

  /**
   * All automations that didn't have a better place.
   * - Fixing cryochambers
   * - Turn on Steamworks (they're always off initially)
   */
  miscOptions(): void {
    const optionVals = this._host.options.auto.options.items;

    // Fix used cryochambers
    // If the option is enabled and we have used cryochambers...
    if (optionVals.fixCry.enabled && 0 < this._host.gamePage.time.getVSU("usedCryochambers").val) {
      let fixed = 0;
      const btn = this._timeManager.manager.tab.vsPanel.children[0].children[0]; //check?
      // doFixCryochamber will check resources
      while (btn.controller.doFixCryochamber(btn.model)) {
        ++fixed;
      }
      if (0 < fixed) {
        this._host.iactivity("act.fix.cry", [fixed], "ks-fixCry");
        this._host.storeForSummary("fix.cry", fixed);
      }
    }
  }
}
