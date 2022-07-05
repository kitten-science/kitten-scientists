import { BonfireManager } from "./BonfireManager";
import { BulkManager } from "./BulkManager";
import { CacheManager } from "./CacheManager";
import { CraftManager } from "./CraftManager";
import { BonfireItem, BonfireSettingsItem } from "./options/BonfireSettings";
import { CraftSettingsItem } from "./options/CraftSettings";
import { PolicySettings } from "./options/PolicySettings";
import { SpaceItem, SpaceSettingsItem } from "./options/SpaceSettings";
import { ReligionManager } from "./ReligionManager";
import { SpaceManager } from "./SpaceManager";
import { TimeManager } from "./TimeManager";
import { objectEntries } from "./tools/Entries";
import { cerror } from "./tools/Log";
import { isNil, mustExist } from "./tools/Maybe";
import { TradeManager } from "./TradeManager";
import { ResourceCraftable } from "./types";
import { UpgradeManager } from "./UpgradeManager";
import { UserScript } from "./UserScript";
import { VillageManager } from "./VillageManager";

export class Engine {
  private readonly _host: UserScript;
  private readonly _upgradeManager: UpgradeManager;
  private readonly _bonfireManager: BonfireManager;
  private readonly _spaceManager: SpaceManager;
  private readonly _craftManager: CraftManager;
  private readonly _bulkManager: BulkManager;
  private readonly _tradeManager: TradeManager;
  private readonly _religionManager: ReligionManager;
  private readonly _timeManager: TimeManager;
  private readonly _villageManager: VillageManager;
  private readonly _cacheManager: CacheManager;

  private _intervalMainLoop: number | undefined = undefined;

  constructor(host: UserScript) {
    this._host = host;

    // The managers are really weakly defined concepts.
    // Most commonly, they are a wrapper around the functionality of a KG tab.
    // Very often though, key functionality of the automation of the tab is located
    // in the Engine itself. This will likely be refactored.
    this._upgradeManager = new UpgradeManager(this._host);
    this._bonfireManager = new BonfireManager(this._host);
    this._spaceManager = new SpaceManager(this._host);
    this._craftManager = new CraftManager(this._host);
    this._bulkManager = new BulkManager(this._host);
    this._tradeManager = new TradeManager(this._host);
    this._religionManager = new ReligionManager(this._host);
    this._timeManager = new TimeManager(this._host);
    this._villageManager = new VillageManager(this._host);
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
      this.upgrade();
    }
    // Hold festival.
    if (subOptions.enabled && subOptions.items.festival.enabled) {
      this.holdFestival();
    }
    // Build bonfire buildings.
    if (this._host.options.auto.build.enabled) {
      this.buildBonfire();
    }
    // Build space buildings.
    if (this._host.options.auto.space.enabled) {
      this.buildSpace();
    }
    // Craft configured resources.
    if (this._host.options.auto.craft.enabled) {
      this.craft();
    }
    // Go hunting.
    if (subOptions.enabled && subOptions.items.hunt.enabled) {
      this.hunt();
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
    // Promote kittens.
    if (subOptions.enabled && subOptions.items.promote.enabled) {
      this.promote();
    }
    // Distribute kittens to jobs.
    if (this._host.options.auto.distribute.enabled) {
      this.distributeKittens();
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
  upgrade(): void {
    const upgrades = this._host.options.auto.unlock.items;
    const upgradeManager = this._upgradeManager;
    const craftManager = this._craftManager;
    const bulkManager = this._bulkManager;
    const buildManager = this._bonfireManager;

    // Ensure all the tabs have their current UI state updated.
    upgradeManager.workshopManager.render();
    upgradeManager.scienceManager.render();
    upgradeManager.spaceManager.render();

    // If upgrades (workshop items) are enabled...
    if (upgrades.upgrades.enabled && this._host.gamePage.tabs[3].visible) {
      const workshopUpgrades = this._host.gamePage.workshop.upgrades;
      // TODO: Filter out upgrades that are not beneficial when using KS, like workshop automation.
      workLoop: for (const upgrade of workshopUpgrades) {
        // If the upgrade is already purchased or not available yet, continue with the next one.
        if (upgrade.researched || !upgrade.unlocked) {
          continue;
        }

        // Create a copy of the prices for this upgrade, so that we can apply effects to it.
        let prices = dojo.clone(upgrade.prices);
        prices = this._host.gamePage.village.getEffectLeader("scientist", prices);
        for (const resource of prices) {
          // If we can't afford this resource price, continue with the next upgrade.
          if (craftManager.getValueAvailable(resource.name, true) < resource.val) {
            continue workLoop;
          }
        }

        // If we can afford all prices, purchase the upgrade.
        upgradeManager.build(upgrade, "workshop");
      }
    }

    // If techs (science items) are enabled...
    if (upgrades.techs.enabled && this._host.gamePage.tabs[2].visible) {
      // These behave identically to the workshop uprades above.
      const scienceUpgrades = this._host.gamePage.science.techs;
      techLoop: for (const upgrade of scienceUpgrades) {
        if (upgrade.researched || !upgrade.unlocked) {
          continue;
        }

        let prices = dojo.clone(upgrade.prices);
        prices = this._host.gamePage.village.getEffectLeader("scientist", prices);
        for (const resource of prices) {
          if (craftManager.getValueAvailable(resource.name, true) < resource.val) {
            continue techLoop;
          }
        }
        upgradeManager.build(upgrade, "science");
      }
    }

    if (upgrades.policies.enabled && this._host.gamePage.tabs[2].visible) {
      const policies = this._host.gamePage.science.policies;
      const toResearch = [];

      for (const [policy] of objectEntries(
        (this._host.options.auto.unlock.items.policies as PolicySettings).items
      )) {
        const targetPolicy = policies.find(policy => policy.name === policy.name);
        if (isNil(targetPolicy)) {
          cerror(`Policy '${policy}' not found in game!`);
          continue;
        }

        if (!targetPolicy.researched) {
          if (targetPolicy.blocked) {
            continue;
          }
          if (targetPolicy.unlocked) {
            if (
              targetPolicy.requiredLeaderJob === undefined ||
              (this._host.gamePage.village.leader !== null &&
                this._host.gamePage.village.leader.job === targetPolicy.requiredLeaderJob)
            ) {
              toResearch.push(targetPolicy);
            }
          }
        }
      }
      for (const polciy of toResearch) {
        upgradeManager.build(polciy, "policy");
      }
    }

    // If missions (space items) are enabled...
    if (upgrades.missions.enabled && this._host.gamePage.tabs[6].visible) {
      const missions = this._host.gamePage.space.meta[0].meta;
      missionLoop: for (let i = 0; i < missions.length; i++) {
        // If the mission is already purchased or not available yet, continue with the next one.
        if (0 < missions[i].val || !missions[i].unlocked) {
          continue;
        }

        const model = this._spaceManager.manager.tab.GCPanel.children[i];
        const prices = model.model.prices;
        for (const resource of prices) {
          // If we can't afford this resource price, continue with the next mission.
          if (craftManager.getValueAvailable(resource.name, true) < resource.val) {
            continue missionLoop;
          }
        }

        // Start the mission by clicking the button.
        // TODO: Move this into the SpaceManager?
        model.domNode.click();
        if (i === 7 || i === 12) {
          this._host.iactivity("upgrade.space.mission", [missions[i].label], "ks-upgrade");
        } else {
          this._host.iactivity("upgrade.space", [missions[i].label], "ks-upgrade");
        }
      }
    }

    // If races (trading) are enabled...
    if (upgrades.races.enabled && this._host.gamePage.tabs[4].visible) {
      // Check how many races we could reasonably unlock at this point.
      const maxRaces = this._host.gamePage.diplomacy.get("leviathans").unlocked ? 8 : 7;
      // If we haven't unlocked that many races yet...
      if (this._host.gamePage.diplomacyTab.racePanels.length < maxRaces) {
        // Get the currently available catpower.
        let manpower = craftManager.getValueAvailable("manpower", true);
        // TODO: These should be checked in reverse order. Otherwise the check for lizards
        //       can cause the zebras to be discovered at later stages in the game. Then it
        //       gets to the check for the zebras and doesn't explore again, as they're
        //       already unlocked. Then it takes another iteration to unlock the other race.
        // Send explorers if we haven't discovered the lizards yet.
        if (!this._host.gamePage.diplomacy.get("lizards").unlocked) {
          if (manpower >= 1000) {
            this._host.gamePage.resPool.get("manpower").value -= 1000;
            this._host.iactivity(
              "upgrade.race",
              [this._host.gamePage.diplomacy.unlockRandomRace().title],
              "ks-upgrade"
            );
            manpower -= 1000;
            this._host.gamePage.ui.render();
          }
        }

        // Do exactly the same for the sharks.
        if (!this._host.gamePage.diplomacy.get("sharks").unlocked) {
          if (manpower >= 1000) {
            this._host.gamePage.resPool.get("manpower").value -= 1000;
            this._host.iactivity(
              "upgrade.race",
              [this._host.gamePage.diplomacy.unlockRandomRace().title],
              "ks-upgrade"
            );
            manpower -= 1000;
            this._host.gamePage.ui.render();
          }
        }

        // Do exactly the same for the griffins.
        if (!this._host.gamePage.diplomacy.get("griffins").unlocked) {
          if (manpower >= 1000) {
            this._host.gamePage.resPool.get("manpower").value -= 1000;
            this._host.iactivity(
              "upgrade.race",
              [this._host.gamePage.diplomacy.unlockRandomRace().title],
              "ks-upgrade"
            );
            manpower -= 1000;
            this._host.gamePage.ui.render();
          }
        }

        // For nagas, we additionally need enough culture.
        if (
          !this._host.gamePage.diplomacy.get("nagas").unlocked &&
          this._host.gamePage.resPool.get("culture").value >= 1500
        ) {
          if (manpower >= 1000) {
            this._host.gamePage.resPool.get("manpower").value -= 1000;
            this._host.iactivity(
              "upgrade.race",
              [this._host.gamePage.diplomacy.unlockRandomRace().title],
              "ks-upgrade"
            );
            manpower -= 1000;
            this._host.gamePage.ui.render();
          }
        }

        // Zebras require us to have a ship.
        if (
          !this._host.gamePage.diplomacy.get("zebras").unlocked &&
          this._host.gamePage.resPool.get("ship").value >= 1
        ) {
          if (manpower >= 1000) {
            this._host.gamePage.resPool.get("manpower").value -= 1000;
            this._host.iactivity(
              "upgrade.race",
              [this._host.gamePage.diplomacy.unlockRandomRace().title],
              "ks-upgrade"
            );
            manpower -= 1000;
            this._host.gamePage.ui.render();
          }
        }

        // For spiders, we need 100 ships and 125000 science.
        if (
          !this._host.gamePage.diplomacy.get("spiders").unlocked &&
          mustExist(this._host.gamePage.resPool.get("ship")).value >= 100 &&
          mustExist(this._host.gamePage.resPool.get("science")).maxValue > 125000
        ) {
          if (manpower >= 1000) {
            mustExist(this._host.gamePage.resPool.get("manpower")).value -= 1000;
            this._host.iactivity(
              "upgrade.race",
              [this._host.gamePage.diplomacy.unlockRandomRace().title],
              "ks-upgrade"
            );
            manpower -= 1000;
            this._host.gamePage.ui.render();
          }
        }

        // Dragons require nuclear fission to be researched.
        if (
          !this._host.gamePage.diplomacy.get("dragons").unlocked &&
          this._host.gamePage.science.get("nuclearFission").researched
        ) {
          if (manpower >= 1000) {
            mustExist(this._host.gamePage.resPool.get("manpower")).value -= 1000;
            this._host.iactivity(
              "upgrade.race",
              [this._host.gamePage.diplomacy.unlockRandomRace().title],
              "ks-upgrade"
            );
            manpower -= 1000;
            this._host.gamePage.ui.render();
          }
        }
      }
    }

    // If buildings (upgrades of bonfire items) are enabled...
    if (upgrades.buildings.enabled) {
      // Get current count of pastures.
      const pastures =
        this._host.gamePage.bld.getBuildingExt("pasture").meta.stage === 0
          ? this._host.gamePage.bld.getBuildingExt("pasture").meta.val
          : 0;
      // Get current count of aqueducts.
      const aqueducts =
        this._host.gamePage.bld.getBuildingExt("aqueduct").meta.stage === 0
          ? this._host.gamePage.bld.getBuildingExt("aqueduct").meta.val
          : 0;

      const pastureMeta = this._host.gamePage.bld.getBuildingExt("pasture").meta;
      // If pastures haven't been upgraded to solar farms yet...
      if (pastureMeta.stage === 0) {
        if (mustExist(pastureMeta.stages)[1].stageUnlocked) {
          // If we would reduce our pastures to 0, by upgrading them, would we lose any catnip?
          if (craftManager.getPotentialCatnip(true, 0, aqueducts) > 0) {
            const prices = mustExist(pastureMeta.stages)[1].prices;
            if (bulkManager.singleBuildPossible(pastureMeta, prices, 1)) {
              const button = mustExist(buildManager.getBuildButton("pasture", 0));
              // We need to perform the process like this to avoid UI confirmations
              // for selling items.
              // Sell all pastures (to regain the resources).
              button.controller.sellInternal(button.model, 0);
              // Manually update the metadata, as we bypassed the full selling logic.
              pastureMeta.on = 0;
              pastureMeta.val = 0;
              pastureMeta.stage = 1;

              this._host.iactivity("upgrade.building.pasture", [], "ks-upgrade");

              // Upgrade the pasture.
              this._host.gamePage.ui.render();
              buildManager.build("pasture", 1, 1);
              this._host.gamePage.ui.render();

              // TODO: Why do we return here and not just unlock more buildings?
              return;
            }
          }
        }
      }

      const aqueductMeta = this._host.gamePage.bld.getBuildingExt("aqueduct").meta;
      // If aqueducts haven't beeen upgraded to hydro plants yet...
      if (aqueductMeta.stage === 0) {
        if (mustExist(aqueductMeta.stages)[1].stageUnlocked) {
          // If we would reduce our aqueducts to 0, by upgrading them, would we lose any catnip?
          if (craftManager.getPotentialCatnip(true, pastures, 0) > 0) {
            const prices = mustExist(aqueductMeta.stages)[1].prices;
            if (bulkManager.singleBuildPossible(aqueductMeta, prices, 1)) {
              const button = mustExist(buildManager.getBuildButton("aqueduct", 0));
              button.controller.sellInternal(button.model, 0);
              aqueductMeta.on = 0;
              aqueductMeta.val = 0;
              aqueductMeta.stage = 1;

              // TODO: Why do we do this for the aqueduct and not for the pasture?
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              aqueductMeta.calculateEffects!(aqueductMeta, this._host.gamePage);

              this._host.iactivity("upgrade.building.aqueduct", [], "ks-upgrade");

              this._host.gamePage.ui.render();
              buildManager.build("aqueduct", 1, 1);
              this._host.gamePage.ui.render();

              return;
            }
          }
        }
      }

      const libraryMeta = this._host.gamePage.bld.getBuildingExt("library").meta;
      if (libraryMeta.stage === 0) {
        if (mustExist(libraryMeta.stages)[1].stageUnlocked) {
          let energyConsumptionRate = this._host.gamePage.workshop.get("cryocomputing").researched
            ? 1
            : 2;
          if (this._host.gamePage.challenges.currentChallenge === "energy") {
            energyConsumptionRate *= 2;
          }

          // This indicates how valuable a data center is, compared to a single library.
          // We check for possible upgrades, that would make them more valuable.
          let libToDat = 3;
          if (this._host.gamePage.workshop.get("uplink").researched) {
            libToDat *=
              1 +
              this._host.gamePage.bld.get("biolab").val *
                this._host.gamePage.getEffect("uplinkDCRatio");
          }
          if (this._host.gamePage.workshop.get("machineLearning").researched) {
            libToDat *=
              1 +
              this._host.gamePage.bld.get("aiCore").on *
                this._host.gamePage.getEffect("dataCenterAIRatio");
          }

          // We now have the energy consumption of data centers and the value of data centers.
          // Assuming, we would upgrade to data centers and buy as many as we need to have value
          // equal to our current libraries, and that wouldn't cap our energy, upgrade them.
          if (
            this._host.gamePage.resPool.energyProd >=
            this._host.gamePage.resPool.energyCons +
              (energyConsumptionRate * libraryMeta.val) / libToDat
          ) {
            const prices = mustExist(libraryMeta.stages)[1].prices;
            if (bulkManager.singleBuildPossible(libraryMeta, prices, 1)) {
              const button = mustExist(buildManager.getBuildButton("library", 0));
              button.controller.sellInternal(button.model, 0);
              libraryMeta.on = 0;
              libraryMeta.val = 0;
              libraryMeta.stage = 1;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              libraryMeta.calculateEffects!(libraryMeta, this._host.gamePage);
              this._host.iactivity("upgrade.building.library", [], "ks-upgrade");
              this._host.gamePage.ui.render();
              buildManager.build("library", 1, 1);
              this._host.gamePage.ui.render();
              return;
            }
          }
        }
      }

      const amphitheatreMeta = this._host.gamePage.bld.getBuildingExt("amphitheatre").meta;
      // If amphitheathres haven't been upgraded to broadcast towers yet...
      // This seems to be identical to the pasture upgrade.
      if (amphitheatreMeta.stage === 0) {
        if (mustExist(amphitheatreMeta.stages)[1].stageUnlocked) {
          // TODO: This is problematic. Upgrading from 50 amphitheatres to 1 broadcast tower sucks
          //       if you don't have enough resources to build several more.
          const prices = mustExist(amphitheatreMeta.stages)[1].prices;
          if (bulkManager.singleBuildPossible(amphitheatreMeta, prices, 1)) {
            const button = mustExist(buildManager.getBuildButton("amphitheatre", 0));
            button.controller.sellInternal(button.model, 0);
            amphitheatreMeta.on = 0;
            amphitheatreMeta.val = 0;
            amphitheatreMeta.stage = 1;

            this._host.iactivity("upgrade.building.amphitheatre", [], "ks-upgrade");

            this._host.gamePage.ui.render();
            buildManager.build("amphitheatre", 1, 1);
            this._host.gamePage.ui.render();

            return;
          }
        }
      }
    }
  }

  /**
   * Try to build some buildings.
   *
   * @param builds The buildings to build.
   */
  buildBonfire(
    builds: Partial<Record<BonfireItem, BonfireSettingsItem>> = this._host.options.auto.build.items
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
    this._craftManager.autoCraft(crafts);
  }

  holdFestival(): void {
    this._villageManager.autoFestival();
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
    this._tradeManager.autoBuildEmbassies();
  }

  /**
   * All automations that didn't have a better place.
   * - Fixing cryochambers
   * - Turn on Steamworks (they're always off initially)
   */
  miscOptions(): void {
    const buildManager = this._bonfireManager;
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

    // Auto turn on steamworks
    if (optionVals._steamworks.enabled) {
      const steamworks = this._host.gamePage.bld.getBuildingExt("steamworks");
      if (steamworks.meta.val && steamworks.meta.on === 0) {
        const button = mustExist(buildManager.getBuildButton("steamworks"));
        button.controller.onAll(button.model);
      }
    }
  }
}
