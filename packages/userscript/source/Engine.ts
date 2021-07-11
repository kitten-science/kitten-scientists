import { BuildManager } from "./BuildManager";
import { BulkManager } from "./BulkManager";
import { CacheManager } from "./CacheManager";
import { CraftManager } from "./CraftManager";
import { ExplorationManager } from "./ExplorationManager";
import { BonfireSettingsItem, BuildItem } from "./options/BonfireSettings";
import { FaithItem, ReligionSettingsItem } from "./options/ReligionSettings";
import { SpaceItem } from "./options/SpaceSettings";
import { CycleIndices } from "./options/TimeControlSettings";
import { TimeItem } from "./options/TimeSettings";
import { ReligionManager } from "./ReligionManager";
import { SpaceManager } from "./SpaceManager";
import { TabManager } from "./TabManager";
import { TimeManager } from "./TimeManager";
import { objectEntries } from "./tools/Entries";
import { mustExist } from "./tools/Maybe";
import { TradeManager } from "./TradeManager";
import {
  BuildButton,
  Building,
  BuildingMeta,
  ChronoForgeUpgradeInfo,
  ChronoForgeUpgrades,
  Jobs,
  Race,
  RaceInfo,
  ReligionUpgradeInfo,
  ReligionUpgrades,
  Resource,
  SpaceBuildingInfo,
  SpaceBuildings,
  TimeItemVariant,
  TranscendenceUpgradeInfo,
  TranscendenceUpgrades,
  UnicornItemVariant,
  VoidSpaceUpgradeInfo,
  VoidSpaceUpgrades,
  ZiggurathUpgradeInfo,
  ZiggurathUpgrades,
} from "./types";
import { UpgradeManager } from "./UpgradeManager";
import { UserScript } from "./UserScript";

export class Engine {
  private readonly _host: UserScript;
  private readonly _upgradeManager: UpgradeManager;
  private readonly _buildManager: BuildManager;
  private readonly _spaceManager: SpaceManager;
  private readonly _craftManager: CraftManager;
  private readonly _bulkManager: BulkManager;
  private readonly _tradeManager: TradeManager;
  private readonly _religionManager: ReligionManager;
  private readonly _timeManager: TimeManager;
  private readonly _explorationManager: ExplorationManager;
  private readonly _villageManager: TabManager;
  private readonly _cacheManager: CacheManager;

  private loop: number | undefined = undefined;

  constructor(host: UserScript) {
    this._host = host;

    // The managers are really weakly defined concepts.
    // Most commonly, they are a wrapper around the functionality of a KG tab.
    // Very often though, key functionality of the automation of the tab is located
    // in the Engine itself. This will likely be refactored.
    this._upgradeManager = new UpgradeManager(this._host);
    this._buildManager = new BuildManager(this._host);
    this._spaceManager = new SpaceManager(this._host);
    this._craftManager = new CraftManager(this._host);
    this._bulkManager = new BulkManager(this._host);
    this._tradeManager = new TradeManager(this._host);
    this._religionManager = new ReligionManager(this._host);
    this._timeManager = new TimeManager(this._host);
    this._explorationManager = new ExplorationManager(this._host);
    this._villageManager = new TabManager(this._host, "Village");
    this._cacheManager = new CacheManager(this._host);
  }

  /**
   * Start the Kitten Scientists engine.
   * @param msg Should we print to the log that the engine was started?
   */
  start(msg = true): void {
    if (this.loop) {
      return;
    }

    // TODO: `_iterate` is async, but it isn't awaited.
    //       Instead of using an interval, this should use a tail-controlled timeout.
    this.loop = setInterval(this._iterate.bind(this), this._host.options.interval);

    if (msg) {
      this._host.imessage("status.ks.enable");
    }
  }

  /**
   * Stop the Kitten Scientists engine.
   * @param msg Should we print to the log that the engine was stopped?
   */
  stop(msg = true): void {
    if (!this.loop) {
      return;
    }

    clearInterval(this.loop);
    this.loop = undefined;

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
      this.build();
    }
    // Build space buildings.
    if (this._host.options.auto.space.enabled) {
      this.space();
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
    // No longer needed.
    // TODO: Remove this
    if (subOptions.enabled && subOptions.items.explore.enabled) {
      this.explore();
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
      this.distribute();
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
    // Don't reset if there's a challenge running.
    if (this._host.gamePage.challenges.currentChallenge) {
      return;
    }

    const checkedList: Array<{ name: string; trigger: number; val: number }> = [];
    const checkList: Array<string> = [];

    // This function allows us to quickly check a list of items for our
    // ability to buy them.
    // The idea is that, if we don't have a given building yet, we put
    // it on the `checkList`. This function will then check the provided
    // buttons and see if the item appears on the checklist.
    // If we don't have a given item, but we *could* buy it, then we act
    // as if we already had it.
    const check = (buttons: Array<BuildButton>) => {
      if (checkList.length !== 0) {
        for (const buttonsIndex in buttons) {
          if (!buttons[buttonsIndex].model.metadata) {
            continue;
          }
          const name = buttons[buttonsIndex].model.metadata.name;
          const index = checkList.indexOf(name);
          if (index !== -1) {
            checkList.splice(index, 1);
            if (this._host.gamePage.resPool.hasRes(buttons[buttonsIndex].model.prices)) {
              return true;
            }
          }
        }
      }
      return false;
    };

    // check building
    for (const [name, entry] of objectEntries(this._host.options.auto.timeCtrl.buildItems))
      if (entry.checkForReset) {
        // TODO: Obvious error here. For upgraded buildings, it needs special handling.
        const bld = this._host.gamePage.bld.get(name);
        checkedList.push({ name: bld.label, trigger: entry.triggerForReset, val: bld.val });
        if (0 < entry.triggerForReset) {
          // If the required amount of buildings hasn't been built yet, bail out.
          if (bld.val < entry.triggerForReset) {
            return;
          }
        } else {
          checkList.push(name);
        }
      }

    // unicornPasture
    // Special handling for unicorn pasture. As it's listed under religion, but is
    // actually a bonfire item.
    const unicornPasture = this._host.options.auto.timeCtrl.religionItems.unicornPasture;
    if (unicornPasture.checkForReset) {
      const bld = this._host.gamePage.bld.get("unicornPasture");
      checkedList.push({ name: bld.label, trigger: unicornPasture.triggerForReset, val: bld.val });
      if (0 < unicornPasture.triggerForReset) {
        if (bld.val < unicornPasture.triggerForReset) {
          return;
        }
      } else {
        checkList.push("unicornPasture");
      }
    }
    if (check(this._buildManager.manager.tab.buttons) || checkList.length) {
      return;
    }

    // check space
    // This is identical to regular buildings.
    for (const [name, entry] of objectEntries(this._host.options.auto.timeCtrl.spaceItems)) {
      if (entry.checkForReset) {
        const bld = this._host.gamePage.space.getBuilding(name);
        checkedList.push({ name: bld.label, trigger: entry.triggerForReset, val: bld.val });
        if (0 < entry.triggerForReset) {
          if (bld.val < entry.triggerForReset) {
            return;
          }
        } else {
          checkList.push(name);
        }
      }
    }

    if (checkList.length === 0) {
      const panels = this._spaceManager.manager.tab.planetPanels;
      for (const panelIndex in panels) {
        for (const panelButtonIndex in panels[panelIndex].children) {
          const model = panels[panelIndex].children[panelButtonIndex].model;
          const name = model.metadata.name;
          const index = checkList.indexOf(name);
          if (index !== -1) {
            checkList.splice(index, 1);
            if (this._host.gamePage.resPool.hasRes(model.prices)) {
              break;
            }
          }
        }
      }
    }
    if (checkList.length) {
      return;
    }

    // check religion
    for (const [name, entry] of objectEntries(this._host.options.auto.timeCtrl.religionItems)) {
      if (entry.checkForReset) {
        const bld = mustExist(this._religionManager.getBuild(name, entry.variant));
        checkedList.push({ name: bld.label, trigger: entry.triggerForReset, val: bld.val });
        if (0 < entry.triggerForReset) {
          if (bld.val < entry.triggerForReset) {
            return;
          }
        } else {
          checkList.push(name);
        }
      }
    }

    if (
      check(this._religionManager.manager.tab.zgUpgradeButtons) ||
      check(this._religionManager.manager.tab.rUpgradeButtons) ||
      check(this._religionManager.manager.tab.children[0].children[0].children) ||
      checkList.length
    ) {
      return;
    }

    // check time
    for (const [name, entry] of objectEntries(this._host.options.auto.timeCtrl.timeItems)) {
      if (entry.checkForReset) {
        const bld = mustExist(this._timeManager.getBuild(name, entry.variant));
        checkedList.push({ name: bld.label, trigger: entry.triggerForReset, val: bld.val });
        if (0 < entry.triggerForReset) {
          if (bld.val < entry.triggerForReset) {
            return;
          }
        } else {
          checkList.push(name);
        }
      }
    }

    if (
      check(this._timeManager.manager.tab.children[2].children[0].children) ||
      check(this._timeManager.manager.tab.children[3].children[0].children) ||
      checkList.length
    ) {
      return;
    }

    // check resources
    for (const [name, entry] of objectEntries(this._host.options.auto.timeCtrl.resources)) {
      if (entry.checkForReset) {
        const res = mustExist(this._host.gamePage.resPool.get(name));
        checkedList.push({ name: res.title, trigger: entry.stockForReset, val: res.value });
        if (res.value < entry.stockForReset) {
          return;
        }
      }
    }

    // We have now determined that we either have all items or could buy all items.

    // stop!
    this.stop(false);

    const sleep = async (time = 1500) => {
      return new Promise((resolve, reject) => {
        if (
          !(
            this._host.options.auto.engine.enabled &&
            this._host.options.auto.timeCtrl.enabled &&
            this._host.options.auto.timeCtrl.items.reset.enabled
          )
        ) {
          reject(new Error("canceled by player"));
        }
        setTimeout(resolve, time);
      });
    };

    try {
      for (const checked of checkedList) {
        await sleep(500);
        this._host.imessage("reset.check", [
          checked.name,
          this._host.gamePage.getDisplayValueExt(checked.trigger),
          this._host.gamePage.getDisplayValueExt(checked.val),
        ]);
      }

      await sleep(0);
      this._host.imessage("reset.checked");
      await sleep();
      this._host.iactivity("reset.tip");
      await sleep();
      this._host.imessage("reset.countdown.10");
      await sleep(2000);
      this._host.imessage("reset.countdown.9");
      await sleep();
      this._host.imessage("reset.countdown.8");
      await sleep();
      this._host.imessage("reset.countdown.7");
      await sleep();
      this._host.imessage("reset.countdown.6");
      await sleep();
      this._host.imessage("reset.countdown.5");
      await sleep();
      this._host.imessage("reset.countdown.4");
      await sleep();
      this._host.imessage("reset.countdown.3");
      await sleep();
      this._host.imessage("reset.countdown.2");
      await sleep();
      this._host.imessage("reset.countdown.1");
      await sleep();
      this._host.imessage("reset.countdown.0");
      await sleep();
      this._host.iactivity("reset.last.message");
      await sleep();
    } catch (error) {
      this._host.imessage("reset.cancel.message");
      this._host.iactivity("reset.cancel.activity");
      return;
    }

    //if (typeof kittenStorage.reset === "undefined") kittenStorage.reset = {};

    this._host.options.reset.karmaLastTime = this._host.gamePage.resPool.get("karma").value;
    this._host.options.reset.paragonLastTime = this._host.gamePage.resPool.get("paragon").value;
    this._host.options.reset.times += 1;
    this._host.options.reset.reset = true;

    // kittenStorage.reset.karmaLastTime = mustExist(this._host.gamePage.resPool.get("karma")).value;
    // kittenStorage.reset.paragonLastTime = mustExist(
    // this._host.gamePage.resPool.get("paragon")
    // ).value;
    // kittenStorage.reset.times += 1;
    // kittenStorage.reset.reset = true;
    saveToKittenStorage();

    //=============================================================
    for (
      let challengeIndex = 0;
      challengeIndex < this._host.gamePage.challenges.challenges.length;
      challengeIndex++
    ) {
      this._host.gamePage.challenges.challenges[challengeIndex].pending = false;
    }
    this._host.gamePage.resetAutomatic();
    //=============================================================
  }

  /**
   * Perform time automation, like Tempus Fugit and TC shattering.
   */
  timeCtrl(): void {
    const optionVals = this._host.options.auto.timeCtrl.items;

    // Tempus Fugit
    // If it's enabled and we have enough Temporal Flux to reach the trigger,
    // accelerate time.
    if (optionVals.accelerateTime.enabled && !this._host.gamePage.time.isAccelerated) {
      const temporalFlux = this._host.gamePage.resPool.get("temporalFlux");
      if (temporalFlux.value >= temporalFlux.maxValue * optionVals.accelerateTime.subTrigger) {
        this._host.gamePage.time.isAccelerated = true;
        this._host.iactivity("act.accelerate", [], "ks-accelerate");
        this._host.storeForSummary("accelerate", 1);
      }
    }

    // Combust time crystal
    // If time skipping is enabled and Chronoforge has been researched.
    if (optionVals.timeSkip.enabled && this._host.gamePage.workshop.get("chronoforge").researched) {
      // TODO: Not sure when this would ever be true.
      if (this._host.gamePage.calendar.day < 0) {
        return;
      }

      // If we have less time crystals than our required trigger value, bail out.
      const timeCrystal = this._host.gamePage.resPool.get("timeCrystal");
      if (timeCrystal.value < optionVals.timeSkip.subTrigger) {
        return;
      }

      // If skipping during this season was disabled, bail out.
      const season = this._host.gamePage.calendar.season;
      if (!optionVals.timeSkip[this._host.gamePage.calendar.seasons[season].name]) {
        return;
      }

      // If skipping during this cycle was disabled, bail out.
      const currentCycle = this._host.gamePage.calendar.cycle;
      if (!optionVals.timeSkip[currentCycle]) {
        return;
      }

      // If we have too much stored heat, wait for it to cool down.
      const heatMax = this._host.gamePage.getEffect("heatMax");
      const heatNow = this._host.gamePage.time.heat;
      if (heatMax <= heatNow) {
        return;
      }

      const yearsPerCycle = this._host.gamePage.calendar.yearsPerCycle;
      const remainingYearsCurrentCycle = yearsPerCycle - this._host.gamePage.calendar.cycleYear;
      const cyclesPerEra = this._host.gamePage.calendar.cyclesPerEra;
      const factor = this._host.gamePage.challenges.getChallenge("1000Years").researched ? 5 : 10;
      // How many times/years we can skip before we reach our max heat.
      let canSkip = Math.min(Math.floor((heatMax - heatNow) / factor), optionVals.timeSkip.maximum);
      // The amount of skips to perform.
      let willSkip = 0;
      // If the cycle has more years remaining than we can even skip, skip all of them.
      // I guess the idea here is to not skip through years of another cycle, if that
      // cycle may not be enabled for skipping.
      if (canSkip < remainingYearsCurrentCycle) {
        willSkip = canSkip;
      } else {
        willSkip += remainingYearsCurrentCycle;
        canSkip -= remainingYearsCurrentCycle;
        let skipCycles = 1;
        while (
          yearsPerCycle < canSkip &&
          optionVals.timeSkip[((currentCycle + skipCycles) % cyclesPerEra) as CycleIndices]
        ) {
          willSkip += yearsPerCycle;
          canSkip -= yearsPerCycle;
          skipCycles += 1;
        }
        if (
          optionVals.timeSkip[((currentCycle + skipCycles) % cyclesPerEra) as CycleIndices] &&
          0 < canSkip
        ) {
          willSkip += canSkip;
        }
      }
      // If we found we can skip any years, do so now.
      if (0 < willSkip) {
        const shatter = this._host.gamePage.timeTab.cfPanel.children[0].children[0]; // check?
        this._host.iactivity("act.time.skip", [willSkip], "ks-timeSkip");
        shatter.controller.doShatterAmt(shatter.model, willSkip);
        this._host.storeForSummary("time.skip", willSkip);
      }
    }
  }

  /**
   * Promote kittens.
   */
  promote(): void {
    // If we have Civil Service unlocked and a leader elected.
    if (
      this._host.gamePage.science.get("civil").researched &&
      this._host.gamePage.village.leader !== null
    ) {
      const leader = this._host.gamePage.village.leader;
      const rank = leader.rank;
      const gold = this._craftManager.getResource("gold");
      const goldStock = this._craftManager.getStock("gold");

      // this._host.gamePage.village.sim.goldToPromote will check gold
      // this._host.gamePage.village.sim.promote check both gold and exp
      // TODO: Obviously broken code here.
      if (
        this._host.gamePage.village.sim.goldToPromote(rank, rank + 1, gold - goldStock)[0] &&
        this._host.gamePage.village.sim.promote(leader, rank + 1) === 1
      ) {
        this._host.iactivity("act.promote", [rank + 1], "ks-promote");
        this._host.gamePage.tabs[1].censusPanel.census.renderGovernment(
          this._host.gamePage.tabs[1].censusPanel.census
        );
        this._host.gamePage.tabs[1].censusPanel.census.update();
        this._host.storeForSummary("promote", 1);
      }
    }
  }

  /**
   * Distribute kittens to jobs.
   */
  distribute(): void {
    const freeKittens = this._host.gamePage.village.getFreeKittens();
    if (!freeKittens) {
      return;
    }

    let jobName: Jobs | undefined;
    let minRatio = Infinity;
    let currentRatio = 0;
    // Find the job where to assign a kitten this frame.
    for (const job of this._host.gamePage.village.jobs) {
      const name = job.name;
      const unlocked = job.unlocked;
      const enabled = this._host.options.auto.distribute.items[name].enabled;
      const maxKittensInJob = this._host.gamePage.village.getJobLimit(name);
      const maxKittensToAssign = this._host.options.auto.distribute.items[name].max;
      const kittensInJob = job.value;
      const limited = this._host.options.auto.distribute.items[name].limited;
      if (
        unlocked &&
        enabled &&
        kittensInJob < maxKittensInJob &&
        (!limited || kittensInJob < maxKittensToAssign)
      ) {
        currentRatio = kittensInJob / maxKittensToAssign;
        if (currentRatio < minRatio) {
          minRatio = currentRatio;
          jobName = name;
        }
      }
    }
    // If a job was determined that should have a kitten assigned, assign it.
    if (jobName) {
      this._host.gamePage.village.assignJob(this._host.gamePage.village.getJob(jobName), 1);
      this._villageManager.render();
      this._host.iactivity(
        "act.distribute",
        [this._host.i18n(`$village.job.${jobName}` as const)],
        "ks-distribute"
      );
      this._host.storeForSummary("distribute", 1);
    }
  }

  /**
   * Feed leviathans.
   */
  autofeed(): void {
    const leviathanInfo = this._host.gamePage.diplomacy.get("leviathans");
    const necrocorns = this._host.gamePage.resPool.get("necrocorn");

    if (!leviathanInfo.unlocked || necrocorns.value === 0) {
      return;
    }

    if (1 <= necrocorns.value) {
      // If feeding the elders would increase their energy level towards the
      // cap, do it.
      if (leviathanInfo.energy < this._host.gamePage.diplomacy.getMarkerCap()) {
        this._host.gamePage.diplomacy.feedElders();
        this._host.iactivity("act.feed");
        this._host.storeForSummary("feed", 1);
      }
    } else {
      // We can reach this branch if we have partial necrocorns from resets.
      // The partial necrocorns will then be fead to the elders to bring us back
      // to even zero.
      if (0.25 * (1 + this._host.gamePage.getEffect("corruptionBoostRatio")) < 1) {
        this._host.storeForSummary("feed", necrocorns.value);
        this._host.gamePage.diplomacy.feedElders();
        this._host.iactivity("dispose.necrocorn");
      }
    }
  }

  /**
   * Blackcoin trading automation.
   */
  crypto(): void {
    const coinPrice = this._host.gamePage.calendar.cryptoPrice;
    const relicsInitial = this._host.gamePage.resPool.get("relic").value;
    const coinsInitial = this._host.gamePage.resPool.get("blackcoin").value;
    let coinsExchanged = 0.0;
    let relicsExchanged = 0.0;
    let waitForBestPrice = false;

    // Waits for coin price to drop below a certain treshold before starting the exchange process
    // TODO: This is obviously broken.
    if (waitForBestPrice === true && coinPrice < 860.0) {
      waitForBestPrice = false;
    }

    // All of this code is straight-forward. Buy low, sell high.

    // Exchanges up to a certain threshold, in order to keep a good exchange rate, then waits for a higher treshold before exchanging for relics.
    if (
      waitForBestPrice === false &&
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
      waitForBestPrice = true;

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

  explore(): void {
    const manager = this._explorationManager;
    const expeditionNode = this._host.gamePage.village.map.expeditionNode;

    if (expeditionNode === null) {
      manager.getCheapestNode();

      //manager.explore(manager.cheapestNodeX, manager.cheapestNodeY);

      //this._host.iactivity("act.explore", [manager.cheapestNodeX, manager.cheapestNodeY]);
    }
  }

  /**
   * Perform all the religion automations.
   */
  worship(): void {
    const additions = this._host.options.auto.religion.addition;

    // Build the best unicorn building if the option is enabled.
    // TODO: This is stupid, as it *only* builds unicorn buildings, instead of all
    //       religion buildings.
    if (additions.bestUnicornBuilding.enabled) {
      const bestUnicornBuilding = this.getBestUnicornBuilding();
      if (bestUnicornBuilding !== null) {
        if (bestUnicornBuilding === "unicornPasture") {
          this._buildManager.build(bestUnicornBuilding, 0, 1);
        } else {
          const buildingButton = mustExist(
            this._religionManager.getBuildButton(bestUnicornBuilding, UnicornItemVariant.Ziggurat)
          );
          let tearsNeeded = 0;
          // TODO: A simple `.find()` makes more sense here.
          for (const price of buildingButton.model.prices) {
            if (price.name === "tears") {
              tearsNeeded = price.val;
            }
          }

          const tearsAvailableForUse =
            this._craftManager.getValue("tears") - this._craftManager.getStock("tears");

          if (tearsAvailableForUse < tearsNeeded) {
            // if no ziggurat, getBestUnicornBuilding will return unicornPasture
            // TODO: ☝ Yeah. So?

            // How many times can we sacrifice unicorns to make tears?
            const maxSacrifice = Math.floor(
              (this._craftManager.getValue("unicorns") - this._craftManager.getStock("unicorns")) /
                2500
            );

            // How many sacrifices would we need, so we'd end up with enough tears.
            const needSacrifice = Math.ceil(
              (tearsNeeded - tearsAvailableForUse) /
                this._host.gamePage.bld.getBuildingExt("ziggurat").meta.on
            );

            // Sacrifice some unicorns to get the tears to buy the building.
            if (needSacrifice < maxSacrifice) {
              this._host.gamePage.religionTab.sacrificeBtn.controller._transform(
                this._host.gamePage.religionTab.sacrificeBtn.model,
                needSacrifice
              );
              // iactivity?
              // TODO: ☝ Yeah, seems like a good idea.
            }
          }

          // Build the best unicorn building.
          this._religionManager.build(bestUnicornBuilding, UnicornItemVariant.Ziggurat, 1);
        }
      }
    } else {
      // TODO: This seems needlessly complicated to filter out the unicorn pasture.
      //       Nothing in this branch makes any sense. Just build the buildings!
      const builds = Object.assign(
        {},
        this._host.options.auto.religion.items,
        Object.fromEntries(
          Object.entries(this._host.options.auto.religion.items).filter(
            ([k, v]) => v.variant !== UnicornItemVariant.Unknown_zp
          )
        )
      );
      // Now we build a unicorn pasture if possible.
      if (this._host.options.auto.religion.items.unicornPasture.enabled) {
        this.build({ unicornPasture: { require: false, enabled: true, max: 0 } });
      }
      // And then we build all other possible religion buildings.
      this._buildReligionBuildings(builds);
    }

    const faith = this._craftManager.getResource("faith");
    const faithLevel = faith.value / faith.maxValue;
    // enough faith, and then TAP (transcende, adore, praise)
    if (0.98 <= faithLevel) {
      const worship = this._host.gamePage.religion.faith;
      let epiphany = this._host.gamePage.religion.faithRatio;
      const transcendenceReached = mustExist(
        this._host.gamePage.religion.getRU("transcendence")
      ).on;
      let transcendenceTierCurrent = transcendenceReached
        ? this._host.gamePage.religion.transcendenceTier
        : 0;

      // Transcend
      if (additions.transcend.enabled && transcendenceReached) {
        // How much our adoration ratio increases from transcending.
        const adoreIncreaceRatio = Math.pow(
          (transcendenceTierCurrent + 2) / (transcendenceTierCurrent + 1),
          2
        );
        // The amount of worship needed to upgrade to the next level.
        const needNextLevel =
          this._host.gamePage.religion._getTranscendTotalPrice(transcendenceTierCurrent + 1) -
          this._host.gamePage.religion._getTranscendTotalPrice(transcendenceTierCurrent);

        // We want to determine the ideal value for when to trancend.
        // TODO: How exactly this works isn't understood yet.
        const x = needNextLevel;
        const k = adoreIncreaceRatio;
        const epiphanyRecommend =
          ((1 - k + Math.sqrt(80 * (k * k - 1) * x + (k - 1) * (k - 1))) * k) /
            (40 * (k + 1) * (k + 1) * (k - 1)) +
          x +
          x / (k * k - 1);

        if (epiphanyRecommend <= epiphany) {
          // code copy from kittens game's religion.js: this._host.gamePage.religion.transcend()
          // this._host.gamePage.religion.transcend() need confirm by player
          // game version: 1.4.8.1
          // ========================================================================================================
          // DO TRANSCEND START
          // ========================================================================================================
          this._host.gamePage.religion.faithRatio -= needNextLevel;
          this._host.gamePage.religion.tcratio += needNextLevel;
          this._host.gamePage.religion.transcendenceTier += 1;

          const atheism = mustExist(this._host.gamePage.challenges.getChallenge("atheism"));
          atheism.calculateEffects(atheism, this._host.gamePage);
          const blackObelisk = mustExist(this._host.gamePage.religion.getTU("blackObelisk"));
          blackObelisk.calculateEffects(blackObelisk, this._host.gamePage);

          this._host.gamePage.msg(
            this._host.i18nEngine("religion.transcend.msg.success", [
              this._host.gamePage.religion.transcendenceTier,
            ])
          );
          // ========================================================================================================
          // DO TRANSCEND END
          // ========================================================================================================

          epiphany = this._host.gamePage.religion.faithRatio;
          transcendenceTierCurrent = this._host.gamePage.religion.transcendenceTier;
          this._host.iactivity(
            "act.transcend",
            [this._host.gamePage.getDisplayValueExt(needNextLevel), transcendenceTierCurrent],
            "ks-transcend"
          );
          this._host.storeForSummary("transcend", 1);
        }
      }

      // Adore the galaxy (worship → epiphany)
      if (
        additions.adore.enabled &&
        mustExist(this._host.gamePage.religion.getRU("apocripha")).on
      ) {
        // game version: 1.4.8.1
        // solarRevolutionLimit is increased by black obelisks.
        const maxSolarRevolution = 10 + this._host.gamePage.getEffect("solarRevolutionLimit");
        // The absolute value at which to trigger adoring the galaxy.
        const triggerSolarRevolution = maxSolarRevolution * additions.adore.subTrigger;
        // How much epiphany we'll get from converting our worship.
        const epiphanyIncrease =
          (worship / 1000000) * transcendenceTierCurrent * transcendenceTierCurrent * 1.01;
        // How much epiphany we'll have after adoring.
        const epiphanyAfterAdore = epiphany + epiphanyIncrease;
        // How much worship we'll have after adoring.
        const worshipAfterAdore =
          0.01 +
          faith.value * (1 + this._host.gamePage.getUnlimitedDR(epiphanyAfterAdore, 0.1) * 0.1);
        // How much solar revolution bonus we'll have after adoring.
        const solarRevolutionAfterAdore = this._host.gamePage.getLimitedDR(
          this._host.gamePage.getUnlimitedDR(worshipAfterAdore, 1000) / 100,
          maxSolarRevolution
        );
        // After adoring the galaxy, we want a single praise to be able to reach the trigger
        // level of solar revolution bonus.
        if (triggerSolarRevolution <= solarRevolutionAfterAdore) {
          // Perform the actual adoration.
          this._host.gamePage.religion._resetFaithInternal(1.01);

          // Log the action.
          this._host.iactivity(
            "act.adore",
            [
              this._host.gamePage.getDisplayValueExt(worship),
              this._host.gamePage.getDisplayValueExt(epiphanyIncrease),
            ],
            "ks-adore"
          );
          this._host.storeForSummary("adore", epiphanyIncrease);
          // TODO: Not sure what the point of updating these values would be
          //       We're at the end of the branch.
          //epiphany = this._host.gamePage.religion.faithRatio;
          //worship = this._host.gamePage.religion.faith;
        }
      }
    }

    // Praise (faith → worhsip)
    if (additions.autoPraise.enabled && additions.autoPraise.subTrigger <= faithLevel) {
      let apocryphaBonus;
      if (!this._host.gamePage.religion.getFaithBonus) {
        apocryphaBonus = this._host.gamePage.religion.getApocryphaBonus();
      } else {
        apocryphaBonus = this._host.gamePage.religion.getFaithBonus();
      }

      // Determine how much worship we'll gain and log it.
      const worshipIncrease = faith.value * (1 + apocryphaBonus);
      this._host.storeForSummary("praise", worshipIncrease);
      this._host.iactivity(
        "act.praise",
        [
          this._host.gamePage.getDisplayValueExt(faith.value),
          this._host.gamePage.getDisplayValueExt(worshipIncrease),
        ],
        "ks-praise"
      );

      // Now finally praise the sun.
      this._host.gamePage.religion.praise();
    }
  }

  private _buildReligionBuildings(builds: Partial<Record<FaithItem, ReligionSettingsItem>>): void {
    const trigger = this._host.options.auto.religion.trigger;

    // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
    this._religionManager.manager.render();

    const metaData: Partial<
      Record<FaithItem, ReligionUpgradeInfo | TranscendenceUpgradeInfo | ZiggurathUpgradeInfo>
    > = {};
    for (const [name, build] of objectEntries<FaithItem, ReligionSettingsItem>(builds)) {
      const buildInfo = this._religionManager.getBuild(name, build.variant);
      if (buildInfo === null) {
        continue;
      }
      metaData[name] = buildInfo;
      const buildMetaData = mustExist(metaData[name]);

      // If an item is marked as `rHidden`, it wouldn't be build.
      // TODO: Why not remove it from the `builds` then?
      if (!this._religionManager.getBuildButton(name, build.variant)) {
        buildMetaData.rHidden = true;
      } else {
        const model = mustExist(this._religionManager.getBuildButton(name, build.variant)).model;
        const panel =
          build.variant === UnicornItemVariant.Cryptotheology
            ? this._host.gamePage.science.get("cryptotheology").researched
            : true;
        buildMetaData.rHidden = !(model.visible && model.enabled && panel);
      }
    }

    // Let the bulk manager figure out which of the builds to actually build.
    const buildList = this._bulkManager.bulk(builds, metaData, trigger);

    let refreshRequired = false;
    for (const entry in buildList) {
      if (0 < buildList[entry].count) {
        this._religionManager.build(
          buildList[entry].id as ReligionUpgrades | TranscendenceUpgrades | ZiggurathUpgrades,
          mustExist(buildList[entry].variant) as UnicornItemVariant,
          buildList[entry].count
        );
        refreshRequired = true;
      }
    }

    // If we built any religion buildings, refresh the UI.
    if (refreshRequired) {
      this._host.gamePage.ui.render();
    }
  }

  /**
   * Build selected time-related buildings.
   */
  chrono(): void {
    if (!this._host.gamePage.timeTab.visible) {
      return;
    }
    const builds = this._host.options.auto.time.items;
    const trigger = this._host.options.auto.time.trigger;

    // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
    this._timeManager.manager.render();

    const metaData: Partial<Record<TimeItem, ChronoForgeUpgradeInfo | VoidSpaceUpgradeInfo>> = {};
    for (const [name, build] of objectEntries(builds)) {
      metaData[name] = mustExist(this._timeManager.getBuild(name, build.variant));

      const model = mustExist(this._timeManager.getBuildButton(name, build.variant)).model;
      const panel =
        build.variant === TimeItemVariant.Chronoforge
          ? this._timeManager.manager.tab.cfPanel
          : this._timeManager.manager.tab.vsPanel;

      const buildingMetaData = mustExist(metaData[name]);
      buildingMetaData.tHidden = !model.visible || !model.enabled || !panel?.visible;
    }

    const buildList = this._bulkManager.bulk(builds, metaData, trigger);

    let refreshRequired = false;
    for (const entry in buildList) {
      if (buildList[entry].count > 0) {
        this._timeManager.build(
          buildList[entry].id as ChronoForgeUpgrades | VoidSpaceUpgrades,
          buildList[entry].variant as TimeItemVariant,
          buildList[entry].count
        );
        refreshRequired = true;
      }
    }

    if (refreshRequired) {
      this._host.gamePage.ui.render();
    }
  }

  /**
   * Upgrade all possible unlockables.
   * @returns Nothing.
   */
  upgrade(): void {
    const upgrades = this._host.options.auto.unlock.items;
    const upgradeManager = this._upgradeManager;
    const craftManager = this._craftManager;
    const bulkManager = this._bulkManager;
    const buildManager = this._buildManager;

    // Ensure all the tabs have their current UI state updated.
    upgradeManager.workshopManager.render();
    upgradeManager.scienceManager.render();
    upgradeManager.spaceManager.render();

    // If upgrades (workshop items) are enabled...
    if (upgrades.upgrades.enabled && this._host.gamePage.tabs[3].visible) {
      const workshopUpgrades = this._host.gamePage.workshop.upgrades;
      // TODO: Filter out upgrades that are not beneficial when using KS, like workshop automation.
      workLoop: for (const upgrade in workshopUpgrades) {
        // If the upgrade is already purchased or not available yet, continue with the next one.
        if (workshopUpgrades[upgrade].researched || !workshopUpgrades[upgrade].unlocked) {
          continue;
        }

        // Create a copy of the prices for this upgrade, so that we can apply effects to it.
        let prices = dojo.clone(workshopUpgrades[upgrade].prices);
        prices = this._host.gamePage.village.getEffectLeader("scientist", prices);
        for (const resource in prices) {
          // If we can't afford this resource price, continue with the next upgrade.
          if (craftManager.getValueAvailable(prices[resource].name, true) < prices[resource].val) {
            continue workLoop;
          }
        }

        // If we can afford all prices, purchase the upgrade.
        upgradeManager.build(workshopUpgrades[upgrade], "workshop");
      }
    }

    // If techs (science items) are enabled...
    if (upgrades.techs.enabled && this._host.gamePage.tabs[2].visible) {
      // These behave identically to the workshop uprades above.
      const scienceUpgrades = this._host.gamePage.science.techs;
      techLoop: for (const upgrade in scienceUpgrades) {
        if (scienceUpgrades[upgrade].researched || !scienceUpgrades[upgrade].unlocked) {
          continue;
        }

        let prices = dojo.clone(scienceUpgrades[upgrade].prices);
        prices = this._host.gamePage.village.getEffectLeader("scientist", prices);
        for (const resource in prices) {
          if (craftManager.getValueAvailable(prices[resource].name, true) < prices[resource].val) {
            continue techLoop;
          }
        }
        upgradeManager.build(scienceUpgrades[upgrade], "science");
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
        for (const resource in prices) {
          // If we can't afford this resource price, continue with the next mission.
          if (craftManager.getValueAvailable(prices[resource].name, true) < prices[resource].val) {
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
   * @param builds The buildings to build.
   */
  build(
    builds: Partial<Record<BuildItem, BonfireSettingsItem>> = this._host.options.auto.build.items
  ): void {
    const buildManager = this._buildManager;
    const bulkManager = this._bulkManager;
    const trigger = this._host.options.auto.build.trigger;

    // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
    buildManager.manager.render();

    // Get the current metadata for all the referenced buildings.
    const metaData: Partial<Record<BuildItem, BuildingMeta>> = {};
    for (const [name, build] of objectEntries(builds)) {
      metaData[name] = buildManager.getBuild((build.name ?? name) as Building).meta;
    }

    // Let the bulkmanager determine the builds we can make.
    const buildList = bulkManager.bulk(builds, metaData, trigger, "bonfire");

    let refreshRequired = false;
    // Build all entries in the build list, where we can build any items.
    for (const entry in buildList) {
      if (buildList[entry].count > 0) {
        buildManager.build(
          (buildList[entry].name || buildList[entry].id) as Building,
          buildList[entry].stage,
          buildList[entry].count
        );
        refreshRequired = true;
      }
    }

    if (refreshRequired) {
      this._host.gamePage.ui.render();
    }
  }

  /**
   * Build space buildings.
   * This is pretty much identical to the bonfire buildings.
   */
  space(): void {
    const builds = this._host.options.auto.space.items;
    const buildManager = this._spaceManager;
    const bulkManager = this._bulkManager;
    const trigger = this._host.options.auto.space.trigger;

    // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
    buildManager.manager.render();

    const metaData: Partial<Record<SpaceItem, SpaceBuildingInfo>> = {};
    for (const [name, build] of objectEntries(builds)) {
      metaData[name] = buildManager.getBuild(name);
    }

    const buildList = bulkManager.bulk(builds, metaData, trigger, "space");

    let refreshRequired = false;
    for (const entry in buildList) {
      if (buildList[entry].count > 0) {
        buildManager.build(buildList[entry].id as SpaceBuildings, buildList[entry].count);
        refreshRequired = true;
      }
    }
    if (refreshRequired) {
      this._host.gamePage.ui.render();
    }
  }

  /**
   * Perform crafting as configured in the crafting options.
   */
  craft(): void {
    // TODO: One of the core limitations here is that only a single resource
    //       is taken into account, the one set as `require` in the definition.
    const crafts = this._host.options.auto.craft.items;
    const manager = this._craftManager;
    const trigger = this._host.options.auto.craft.trigger;

    for (const [name, craft] of objectEntries(crafts)) {
      // This will always be `false` while `max` is hardcoded to `0`.
      // Otherwise, it would contain the current resource information.
      const current = !craft.max ? false : manager.getResource(name);
      // The resource information for the requirement of this craft, if any.
      const require = !craft.require ? false : manager.getResource(craft.require);
      let amount = 0;
      // Ensure that we have reached our cap
      // This will never happen as `current` is always `false`.
      if (current && current.value > craft.max) continue;

      // If we can't even craft a single item of the resource, skip it.
      if (!manager.singleCraftPossible(name)) {
        continue;
      }

      // Craft the resource if it doesn't require anything or we hit the requirement trigger.
      if (!require || trigger <= require.value / require.maxValue) {
        amount = manager.getLowestCraftAmount(name, craft.limited, craft.limRat, true);

        // If a resource DOES "require" another resource AND its trigger value has NOT been hit
        // yet AND it is limited... What?
      } else if (craft.limited) {
        amount = manager.getLowestCraftAmount(name, craft.limited, craft.limRat, false);
      }

      // If we can craft any of this item, do it.
      if (amount > 0) {
        manager.craft(name, amount);
      }
    }
  }

  holdFestival(): void {
    // If we haven't researched festivals yet, or still have more than 400 days left on one,
    // don't hold (another) one.
    if (
      !this._host.gamePage.science.get("drama").researched ||
      400 < this._host.gamePage.calendar.festivalDays
    ) {
      return;
    }

    // If we don't have stacked festivals researched yet, and we still have days left on one,
    // don't hold one.
    if (
      !this._host.gamePage.prestige.getPerk("carnivals").researched &&
      0 < this._host.gamePage.calendar.festivalDays
    ) {
      return;
    }

    // Check if we can afford a festival.
    const craftManager = this._craftManager;
    if (
      craftManager.getValueAvailable("manpower", true) < 1500 ||
      craftManager.getValueAvailable("culture", true) < 5000 ||
      craftManager.getValueAvailable("parchment", true) < 2500
    ) {
      return;
    }

    // Check if the festival would even be profitable for any resource production.
    const catpowProfitable =
      4000 * (craftManager.getTickVal(craftManager.getResource("manpower"), true) as number) > 1500;
    const cultureProfitable =
      4000 * (craftManager.getTickVal(craftManager.getResource("culture"), true) as number) > 5000;
    const parchProfitable =
      4000 * (craftManager.getTickVal(craftManager.getResource("parchment"), true) as number) >
      2500;

    if (!(catpowProfitable && cultureProfitable && parchProfitable)) {
      return;
    }

    // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
    this._villageManager.render();

    // Now we hold the festival.
    if (this._host.gamePage.villageTab.festivalBtn.model.enabled) {
      const beforeDays = this._host.gamePage.calendar.festivalDays;
      this._host.gamePage.villageTab.festivalBtn.onClick();
      this._host.storeForSummary("festival");
      if (beforeDays > 0) {
        this._host.iactivity("festival.extend", [], "ks-festival");
      } else {
        this._host.iactivity("festival.hold", [], "ks-festival");
      }
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

  /**
   * Send kittens on a hunt.
   */
  hunt(): void {
    const manpower = this._craftManager.getResource("manpower");
    const subTrigger = this._host.options.auto.options.items.hunt.subTrigger ?? 0;

    if (subTrigger <= manpower.value / manpower.maxValue && 100 <= manpower.value) {
      // Determine how many hunts are being performed.
      let huntCount = Math.floor(manpower.value / 100);
      this._host.storeForSummary("hunt", huntCount);
      this._host.iactivity("act.hunt", [huntCount], "ks-hunt");

      huntCount = Math.floor(manpower.value / 100);
      const averageOutput = this._craftManager.getAverageHunt();
      const trueOutput: Partial<Record<Resource, number>> = {};

      for (const [out, outValue] of objectEntries(averageOutput)) {
        const res = this._craftManager.getResource(out);
        trueOutput[out] =
          // If this is a capped resource...
          0 < res.maxValue
            ? // multiply the amount of times we hunted with the result of an averag hunt.
              // Cappting at the max value and 0 bounds.
              Math.min(outValue * huntCount, Math.max(res.maxValue - res.value, 0))
            : // Otherwise, just multiply unbounded
              outValue * huntCount;
      }

      // Store the hunted resources in the cache. Why? No idea.
      this._cacheManager.pushToCache({
        materials: trueOutput,
        timeStamp: this._host.gamePage.timer.ticksTotal,
      });

      // Now actually perform the hunts.
      this._host.gamePage.village.huntAll();
    }
  }

  trade(): void {
    this._tradeManager.manager.render();

    // If we can't make any trades, bail out.
    if (!this._tradeManager.singleTradePossible()) {
      return;
    }

    // The races we might want to trade with during this frame.
    const trades: Array<Race> = [];

    const gold = this._craftManager.getResource("gold");
    const requireTrigger = this._host.options.auto.trade.trigger;
    const season = this._host.gamePage.calendar.getCurSeason().name;

    // Determine how many races we will trade with this cycle.
    for (const [name, trade] of objectEntries(this._host.options.auto.trade.items)) {
      const race = this._tradeManager.getRace(name);

      // Check if the race is enabled, in season, unlocked, and we can actually afford it.
      if (
        !trade.enabled ||
        !trade[season] ||
        !race.unlocked ||
        !this._tradeManager.singleTradePossible(name)
      ) {
        continue;
      }

      // Additionally, we now check if the trade button is enabled, which kinda makes all previous
      // checks moot, but whatever :D
      const button = this._tradeManager.getTradeButton(race.name);
      if (!button.model.enabled) {
        continue;
      }

      // Determine which resource the race requires for trading, if any.
      const require = !trade.require ? false : this._craftManager.getResource(trade.require);

      // Check if this trade would be profitable.
      const profitable = this._tradeManager.getProfitability(name);
      // If the trade is set to be limited and profitable, make this trade.
      if (trade.limited && profitable) {
        trades.push(name);
      } else if (
        // If this trade is not limited, it must either not require anything, or
        // the required resource must be over the trigger value.
        // Additionally, gold must also be over the trigger value.
        (!require || requireTrigger <= require.value / require.maxValue) &&
        requireTrigger <= gold.value / gold.maxValue
      ) {
        trades.push(name);
      }
    }

    // If no possible trades were found, bail out.
    if (trades.length === 0) {
      return;
    }

    // Figure out how much we can currently trade
    let maxTrades = this._tradeManager.getLowestTradeAmount(null, true, false);

    // If no trades are possible, bail out.
    if (maxTrades < 1) {
      return;
    }

    // Distribute max trades without starving any race.

    // This array should hold the amount of trades possible with each race.
    // The indices between this array and `trades` align.
    const maxByRace: Array<number> = [];
    // For all races we consider trading with, perform a more thorough check
    // if we actually can trade with them and how many times we could trade
    // with them.
    for (let tradeIndex = 0; tradeIndex < trades.length; tradeIndex++) {
      const race = trades[tradeIndex];
      const tradeSettings = this._host.options.auto.trade.items[race];
      // Does this trade require a certain resource?
      const require = !tradeSettings.require
        ? false
        : this._craftManager.getResource(tradeSettings.require);
      // Have the trigger conditions for this trade been met?
      const trigConditions =
        (!require || requireTrigger <= require.value / require.maxValue) &&
        requireTrigger <= gold.value / gold.maxValue;
      // How many trades could we do?
      const tradePos = this._tradeManager.getLowestTradeAmount(
        race,
        tradeSettings.limited,
        trigConditions
      );
      // If no trades are possible, remove the race.
      if (tradePos < 1) {
        trades.splice(tradeIndex, 1);
        tradeIndex--;
        continue;
      }

      maxByRace.push(tradePos);
    }

    // If no trades are left over after this check, bail out.
    if (trades.length === 0) {
      return;
    }

    // Now let's do some trades.

    // This keeps track of how many trades we've done with each race.
    const tradesDone: Partial<Record<Race, number>> = {};
    // While we have races left to trade with, and enough resources to trade (this
    // is indicated by `maxTrades`)...
    while (0 < trades.length && 1 <= maxTrades) {
      // If we can make fewer trades than we have resources available for...
      if (maxTrades < trades.length) {
        // ...find a random race to trade with
        const randomRaceIndex = Math.floor(Math.random() * trades.length);
        // Init the counter if necessary.
        if (!tradesDone[trades[randomRaceIndex]]) {
          tradesDone[trades[randomRaceIndex]] = 0;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        tradesDone[trades[randomRaceIndex]]! += 1;
        maxTrades -= 1;

        // As we are constrained on resources, don't trade with this race again.
        // We want to distribute the few resources we have between races.
        trades.splice(randomRaceIndex, 1);
        maxByRace.splice(randomRaceIndex, 1);
        continue;
      }

      // We now want to determine which race we can trade with the least amount
      // of times.
      // This likely to determine the "best" trades to perform.
      // The result is that we trade first with the races that we can make the
      // least amount of trades with, then continue to make trades with the
      // races we can make more trades with (although that amount could be reduced
      // by the time we get to them).
      let minTrades = Math.floor(maxTrades / trades.length);
      let minTradeIndex = 0;
      for (let tradeIndex = 0; tradeIndex < trades.length; ++tradeIndex) {
        if (maxByRace[tradeIndex] < minTrades) {
          minTrades = maxByRace[tradeIndex];
          minTradeIndex = tradeIndex;
        }
      }

      // Store this trade in the trades we've "done".
      if (!tradesDone[trades[minTradeIndex]]) {
        tradesDone[trades[minTradeIndex]] = 0;
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tradesDone[trades[minTradeIndex]]! += minTrades;
      maxTrades -= minTrades;
      trades.splice(minTradeIndex, 1);
      maxByRace.splice(minTradeIndex, 1);
    }

    // If we found no trades to do, bail out.
    if (Object.values(tradesDone).length === 0) {
      return;
    }

    // Calculate how much we will spend and earn from trades.
    // This is straight forward.
    const tradeNet: Partial<Record<Resource, number>> = {};
    for (const [name, amount] of objectEntries(tradesDone)) {
      const race = this._tradeManager.getRace(name);

      const materials = this._tradeManager.getMaterials(name);
      for (const [mat, matAmount] of objectEntries(materials)) {
        if (!tradeNet[mat]) {
          tradeNet[mat] = 0;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        tradeNet[mat]! -= matAmount * amount;
      }

      const meanOutput = this._tradeManager.getAverageTrade(race);
      for (const [out, outValue] of objectEntries(meanOutput)) {
        const res = this._craftManager.getResource(out);
        if (!tradeNet[out]) {
          tradeNet[out] = 0;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        tradeNet[out]! +=
          res.maxValue > 0
            ? Math.min(
                mustExist(meanOutput[out]) * mustExist(tradesDone[name]),
                Math.max(res.maxValue - res.value, 0)
              )
            : outValue * mustExist(tradesDone[name]);
      }
    }

    // Update the cache with the changes produced from the trades.
    this._cacheManager.pushToCache({
      materials: tradeNet,
      timeStamp: this._host.gamePage.timer.ticksTotal,
    });

    // Now actually perform the calculated trades.
    for (const [name, count] of objectEntries(tradesDone)) {
      // TODO: This check should be redundant. If no trades were possible,
      //       the entry shouldn't even exist.
      if (0 < count) {
        this._tradeManager.trade(name, count);
      }
    }
  }

  /**
   * All automations that didn't have a better place.
   * - Building embassies
   * - Fixing cryochambers
   * - Turn on Steamworks (they're always off initially)
   */
  miscOptions(): void {
    const craftManager = this._craftManager;
    const buildManager = this._buildManager;
    const optionVals = this._host.options.auto.options.items;

    // Tries to calculate how many embassies for which races it can buy,
    // then it buys them. Code should be straight-forward.
    AutoEmbassy: if (
      optionVals.buildEmbassies.enabled &&
      !!this._host.gamePage.diplomacy.races[0].embassyPrices
    ) {
      const culture = craftManager.getResource("culture");
      let cultureVal = 0;
      const subTrigger = optionVals.buildEmbassies.subTrigger ?? 0;
      if (subTrigger <= culture.value / culture.maxValue) {
        const racePanels = this._host.gamePage.diplomacyTab.racePanels;
        cultureVal = craftManager.getValueAvailable("culture", true);

        const embassyBulk: Partial<
          Record<
            Race,
            {
              val: number;
              basePrice: number;
              currentEm: number;
              priceSum: number;
              race: RaceInfo;
            }
          >
        > = {};
        const bulkTracker: Array<Race> = [];

        for (let panelIndex = 0; panelIndex < racePanels.length; panelIndex++) {
          if (!racePanels[panelIndex].embassyButton) {
            continue;
          }
          const name = racePanels[panelIndex].race.name;
          const race = this._host.gamePage.diplomacy.get(name);
          embassyBulk[name] = {
            val: 0,
            basePrice: race.embassyPrices[0].val,
            currentEm: race.embassyLevel,
            priceSum: 0,
            race: race,
          };
          bulkTracker.push(name);
        }

        if (bulkTracker.length === 0) {
          break AutoEmbassy;
        }

        let refreshRequired = false;

        while (bulkTracker.length > 0) {
          for (let raceIndex = 0; raceIndex < bulkTracker.length; raceIndex++) {
            const name = bulkTracker[raceIndex];
            const emBulk = mustExist(embassyBulk[name]);
            const nextPrice = emBulk.basePrice * Math.pow(1.15, emBulk.currentEm + emBulk.val);
            if (nextPrice <= cultureVal) {
              cultureVal -= nextPrice;
              emBulk.priceSum += nextPrice;
              emBulk.val += 1;
              refreshRequired = true;
            } else {
              bulkTracker.splice(raceIndex, 1);
              --raceIndex;
            }
          }
        }

        for (const [name, emBulk] of objectEntries(embassyBulk)) {
          if (emBulk.val === 0) {
            continue;
          }
          cultureVal = craftManager.getValueAvailable("culture", true);
          if (cultureVal < emBulk.priceSum) {
            this._host.warning(
              "Something has gone horribly wrong." + [emBulk.priceSum, cultureVal]
            );
          }
          this._host.gamePage.resPool.resources[13].value -= emBulk.priceSum;
          emBulk.race.embassyLevel += emBulk.val;
          this._host.storeForSummary("embassy", emBulk.val);
          if (emBulk.val !== 1) {
            this._host.iactivity("build.embassies", [emBulk.val, emBulk.race.title], "ks-trade");
          } else {
            this._host.iactivity("build.embassy", [emBulk.val, emBulk.race.title], "ks-trade");
          }
        }

        if (refreshRequired) {
          this._host.gamePage.ui.render();
        }
      }
    }

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

  /**
   * Determine the best unicorn-related building to buy next.
   * This is the building where the cost is in the best proportion to the
   * unicorn production bonus it generates.
   * @see https://github.com/Bioniclegenius/NummonCalc/blob/112f716e2fde9956dfe520021b0400cba7b7113e/NummonCalc.js#L490
   * @returns The best unicorn building.
   */
  getBestUnicornBuilding(): ZiggurathUpgrades | null {
    const pastureButton = this._buildManager.getBuildButton("unicornPasture");
    if (pastureButton === null) {
      return null;
    }

    const validBuildings = [
      "unicornTomb",
      "ivoryTower",
      "ivoryCitadel",
      "skyPalace",
      "unicornUtopia",
      "sunspire",
    ];

    // How many unicorns are produced per second.
    const unicornsPerSecondBase =
      this._host.gamePage.getEffect("unicornsPerTickBase") *
      this._host.gamePage.getTicksPerSecondUI();
    // Unicorn ratio modifier. For example, through "unicorn selection".
    const globalRatio = this._host.gamePage.getEffect("unicornsGlobalRatio") + 1;
    // The unicorn ratio modifier through religion buildings.
    const religionRatio = this._host.gamePage.getEffect("unicornsRatioReligion") + 1;
    // The ratio modifier through paragon.
    const paragonRatio = this._host.gamePage.prestige.getParagonProductionRatio() + 1;
    // Bonus from collected faith.
    const faithBonus = this._host.gamePage.religion.getSolarRevolutionRatio() + 1;

    const currentCycleIndex = this._host.gamePage.calendar.cycle;
    const currentCycle = this._host.gamePage.calendar.cycles[currentCycleIndex];

    // The modifier applied by the current cycle and holding a festival.
    let cycleBonus = 1;
    // If the current cycle has an effect on unicorn production during festivals
    // TODO: Simplify
    if (currentCycle.festivalEffects["unicorns"] !== undefined) {
      // Numeromancy is the metaphysics upgrade that grants bonuses based on cycles.
      if (
        this._host.gamePage.prestige.getPerk("numeromancy").researched &&
        this._host.gamePage.calendar.festivalDays
      ) {
        cycleBonus = currentCycle.festivalEffects["unicorns"];
      }
    }

    const unicornsPerSecond =
      unicornsPerSecondBase * globalRatio * religionRatio * paragonRatio * faithBonus * cycleBonus;

    // Based on how many zigguraths we have.
    const ziggurathRatio = Math.max(this._host.gamePage.bld.getBuildingExt("ziggurat").meta.on, 1);
    // How many unicorns do we receive in a unicorn rift?
    const baseUnicornsPerRift =
      500 * (1 + this._host.gamePage.getEffect("unicornsRatioReligion") * 0.1);

    // How likely are unicorn rifts to happen? The unicornmancy metaphysics upgrade increases this chance.
    let riftChanceRatio = 1;
    if (this._host.gamePage.prestige.getPerk("unicornmancy").researched) {
      riftChanceRatio *= 1.1;
    }
    // ?
    const unicornRiftChange =
      ((this._host.gamePage.getEffect("riftChance") * riftChanceRatio) / (10000 * 2)) *
      baseUnicornsPerRift;

    // We now want to determine how quickly the cost of given building is neutralized
    // by its effect on production of unicorns.

    let bestAmoritization = Infinity;
    let bestBuilding: ZiggurathUpgrades | null = null;
    const unicornsPerTickBase = mustExist(
      this._host.gamePage.bld.getBuildingExt("unicornPasture").meta.effects["unicornsPerTickBase"]
    );
    const pastureProduction =
      unicornsPerTickBase *
      this._host.gamePage.getTicksPerSecondUI() *
      globalRatio *
      religionRatio *
      paragonRatio *
      faithBonus *
      cycleBonus;

    // If the unicorn pasture amortizes itself in less than infinity ticks,
    // set it as the default. This is likely to protect against cases where
    // production of unicorns is 0.
    const pastureAmortization = pastureButton.model.prices[0].val / pastureProduction;
    if (pastureAmortization < bestAmoritization) {
      bestAmoritization = pastureAmortization;
      bestBuilding = "unicornPasture";
    }

    // For all ziggurath upgrade buttons...
    for (const button of this._religionManager.manager.tab.zgUpgradeButtons) {
      // ...that are in the "valid" buildings (are unicorn-related) and visible (unlocked)...
      if (validBuildings.includes(button.id) && button.model.visible) {
        // Determine a price value for this building.
        let unicornPrice = 0;
        for (const priceIndex in button.model.prices) {
          // Add the amount of unicorns the building costs (if any).
          if (button.model.prices[priceIndex].name === "unicorns") {
            unicornPrice += button.model.prices[priceIndex].val;
          }
          // Tears result from unicorn sacrifices, so factor that into the price proportionally.
          if (button.model.prices[priceIndex].name === "tears") {
            unicornPrice += (button.model.prices[priceIndex].val * 2500) / ziggurathRatio;
          }
        }

        // Determine the effect the building will have on unicorn production and unicorn rifts.
        const buildingInfo = mustExist(this._host.gamePage.religion.getZU(button.id));
        let religionBonus = religionRatio;
        let riftChance = this._host.gamePage.getEffect("riftChance");
        for (const effect in buildingInfo.effects) {
          if (effect === "unicornsRatioReligion") {
            religionBonus += mustExist(buildingInfo.effects.unicornsRatioReligion);
          }
          if (effect === "riftChance") {
            riftChance += mustExist(buildingInfo.effects.riftChance);
          }
        }

        // The rest should be straight forward.
        const unicornsPerRift = 500 * ((religionBonus - 1) * 0.1 + 1);
        let riftBonus = ((riftChance * riftChanceRatio) / (10000 * 2)) * unicornsPerRift;
        riftBonus -= unicornRiftChange;
        let buildingProduction =
          unicornsPerSecondBase *
          globalRatio *
          religionBonus *
          paragonRatio *
          faithBonus *
          cycleBonus;
        buildingProduction -= unicornsPerSecond;
        buildingProduction += riftBonus;
        const amortization = unicornPrice / buildingProduction;

        if (amortization < bestAmoritization) {
          if (0 < riftBonus || (religionRatio < religionBonus && 0 < unicornPrice)) {
            bestAmoritization = amortization;
            bestBuilding = button.id;
          }
        }
      }
    }
    return bestBuilding;
  }
}
