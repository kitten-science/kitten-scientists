import { BonfireManager } from "./BonfireManager";
import { EngineSettings } from "./options/EngineSettings";
import { ReligionManager } from "./ReligionManager";
import { ScienceManager } from "./ScienceManager";
import { SpaceManager } from "./SpaceManager";
import { TimeControlManager } from "./TimeControlManager";
import { TimeManager } from "./TimeManager";
import { mustExist } from "./tools/Maybe";
import { TradeManager } from "./TradeManager";
import { UserScript } from "./UserScript";
import { VillageManager } from "./VillageManager";
import { WorkshopManager } from "./WorkshopManager";

export type TickContext = {
  tick: number;
};
export type Automation = {
  tick(context: TickContext): void | Promise<void>;
};

export class Engine {
  readonly _host: UserScript;
  readonly settings: EngineSettings;
  readonly bonfireManager: BonfireManager;
  readonly spaceManager: SpaceManager;
  readonly tradingManager: TradeManager;
  readonly religionManager: ReligionManager;
  readonly timeControlManager: TimeControlManager;
  readonly timeManager: TimeManager;
  readonly scienceManager: ScienceManager;
  readonly workshopManager: WorkshopManager;
  readonly villageManager: VillageManager;

  private _intervalMainLoop: number | undefined = undefined;

  constructor(host: UserScript) {
    this._host = host;
    this.settings = new EngineSettings();

    // The managers are really weakly defined concepts.
    // Most commonly, they are a wrapper around the functionality of a KG tab.
    // Very often though, key functionality of the automation of the tab is located
    // in the Engine itself. This will likely be refactored.
    this.bonfireManager = new BonfireManager(this._host);
    this.villageManager = new VillageManager(this._host);
    this.scienceManager = new ScienceManager(this._host);
    this.workshopManager = new WorkshopManager(this._host);
    this.tradingManager = new TradeManager(this._host);
    this.religionManager = new ReligionManager(this._host);
    this.timeControlManager = new TimeControlManager(this._host);
    this.timeManager = new TimeManager(this._host);
    this.spaceManager = new SpaceManager(this._host);
  }

  load(settings: EngineSettings) {
    this.settings = settings;
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
            Math.max(10, this._host.engine.settings.interval - timeTaken)
          );
        })
        .catch(error => {
          this._host.warning(error as string);
        });
    };
    this._intervalMainLoop = setTimeout(loop, this._host.engine.settings.interval);

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
    const context = { tick: new Date().getTime() };

    const subOptions = this._host.engine.settings.options;

    // The order in which these actions are performed is probably
    // semi-intentional and should be preserved or improved.

    // Observe astronomical events.
    if (subOptions.enabled && subOptions.items.observe.enabled) {
      this.observeStars();
    }
    await this.scienceManager.tick(context);
    this.bonfireManager.tick(context);
    this.spaceManager.tick(context);
    await this.workshopManager.tick(context);
    this.tradingManager.tick(context);
    this.religionManager.tick(context);
    this.timeManager.tick(context);
    // Blackcoin trading.
    if (subOptions.enabled && subOptions.items.crypto.enabled) {
      this.crypto();
    }
    // Feed leviathans.
    if (subOptions.enabled && subOptions.items.autofeed.enabled) {
      this.autofeed();
    }

    this.villageManager.tick(context);

    // Time automations (Tempus Fugit & Shatter TC)
    await this.timeControlManager.tick(context);

    // Miscelaneous automations.
    if (subOptions.enabled) {
      // Fix used cryochambers
      // If the option is enabled and we have used cryochambers...
      if (
        subOptions.items.fixCry.enabled &&
        0 < this._host.gamePage.time.getVSU("usedCryochambers").val
      ) {
        let fixed = 0;
        const btn = this.timeManager.manager.tab.vsPanel.children[0].children[0]; //check?
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

  /**
   * Feed leviathans.
   */
  autofeed(): void {
    this.tradingManager.autoFeedElders();
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
      (this._host.engine.settings.options.items.crypto.trigger ?? 0) < relicsInitial
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
   * If there is currently an astronomical event, observe it.
   */
  observeStars(): void {
    if (this._host.gamePage.calendar.observeBtn !== null) {
      this._host.gamePage.calendar.observeHandler();
      this._host.iactivity("act.observe", [], "ks-star");
      this._host.storeForSummary("stars", 1);
    }
  }
}
