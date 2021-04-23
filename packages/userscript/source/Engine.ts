import { BuildManager } from "./BuildManager";
import { BulkManager } from "./BulkManager";
import { CacheManager } from "./CacheManager";
import { CraftManager } from "./CraftManager";
import { ExplorationManager } from "./ExplorationManager";
import { BuildItemOptions, BuildItem, FaithItem, UnicornFaithItemOptions } from "./Options";
import { ReligionManager } from "./ReligionManager";
import { SpaceManager } from "./SpaceManager";
import { TabManager } from "./TabManager";
import { TimeManager } from "./TimeManager";
import { objectEntries } from "./tools/Entries";
import { TradeManager } from "./TradeManager";
import { BuildButton, Building } from "./types";
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

  start(msg = true): void {
    if (this.loop) return;

    this.loop = setInterval(this.iterate.bind(this), this._host.options.interval);
    if (msg) this._host.imessage("status.ks.enable");
  }

  stop(msg = true): void {
    if (!this.loop) return;

    clearInterval(this.loop);
    this.loop = undefined;
    if (msg) this._host.imessage("status.ks.disable");
  }

  async iterate(): Promise<void> {
    const subOptions = this._host.options.auto.options;
    if (subOptions.enabled && subOptions.items.observe.enabled) {
      this.observeStars();
    }
    if (this._host.options.auto.upgrade.enabled) {
      this.upgrade();
    }
    if (subOptions.enabled && subOptions.items.festival.enabled) {
      this.holdFestival();
    }
    if (this._host.options.auto.build.enabled) {
      this.build();
    }
    if (this._host.options.auto.space.enabled) {
      this.space();
    }
    if (this._host.options.auto.craft.enabled) {
      this.craft();
    }
    if (subOptions.enabled && subOptions.items.hunt.enabled) {
      this.hunt();
    }
    if (this._host.options.auto.trade.enabled) {
      this.trade();
    }
    if (this._host.options.auto.faith.enabled) {
      this.worship();
    }
    if (this._host.options.auto.time.enabled) {
      this.chrono();
    }
    if (subOptions.enabled && subOptions.items.crypto.enabled) {
      this.crypto();
    }
    if (subOptions.enabled && subOptions.items.explore.enabled) {
      this.explore();
    }
    if (subOptions.enabled && subOptions.items.autofeed.enabled) {
      this.autofeed();
    }
    if (subOptions.enabled && subOptions.items.promote.enabled) {
      this.promote();
    }
    if (this._host.options.auto.distribute.enabled) {
      this.distribute();
    }
    if (this._host.options.auto.timeCtrl.enabled) {
      this.timeCtrl();
    }
    if (subOptions.enabled) {
      this.miscOptions();
    }
    if (
      this._host.options.auto.timeCtrl.enabled &&
      this._host.options.auto.timeCtrl.items.reset.enabled
    ) {
      await this.reset();
    }
  }

  async reset(): Promise<void> {
    // check challenge
    if (this._host.gamePage.challenges.currentChallenge) return;

    const checkedList = [];
    const checkList:Array<string> = [];
    const check = function (buttons:Array<BuildButton>) {
      if (checkList.length != 0) {
        for (let i in buttons) {
          if (!buttons[i].model.metadata) continue;
          let name = buttons[i].model.metadata.name;
          let index = checkList.indexOf(name);
          if (index != -1) {
            checkList.splice(index, 1);
            if (this._host.gamePage.resPool.hasRes(buttons[i].model.prices)) return true;
          }
        }
      }
      return false;
    };

    // check building
    let opt = this._host.options.auto.build.items;
    for (var name in opt)
      if (opt[name].checkForReset) {
        var bld = this._host.gamePage.bld.get(name);
        checkedList.push({ name: bld.label, trigger: opt[name].triggerForReset, val: bld.val });
        if (opt[name].triggerForReset > 0) {
          if (opt[name].triggerForReset > bld.val) return;
        } else {
          checkList.push(name);
        }
      }
    // unicornPasture
    opt = this._host.options.auto.unicorn.items.unicornPasture;
    if (opt.checkForReset) {
      var bld = this._host.gamePage.bld.get("unicornPasture");
      checkedList.push({ name: bld.label, trigger: opt.triggerForReset, val: bld.val });
      if (opt.triggerForReset > 0) {
        if (opt.triggerForReset > bld.val) return;
      } else {
        checkList.push("unicornPasture");
      }
    }
    if (check(this._buildManager.manager.tab.buttons) || checkList.length) return;

    // check space
    opt = this._host.options.auto.space.items;
    for (var name in opt)
      if (opt[name].checkForReset) {
        var bld = this._host.gamePage.space.getBuilding(name);
        checkedList.push({ name: bld.label, trigger: opt[name].triggerForReset, val: bld.val });
        if (opt[name].triggerForReset > 0) {
          if (opt[name].triggerForReset > bld.val) return;
        } else {
          checkList.push(name);
        }
      }
    if (checkList.length != 0) {
      const panels = this._spaceManager.manager.tab.planetPanels;
      for (var i in panels) {
        for (const j in panels[i].children) {
          const model = panels[i].children[j].model;
          var name = model.metadata.name;
          const index = checkList.indexOf(name);
          if (index != -1) {
            checkList.splice(index, 1);
            if (this._host.gamePage.resPool.hasRes(model.prices)) this.return;
          }
        }
      }
    }
    if (checkList.length) return;

    // check religion
    opt = this._host.options.auto.faith.items;
    for (var name in opt)
      if (opt[name].checkForReset) {
        var bld = this._religionManager.getBuild(name, opt[name].variant);
        checkedList.push({ name: bld.label, trigger: opt[name].triggerForReset, val: bld.val });
        if (opt[name].triggerForReset > 0) {
          if (opt[name].triggerForReset > bld.val) return;
        } else {
          checkList.push(name);
        }
      }
    opt = this._host.options.auto.unicorn.items;
    for (var name in opt)
      if (opt[name].checkForReset && opt[name].variant == "z") {
        var bld = this._religionManager.getBuild(name, "z");
        checkedList.push({ name: bld.label, trigger: opt[name].triggerForReset, val: bld.val });
        if (opt[name].triggerForReset > 0) {
          if (opt[name].triggerForReset > bld.val) return;
        } else {
          checkList.push(name);
        }
      }
    if (
      check(this._religionManager.manager.tab.zgUpgradeButtons) ||
      check(this._religionManager.manager.tab.rUpgradeButtons) ||
      check(this._religionManager.manager.tab.children[0].children[0].children) ||
      checkList.length
    )
      return;

    // check time
    opt = this._host.options.auto.time.items;
    for (var name in opt)
      if (opt[name].checkForReset) {
        var bld = this._timeManager.getBuild(name, opt[name].variant);
        checkedList.push({ name: bld.label, trigger: opt[name].triggerForReset, val: bld.val });
        if (opt[name].triggerForReset > 0) {
          if (opt[name].triggerForReset > bld.val) return;
        } else {
          checkList.push(name);
        }
      }

    if (
      check(this._timeManager.manager.tab.children[2].children[0].children) ||
      check(this._timeManager.manager.tab.children[3].children[0].children) ||
      checkList.length
    )
      return;

    // check resources
    opt = this._host.options.auto.resources;
    for (const name in opt)
      if (opt[name].checkForReset) {
        const res = this._host.gamePage.resPool.get(name);
        checkedList.push({ name: res.title, trigger: opt[name].stockForReset, val: res.value });
        if (opt[name].stockForReset > res.value) return;
      }

    // stop!
    this.stop(false);

    const sleep = function (time = 1500) {
      return new Promise(resolve => {
        if (
          !(
            options.auto.engine.enabled &&
            options.auto.timeCtrl.enabled &&
            options.auto.timeCtrl.items.reset.enabled
          )
        )
          throw "canceled by player";
        setTimeout(resolve, time);
      });
    };

    try {
      for (var i in checkedList) {
        await sleep(500);
        const checked = checkedList[i];
        this._host.imessage("reset.check", [
          checked.name,
          this._host.gamePage.getDisplayValueExt(checked.trigger),
          this._host.gamePage.getDisplayValueExt(checked.val),
        ]);
      }

      await sleep(0)
        .then(() => {
          this._host.imessage("reset.checked");
          return sleep();
        })
        .then(() => {
          this._host.iactivity("reset.tip");
          return sleep();
        })
        .then(() => {
          this._host.imessage("reset.countdown.10");
          return sleep(2000);
        })
        .then(() => {
          this._host.imessage("reset.countdown.9");
          return sleep();
        })
        .then(() => {
          this._host.imessage("reset.countdown.8");
          return sleep();
        })
        .then(() => {
          this._host.imessage("reset.countdown.7");
          return sleep();
        })
        .then(() => {
          this._host.imessage("reset.countdown.6");
          return sleep();
        })
        .then(() => {
          this._host.imessage("reset.countdown.5");
          return sleep();
        })
        .then(() => {
          this._host.imessage("reset.countdown.4");
          return sleep();
        })
        .then(() => {
          this._host.imessage("reset.countdown.3");
          return sleep();
        })
        .then(() => {
          this._host.imessage("reset.countdown.2");
          return sleep();
        })
        .then(() => {
          this._host.imessage("reset.countdown.1");
          return sleep();
        })
        .then(() => {
          this._host.imessage("reset.countdown.0");
          return sleep();
        })
        .then(() => {
          this._host.iactivity("reset.last.message");
          return sleep();
        });
    } catch (error) {
      this._host.imessage("reset.cancel.message");
      this._host.iactivity("reset.cancel.activity");
      return;
    }

    if (typeof kittenStorage.reset === "undefined") kittenStorage.reset = {};

    kittenStorage.reset.karmaLastTime = this._host.gamePage.resPool.get("karma").value;
    kittenStorage.reset.paragonLastTime = this._host.gamePage.resPool.get("paragon").value;
    kittenStorage.reset.times += 1;
    kittenStorage.reset.reset = true;
    saveToKittenStorage();

    //=============================================================
    for (const i = 0; i < this._host.gamePage.challenges.challenges.length; i++) {
      this._host.gamePage.challenges.challenges[i].pending = false;
    }
    this._host.gamePage.resetAutomatic();
    //=============================================================
  }

  timeCtrl(): void {
    const optionVals = this._host.options.auto.timeCtrl.items;

    // Tempus Fugit
    if (optionVals.accelerateTime.enabled && !this._host.gamePage.time.isAccelerated) {
      const tf = this._host.gamePage.resPool.get("temporalFlux");
      if (tf.value >= tf.maxValue * optionVals.accelerateTime.subTrigger) {
        this._host.gamePage.time.isAccelerated = true;
        this._host.iactivity("act.accelerate", [], "ks-accelerate");
        this._host.storeForSummary("accelerate", 1);
      }
    }

    // Combust time crystal
    TimeSkip: if (
      optionVals.timeSkip.enabled &&
      this._host.gamePage.workshop.get("chronoforge").researched
    ) {
      if (this._host.gamePage.calendar.day < 0) break TimeSkip;

      const timeCrystal = this._host.gamePage.resPool.get("timeCrystal");
      if (timeCrystal.value < optionVals.timeSkip.subTrigger) break TimeSkip;

      const season = this._host.gamePage.calendar.season;
      if (!optionVals.timeSkip[this._host.gamePage.calendar.seasons[season].name]) break TimeSkip;

      const currentCycle = this._host.gamePage.calendar.cycle;
      if (!optionVals.timeSkip[currentCycle]) break TimeSkip;

      const heatMax = this._host.gamePage.getEffect("heatMax");
      const heatNow = this._host.gamePage.time.heat;
      if (heatNow >= heatMax) break TimeSkip;

      const yearsPerCycle = this._host.gamePage.calendar.yearsPerCycle;
      const remainingYearsCurrentCycle = yearsPerCycle - this._host.gamePage.calendar.cycleYear;
      const cyclesPerEra = this._host.gamePage.calendar.cyclesPerEra;
      const factor = this._host.gamePage.challenges.getChallenge("1000Years").researched ? 5 : 10;
      let canSkip = Math.min(Math.floor((heatMax - heatNow) / factor), optionVals.timeSkip.maximum);
      let willSkip = 0;
      if (canSkip < remainingYearsCurrentCycle) {
        willSkip = canSkip;
      } else {
        willSkip += remainingYearsCurrentCycle;
        canSkip -= remainingYearsCurrentCycle;
        let skipCycles = 1;
        while (
          canSkip > yearsPerCycle &&
          optionVals.timeSkip[(currentCycle + skipCycles) % cyclesPerEra]
        ) {
          willSkip += yearsPerCycle;
          canSkip -= yearsPerCycle;
          skipCycles += 1;
        }
        if (optionVals.timeSkip[(currentCycle + skipCycles) % cyclesPerEra] && canSkip > 0)
          willSkip += canSkip;
      }
      if (willSkip > 0) {
        const shatter = this._host.gamePage.timeTab.cfPanel.children[0].children[0]; // check?
        this._host.iactivity("act.time.skip", [willSkip], "ks-timeSkip");
        shatter.controller.doShatterAmt(shatter.model, willSkip);
        this._host.storeForSummary("time.skip", willSkip);
      }
    }
  }

  promote(): void {
    if (
      this._host.gamePage.science.get("civil").researched &&
      this._host.gamePage.village.leader != null
    ) {
      const leader = this._host.gamePage.village.leader;
      const rank = leader.rank;
      const gold = this._craftManager.getResource("gold");
      const goldStock = this._craftManager.getStock("gold");

      // this._host.gamePage.village.sim.goldToPromote will check gold
      // this._host.gamePage.village.sim.promote check both gold and exp
      if (
        this._host.gamePage.village.sim.goldToPromote(rank, rank + 1, gold - goldStock)[0] &&
        this._host.gamePage.village.sim.promote(leader, rank + 1) == 1
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

  distribute(): void {
    const freeKittens = this._host.gamePage.village.getFreeKittens();
    if (!freeKittens) return;

    let jobName = "";
    let minRatio = Infinity;
    let currentRatio = 0;
    for (const i in this._host.gamePage.village.jobs) {
      const name = this._host.gamePage.village.jobs[i].name;
      const unlocked = this._host.gamePage.village.jobs[i].unlocked;
      const enabled = this._host.options.auto.distribute.items[name].enabled;
      const maxGame = this._host.gamePage.village.getJobLimit(name);
      const maxKS = this._host.options.auto.distribute.items[name].max;
      const val = this._host.gamePage.village.jobs[i].value;
      const limited = this._host.options.auto.distribute.items[name].limited;
      if (unlocked && enabled && val < maxGame && (!limited || val < maxKS)) {
        currentRatio = val / maxKS;
        if (currentRatio < minRatio) {
          minRatio = currentRatio;
          jobName = name;
        }
      }
    }
    if (jobName) {
      this._host.gamePage.village.assignJob(this._host.gamePage.village.getJob(jobName), 1);
      this._villageManager.render();
      this._host.iactivity(
        "act.distribute",
        [this._host.i18n("$village.job." + jobName)],
        "ks-distribute"
      );
      this._host.storeForSummary("distribute", 1);
    }
  }

  autofeed(): void {
    const levi = this._host.gamePage.diplomacy.get("leviathans");
    const nCorn = this._host.gamePage.resPool.get("necrocorn");
    if (!(levi.unlocked && nCorn.value > 0)) {
      return;
    }
    if (nCorn.value >= 1) {
      if (levi.energy < this._host.gamePage.diplomacy.getMarkerCap()) {
        this._host.gamePage.diplomacy.feedElders();
        this._host.iactivity("act.feed");
        this._host.storeForSummary("feed", 1);
      }
    } else {
      if (0.25 * (1 + this._host.gamePage.getEffect("corruptionBoostRatio")) < 1) {
        this._host.storeForSummary("feed", nCorn.value);
        this._host.gamePage.diplomacy.feedElders();
        this._host.iactivity("dispose.necrocorn");
      }
    }
  }

  crypto(): void {
    const coinPrice = this._host.gamePage.calendar.cryptoPrice;
    const previousRelic = this._host.gamePage.resPool.get("relic").value;
    const previousCoin = this._host.gamePage.resPool.get("blackcoin").value;
    let exchangedCoin = 0.0;
    let exchangedRelic = 0.0;
    let waitForBestPrice = false;

    // Waits for coin price to drop below a certain treshold before starting the exchange process
    if (waitForBestPrice == true && coinPrice < 860.0) {
      waitForBestPrice = false;
    }

    // Exchanges up to a certain threshold, in order to keep a good exchange rate, then waits for a higher treshold before exchanging for relics.
    if (
      waitForBestPrice == false &&
      coinPrice < 950.0 &&
      previousRelic > this._host.options.auto.options.items.crypto.subTrigger
    ) {
      let currentCoin;

      // function name changed in v1.4.8.0
      if (typeof this._host.gamePage.diplomacy.buyEcoin === "function") {
        this._host.gamePage.diplomacy.buyEcoin();
      } else {
        this._host.gamePage.diplomacy.buyBcoin();
      }

      currentCoin = this._host.gamePage.resPool.get("blackcoin").value;
      exchangedCoin = Math.round(currentCoin - previousCoin);
      this._host.iactivity("blackcoin.buy", [exchangedCoin]);
    } else if (coinPrice > 1050.0 && this._host.gamePage.resPool.get("blackcoin").value > 0) {
      let currentRelic;

      waitForBestPrice = true;

      // function name changed in v1.4.8.0
      if (typeof this._host.gamePage.diplomacy.sellEcoin === "function") {
        this._host.gamePage.diplomacy.sellEcoin();
      } else {
        this._host.gamePage.diplomacy.sellBcoin();
      }

      currentRelic = this._host.gamePage.resPool.get("relic").value;
      exchangedRelic = Math.round(currentRelic - previousRelic);

      this._host.iactivity("blackcoin.sell", [exchangedRelic]);
    }
  }

  explore(): void {
    const manager = this._explorationManager;
    const expeditionNode = this._host.gamePage.village.map.expeditionNode;

    if (expeditionNode == null) {
      manager.getCheapestNode();

      manager.explore(manager.cheapestNodeX, manager.cheapestNodeY);

      this._host.iactivity("act.explore", [manager.cheapestNodeX, manager.cheapestNodeY]);
    }
  }

  worship(): void {
    let builds = this._host.options.auto.faith.items;
    const manager = this._religionManager;
    const buildManager = this._buildManager;
    const craftManager = this._craftManager;
    const option = this._host.options.auto.faith.addition;

    if (option.bestUnicornBuilding.enabled) {
      const bestUnicornBuilding = this.getBestUnicornBuilding();
      if (bestUnicornBuilding) {
        if (bestUnicornBuilding == "unicornPasture")
          buildManager.build(bestUnicornBuilding, undefined, 1);
        else {
          const btn = manager.getBuildButton(bestUnicornBuilding, "z");
          for (const i in btn.model.prices)
            if (btn.model.prices[i].name == "tears") var tearNeed = btn.model.prices[i].val;
          const tearHave = craftManager.getValue("tears") - craftManager.getStock("tears");
          if (tearNeed > tearHave) {
            // if no ziggurat, getBestUnicornBuilding will return unicornPasture
            const maxSacrifice = Math.floor(
              (craftManager.getValue("unicorns") - craftManager.getStock("unicorns")) / 2500
            );
            const needSacrifice = Math.ceil(
              (tearNeed - tearHave) / this._host.gamePage.bld.getBuildingExt("ziggurat").meta.on
            );
            if (needSacrifice < maxSacrifice)
              this._host.gamePage.religionTab.sacrificeBtn.controller._transform(
                this._host.gamePage.religionTab.sacrificeBtn.model,
                needSacrifice
              );
            // iactivity?
          }
          religionManager.build(bestUnicornBuilding, "z", 1);
        }
      }
    } else {
      builds = Object.assign(
        {},
        builds,
        Object.fromEntries(
          Object.entries(this._host.options.auto.unicorn.items).filter(
            ([k, v]) => v.variant != "zp"
          )
        )
      );
      if (this._host.options.auto.unicorn.items.unicornPasture.enabled)
        this.build({ unicornPasture: { require: false, enabled: true } });
    }
    // religion build
    this._worship(builds);

    const faith = craftManager.getResource("faith");
    const rate = faith.value / faith.maxValue;
    // enough faith, and then TAP
    if (0.98 <= rate) {
      let worship = this._host.gamePage.religion.faith;
      let epiphany = this._host.gamePage.religion.faithRatio;
      const transcendenceReached = this._host.gamePage.religion.getRU("transcendence").on;
      let tt = transcendenceReached ? this._host.gamePage.religion.transcendenceTier : 0;

      // Transcend
      if (option.transcend.enabled && transcendenceReached) {
        const adoreIncreaceRatio = Math.pow((tt + 2) / (tt + 1), 2);
        const needNextLevel =
          this._host.gamePage.religion._getTranscendTotalPrice(tt + 1) -
          this._host.gamePage.religion._getTranscendTotalPrice(tt);

        const x = needNextLevel;
        const k = adoreIncreaceRatio;
        const epiphanyRecommend =
          ((1 - k + Math.sqrt(80 * (k * k - 1) * x + (k - 1) * (k - 1))) * k) /
            (40 * (k + 1) * (k + 1) * (k - 1)) +
          x +
          x / (k * k - 1);

        if (epiphany >= epiphanyRecommend) {
          // code copy from kittens game's religion.js: this._host.gamePage.religion.transcend()
          // this._host.gamePage.religion.transcend() need confirm by player
          // game version: 1.4.8.1
          // ========================================================================================================
          // DO TRANSCEND START
          // ========================================================================================================
          this._host.gamePage.religion.faithRatio -= needNextLevel;
          this._host.gamePage.religion.tcratio += needNextLevel;
          this._host.gamePage.religion.transcendenceTier += 1;
          const atheism = this._host.gamePage.challenges.getChallenge("atheism");
          atheism.calculateEffects(atheism, this._host.gamePage);
          const blackObelisk = this._host.gamePage.religion.getTU("blackObelisk");
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
          tt = this._host.gamePage.religion.transcendenceTier;
          this._host.iactivity(
            "act.transcend",
            [this._host.gamePage.getDisplayValueExt(needNextLevel), tt],
            "ks-transcend"
          );
          this._host.storeForSummary("transcend", 1);
        }
      }

      // Adore
      if (option.adore.enabled && this._host.gamePage.religion.getRU("apocripha").on) {
        // game version: 1.4.8.1
        const maxSolarRevolution = 10 + this._host.gamePage.getEffect("solarRevolutionLimit");
        const triggerSolarRevolution = maxSolarRevolution * option.adore.subTrigger;
        const epiphanyInc = (worship / 1000000) * tt * tt * 1.01;
        const epiphanyAfterAdore = epiphany + epiphanyInc;
        const worshipAfterAdore =
          0.01 +
          faith.value * (1 + this._host.gamePage.getUnlimitedDR(epiphanyAfterAdore, 0.1) * 0.1);
        const solarRevolutionAdterAdore = this._host.gamePage.getLimitedDR(
          this._host.gamePage.getUnlimitedDR(worshipAfterAdore, 1000) / 100,
          maxSolarRevolution
        );
        if (solarRevolutionAdterAdore >= triggerSolarRevolution) {
          this._host.gamePage.religion._resetFaithInternal(1.01);

          this._host.iactivity(
            "act.adore",
            [
              this._host.gamePage.getDisplayValueExt(worship),
              this._host.gamePage.getDisplayValueExt(epiphanyInc),
            ],
            "ks-adore"
          );
          this._host.storeForSummary("adore", epiphanyInc);
          epiphany = this._host.gamePage.religion.faithRatio;
          worship = this._host.gamePage.religion.faith;
        }
      }
    }
    // Praise
    if (option.autoPraise.enabled && rate >= option.autoPraise.subTrigger) {
      let apocryphaBonus;
      if (!this._host.gamePage.religion.getFaithBonus) {
        apocryphaBonus = this._host.gamePage.religion.getApocryphaBonus();
      } else {
        apocryphaBonus = this._host.gamePage.religion.getFaithBonus();
      }
      const worshipInc = faith.value * (1 + apocryphaBonus);
      this._host.storeForSummary("praise", worshipInc);
      this._host.iactivity(
        "act.praise",
        [
          this._host.gamePage.getDisplayValueExt(faith.value),
          this._host.gamePage.getDisplayValueExt(worshipInc),
        ],
        "ks-praise"
      );
      this._host.gamePage.religion.praise();
    }
  }

  private _worship(
    builds: Partial<Record<FaithItem, UnicornFaithItemOptions>> = this._host.options.auto.faith
      .items
  ): void {
    const buildManager = this._religionManager;
    const craftManager = this._craftManager;
    const bulkManager = this._bulkManager;
    const trigger = this._host.options.auto.faith.trigger;

    // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
    buildManager.manager.render();

    const metaData = {};
    for (const [name, build] of objectEntries<FaithItem, UnicornFaithItemOptions>(builds)) {
      metaData[name] = buildManager.getBuild(name, build.variant);
      if (!buildManager.getBuildButton(name, build.variant)) {
        metaData[name].rHidden = true;
      } else {
        const model = buildManager.getBuildButton(name, build.variant).model;
        const panel =
          build.variant === "c"
            ? this._host.gamePage.science.get("cryptotheology").researched
            : true;
        metaData[name].rHidden = !(model.visible && model.enabled && panel);
      }
    }

    const buildList = bulkManager.bulk(builds, metaData, trigger);

    let refreshRequired = false;
    for (const entry in buildList) {
      if (buildList[entry].count > 0) {
        buildManager.build(buildList[entry].id, buildList[entry].variant, buildList[entry].count);
        refreshRequired = true;
      }
    }

    if (refreshRequired) {
      this._host.gamePage.ui.render();
    }
  }

  chrono(): void {
    if (!this._host.gamePage.timeTab.visible) {
      return;
    }
    const builds = this._host.options.auto.time.items;
    const buildManager = this._timeManager;
    const craftManager = this._craftManager;
    const bulkManager = this._bulkManager;
    const trigger = this._host.options.auto.time.trigger;

    // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
    buildManager.manager.render();

    const metaData = {};
    for (const name in builds) {
      const build = builds[name];
      metaData[name] = buildManager.getBuild(name, build.variant);
      const model = buildManager.getBuildButton(name, build.variant).model;
      const panel =
        build.variant === "chrono"
          ? buildManager.manager.tab.cfPanel
          : buildManager.manager.tab.vsPanel;
      metaData[name].tHidden = !model.visible || !model.enabled || !panel.visible;
    }

    const buildList = bulkManager.bulk(builds, metaData, trigger);

    let refreshRequired = false;
    for (const entry in buildList) {
      if (buildList[entry].count > 0) {
        buildManager.build(buildList[entry].id, buildList[entry].variant, buildList[entry].count);
        refreshRequired = true;
      }
    }

    if (refreshRequired) {
      this._host.gamePage.ui.render();
    }
  }

  upgrade(): void {
    const upgrades = this._host.options.auto.upgrade.items;
    const upgradeManager = this._upgradeManager;
    const craftManager = this._craftManager;
    const bulkManager = this._bulkManager;
    const buildManager = this._buildManager;

    upgradeManager.workManager.render();
    upgradeManager.sciManager.render();
    upgradeManager.spaManager.render();

    if (upgrades.upgrades.enabled && gamePage.tabs[3].visible) {
      const work = this._host.gamePage.workshop.upgrades;
      workLoop: for (var upg in work) {
        if (work[upg].researched || !work[upg].unlocked) {
          continue;
        }

        let prices = dojo.clone(work[upg].prices); // this._host.gamePage.village.getEffectLeader will override its argument
        prices = this._host.gamePage.village.getEffectLeader("scientist", prices);
        for (const resource in prices) {
          if (craftManager.getValueAvailable(prices[resource].name, true) < prices[resource].val) {
            continue workLoop;
          }
        }
        upgradeManager.build(work[upg], "workshop");
      }
    }

    if (upgrades.techs.enabled && this._host.gamePage.tabs[2].visible) {
      const tech = this._host.gamePage.science.techs;
      techLoop: for (var upg in tech) {
        if (tech[upg].researched || !tech[upg].unlocked) {
          continue;
        }

        let prices = dojo.clone(tech[upg].prices);
        prices = this._host.gamePage.village.getEffectLeader("scientist", prices);
        for (var resource in prices) {
          if (craftManager.getValueAvailable(prices[resource].name, true) < prices[resource].val) {
            continue techLoop;
          }
        }
        upgradeManager.build(tech[upg], "science");
      }
    }

    if (upgrades.missions.enabled && this._host.gamePage.tabs[6].visible) {
      const missions = this._host.gamePage.space.meta[0].meta;
      missionLoop: for (let i = 0; i < missions.length; i++) {
        if (!(missions[i].unlocked && missions[i].val < 1)) {
          continue;
        }

        const model = this._spaceManager.manager.tab.GCPanel.children[i];
        const prices = model.model.prices;
        for (const resource in prices) {
          if (craftManager.getValueAvailable(prices[resource].name, true) < prices[resource].val) {
            continue missionLoop;
          }
        }
        model.domNode.click();
        if (i === 7 || i === 12) {
          this._host.iactivity("upgrade.space.mission", [missions[i].label], "ks-upgrade");
        } else {
          this._host.iactivity("upgrade.space", [missions[i].label], "ks-upgrade");
        }
      }
    }

    if (upgrades.races.enabled && this._host.gamePage.tabs[4].visible) {
      const maxRaces = this._host.gamePage.diplomacy.get("leviathans").unlocked ? 8 : 7;
      if (this._host.gamePage.diplomacyTab.racePanels.length < maxRaces) {
        let manpower = craftManager.getValueAvailable("manpower", true);
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
        if (
          !this._host.gamePage.diplomacy.get("spiders").unlocked &&
          this._host.gamePage.resPool.get("ship").value >= 100 &&
          this._host.gamePage.resPool.get("science").maxValue > 125000
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
        if (
          !this._host.gamePage.diplomacy.get("dragons").unlocked &&
          this._host.gamePage.science.get("nuclearFission").researched
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
      }
    }

    if (upgrades.buildings.enabled) {
      const pastures =
        this._host.gamePage.bld.getBuildingExt("pasture").meta.stage === 0
          ? this._host.gamePage.bld.getBuildingExt("pasture").meta.val
          : 0;
      const aqueducts =
        this._host.gamePage.bld.getBuildingExt("aqueduct").meta.stage === 0
          ? this._host.gamePage.bld.getBuildingExt("aqueduct").meta.val
          : 0;

      const pastureMeta = this._host.gamePage.bld.getBuildingExt("pasture").meta;
      if (pastureMeta.stage === 0) {
        if (pastureMeta.stages[1].stageUnlocked) {
          if (craftManager.getPotentialCatnip(true, 0, aqueducts) > 0) {
            const prices = pastureMeta.stages[1].prices;
            const priceRatio = bulkManager.getPriceRatio(pastureMeta, true);
            if (bulkManager.singleBuildPossible(pastureMeta, prices, 1)) {
              const button = buildManager.getBuildButton("pasture", 0);
              button.controller.sellInternal(button.model, 0);
              pastureMeta.on = 0;
              pastureMeta.val = 0;
              pastureMeta.stage = 1;
              this._host.iactivity("upgrade.building.pasture", [], "ks-upgrade");
              this._host.gamePage.ui.render();
              buildManager.build("pasture", 1, 1);
              this._host.gamePage.ui.render();
              return;
            }
          }
        }
      }

      const aqueductMeta = this._host.gamePage.bld.getBuildingExt("aqueduct").meta;
      if (aqueductMeta.stage === 0) {
        if (aqueductMeta.stages[1].stageUnlocked) {
          if (craftManager.getPotentialCatnip(true, pastures, 0) > 0) {
            const prices = aqueductMeta.stages[1].prices;
            const priceRatio = bulkManager.getPriceRatio(aqueductMeta, true);
            if (bulkManager.singleBuildPossible(aqueductMeta, prices, 1)) {
              const button = buildManager.getBuildButton("aqueduct", 0);
              button.controller.sellInternal(button.model, 0);
              aqueductMeta.on = 0;
              aqueductMeta.val = 0;
              aqueductMeta.stage = 1;
              aqueductMeta.calculateEffects(aqueductMeta, this._host.gamePage);
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
        if (libraryMeta.stages[1].stageUnlocked) {
          let enCon = this._host.gamePage.workshop.get("cryocomputing").researched ? 1 : 2;
          if (this._host.gamePage.challenges.currentChallenge == "energy") {
            enCon *= 2;
          }
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
          if (
            this._host.gamePage.resPool.energyProd >=
            this._host.gamePage.resPool.energyCons + (enCon * libraryMeta.val) / libToDat
          ) {
            const prices = libraryMeta.stages[1].prices;
            const priceRatio = bulkManager.getPriceRatio(libraryMeta, true);
            if (bulkManager.singleBuildPossible(libraryMeta, prices, 1)) {
              const button = buildManager.getBuildButton("library", 0);
              button.controller.sellInternal(button.model, 0);
              libraryMeta.on = 0;
              libraryMeta.val = 0;
              libraryMeta.stage = 1;
              libraryMeta.calculateEffects(libraryMeta, game);
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
      if (amphitheatreMeta.stage === 0) {
        if (amphitheatreMeta.stages[1].stageUnlocked) {
          const prices = amphitheatreMeta.stages[1].prices;
          const priceRatio = bulkManager.getPriceRatio(amphitheatreMeta, true);
          if (bulkManager.singleBuildPossible(amphitheatreMeta, prices, 1)) {
            const button = buildManager.getBuildButton("amphitheatre", 0);
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

  build(
    builds: Record<BuildItem, BuildItemOptions> = this._host.options.auto.build.items
  ): void {
    const buildManager = this._buildManager;
    const craftManager = this._craftManager;
    const bulkManager = this._bulkManager;
    const trigger = this._host.options.auto.build.trigger;

    // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
    buildManager.manager.render();

    const metaData = {};
    for (const [name, build] of Object.entries(builds)) {
      metaData[name] = buildManager.getBuild(build.name || (name as Building)).meta;
    }

    const buildList = bulkManager.bulk(builds, metaData, trigger, "bonfire");

    let refreshRequired = false;
    for (const entry in buildList) {
      if (buildList[entry].count > 0) {
        buildManager.build(
          buildList[entry].name || buildList[entry].id,
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

  space(): void {
    const builds = this._host.options.auto.space.items;
    const buildManager = this._spaceManager;
    const craftManager = this._craftManager;
    const bulkManager = this._bulkManager;
    const trigger = this._host.options.auto.space.trigger;

    // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
    buildManager.manager.render();

    const metaData = {};
    for (const name in builds) {
      const build = builds[name];
      metaData[name] = buildManager.getBuild(name);
    }

    const buildList = bulkManager.bulk(builds, metaData, trigger, "space");

    let refreshRequired = false;
    for (const entry in buildList) {
      if (buildList[entry].count > 0) {
        buildManager.build(buildList[entry].id, buildList[entry].count);
        refreshRequired = true;
      }
    }
    if (refreshRequired) {
      this._host.gamePage.ui.render();
    }
  }

  craft(): void {
    const crafts = this._host.options.auto.craft.items;
    const manager = this._craftManager;
    const trigger = this._host.options.auto.craft.trigger;

    for (const name in crafts) {
      const craft = crafts[name];
      const current = !craft.max ? false : manager.getResource(name);
      const require = !craft.require ? false : manager.getResource(craft.require);
      const season = this._host.gamePage.calendar.season;
      let amount = 0;
      // Ensure that we have reached our cap
      if (current && current.value > craft.max) continue;
      if (!manager.singleCraftPossible(name)) {
        continue;
      }
      // Craft the resource if we meet the trigger requirement
      if (!require || trigger <= require.value / require.maxValue) {
        amount = manager.getLowestCraftAmount(name, craft.limited, craft.limRat, true);
      } else if (craft.limited) {
        amount = manager.getLowestCraftAmount(name, craft.limited, craft.limRat, false);
      }
      if (amount > 0) {
        manager.craft(name, amount);
      }
    }
  }

  holdFestival(): void {
    if (
      !(
        this._host.gamePage.science.get("drama").researched &&
        this._host.gamePage.calendar.festivalDays < 400
      )
    ) {
      return;
    }
    if (
      !this._host.gamePage.prestige.getPerk("carnivals").researched &&
      this._host.gamePage.calendar.festivalDays > 0
    ) {
      return;
    }

    const craftManager = this._craftManager;
    if (
      craftManager.getValueAvailable("manpower", true) < 1500 ||
      craftManager.getValueAvailable("culture", true) < 5000 ||
      craftManager.getValueAvailable("parchment", true) < 2500
    ) {
      return;
    }

    const catpowProf =
      4000 * craftManager.getTickVal(craftManager.getResource("manpower"), true) > 1500;
    const cultureProf =
      4000 * craftManager.getTickVal(craftManager.getResource("culture"), true) > 5000;
    const parchProf =
      4000 * craftManager.getTickVal(craftManager.getResource("parchment"), true) > 2500;

    if (!(catpowProf && cultureProf && parchProf)) {
      return;
    }

    // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
    this._villageManager.render();

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

  observeStars(): void {
    if (this._host.gamePage.calendar.observeBtn != null) {
      this._host.gamePage.calendar.observeHandler();
      this._host.iactivity("act.observe", [], "ks-star");
      this._host.storeForSummary("stars", 1);
    }
  }

  hunt(): void {
    const manpower = this._craftManager.getResource("manpower");

    if (
      this._host.options.auto.options.items.hunt.subTrigger <= manpower.value / manpower.maxValue &&
      manpower.value >= 100
    ) {
      // No way to send only some hunters. Thus, we hunt with everything
      let huntCount = Math.floor(manpower.value / 100);
      this._host.storeForSummary("hunt", huntCount);
      this._host.iactivity("act.hunt", [huntCount], "ks-hunt");

       huntCount = Math.floor(manpower.value / 100);
      const aveOutput = this._craftManager.getAverageHunt();
      const trueOutput = {};

      for (const out in aveOutput) {
        const res = this._craftManager.getResource(out);
        trueOutput[out] =
          res.maxValue > 0
            ? Math.min(aveOutput[out] * huntCount, Math.max(res.maxValue - res.value, 0))
            : aveOutput[out] * huntCount;
      }

      this._cacheManager.pushToCache({
        materials: trueOutput,
        timeStamp: this._host.gamePage.timer.ticksTotal,
      });

      this._host.gamePage.village.huntAll();
    }
  }

  trade(): void {
    const craftManager = this._craftManager;
    const tradeManager = this._tradeManager;
    const cacheManager = this._cacheManager;
    const gold = craftManager.getResource("gold");
    const trades = [];
    const requireTrigger = this._host.options.auto.trade.trigger;

    tradeManager.manager.render();

    if (!tradeManager.singleTradePossible(undefined)) {
      return;
    }

    const season = this._host.gamePage.calendar.getCurSeason().name;

    // Determine how many races we will trade this cycle
    for (var name in this._host.options.auto.trade.items) {
      var trade = this._host.options.auto.trade.items[name];

      // Check if the race is in season, enabled, unlocked, and can actually afford it
      if (!trade.enabled) continue;
      if (!trade[season]) continue;
      var race = tradeManager.getRace(name);
      if (!race.unlocked) {
        continue;
      }
      const button = tradeManager.getTradeButton(race.name);
      if (!button.model.enabled) {
        continue;
      }
      if (!tradeManager.singleTradePossible(name)) {
        continue;
      }

      var require = !trade.require ? false : craftManager.getResource(trade.require);

      // If we have enough to trigger the check, then attempt to trade
      const prof = tradeManager.getProfitability(name);
      if (trade.limited && prof) {
        trades.push(name);
      } else if (
        (!require || requireTrigger <= require.value / require.maxValue) &&
        requireTrigger <= gold.value / gold.maxValue
      ) {
        trades.push(name);
      }
    }

    if (trades.length === 0) {
      return;
    }

    // Figure out how much we can currently trade
    let maxTrades = tradeManager.getLowestTradeAmount(undefined, true, false);

    // Distribute max trades without starving any race

    if (maxTrades < 1) {
      return;
    }

    const maxByRace = [];
    for (var i = 0; i < trades.length; i++) {
      var name = trades[i];
      var trade = this._host.options.auto.trade.items[name];
      var require = !trade.require ? false : craftManager.getResource(trade.require);
      const trigConditions =
        (!require || requireTrigger <= require.value / require.maxValue) &&
        requireTrigger <= gold.value / gold.maxValue;
      const tradePos = tradeManager.getLowestTradeAmount(name, trade.limited, trigConditions);
      if (tradePos < 1) {
        trades.splice(i, 1);
        i--;
        continue;
      }
      maxByRace[i] = tradePos;
    }

    if (trades.length === 0) {
      return;
    }

    const tradesDone = {};
    while (trades.length > 0 && maxTrades >= 1) {
      if (maxTrades < trades.length) {
        const j = Math.floor(Math.random() * trades.length);
        if (!tradesDone[trades[j]]) {
          tradesDone[trades[j]] = 0;
        }
        tradesDone[trades[j]] += 1;
        maxTrades -= 1;
        trades.splice(j, 1);
        maxByRace.splice(j, 1);
        continue;
      }
      let minTrades = Math.floor(maxTrades / trades.length);
      let minTradePos = 0;
      for (var i = 0; i < trades.length; i++) {
        if (maxByRace[i] < minTrades) {
          minTrades = maxByRace[i];
          minTradePos = i;
        }
      }
      if (!tradesDone[trades[minTradePos]]) {
        tradesDone[trades[minTradePos]] = 0;
      }
      tradesDone[trades[minTradePos]] += minTrades;
      maxTrades -= minTrades;
      trades.splice(minTradePos, 1);
      maxByRace.splice(minTradePos, 1);
    }
    if (tradesDone.length === 0) {
      return;
    }

    const tradeNet = {};
    for (var name in tradesDone) {
      var race = tradeManager.getRace(name);

      const materials = tradeManager.getMaterials(name);
      for (const mat in materials) {
        if (!tradeNet[mat]) {
          tradeNet[mat] = 0;
        }
        tradeNet[mat] -= materials[mat] * tradesDone[name];
      }

      const meanOutput = tradeManager.getAverageTrade(race);
      for (const out in meanOutput) {
        const res = craftManager.getResource(out);
        if (!tradeNet[out]) {
          tradeNet[out] = 0;
        }
        tradeNet[out] +=
          res.maxValue > 0
            ? Math.min(meanOutput[out] * tradesDone[name], Math.max(res.maxValue - res.value, 0))
            : meanOutput[out] * tradesDone[name];
      }
    }

    cacheManager.pushToCache({
      materials: tradeNet,
      timeStamp: this._host.gamePage.timer.ticksTotal,
    });

    for (var name in tradesDone) {
      if (tradesDone[name] > 0) {
        tradeManager.trade(name, tradesDone[name]);
      }
    }
  }

  miscOptions(): void {
    const craftManager = this._craftManager;
    const buildManager = this._buildManager;
    const optionVals = this._host.options.auto.options.items;

    AutoEmbassy: if (
      optionVals.buildEmbassies.enabled &&
      !!this._host.gamePage.diplomacy.races[0].embassyPrices
    ) {
      const culture = craftManager.getResource("culture");
      if (optionVals.buildEmbassies.subTrigger <= culture.value / culture.maxValue) {
        const racePanels = this._host.gamePage.diplomacyTab.racePanels;
        var cultureVal = craftManager.getValueAvailable("culture", true);

        const embassyBulk = {};
        const bulkTracker = [];

        for (var i = 0; i < racePanels.length; i++) {
          if (!racePanels[i].embassyButton) {
            continue;
          }
          var name = racePanels[i].race.name;
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
          for (var i = 0; i < bulkTracker.length; i++) {
            var name = bulkTracker[i];
            var emBulk = embassyBulk[name];
            const nextPrice = emBulk.basePrice * Math.pow(1.15, emBulk.currentEm + emBulk.val);
            if (nextPrice <= cultureVal) {
              cultureVal -= nextPrice;
              emBulk.priceSum += nextPrice;
              emBulk.val += 1;
              refreshRequired = true;
            } else {
              bulkTracker.splice(i, 1);
              i--;
            }
          }
        }

        for (var name in embassyBulk) {
          var emBulk = embassyBulk[name];
          if (emBulk.val === 0) {
            continue;
          }
          var cultureVal = craftManager.getValueAvailable("culture", true);
          if (emBulk.priceSum > cultureVal) {
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

    // fix Cryochamber
    if (optionVals.fixCry.enabled && this._host.gamePage.time.getVSU("usedCryochambers").val > 0) {
      let fixed = 0;
      const btn = this._timeManager.manager.tab.vsPanel.children[0].children[0]; //check?
      // doFixCryochamber will check resources
      while (btn.controller.doFixCryochamber(btn.model)) fixed += 1;
      if (fixed > 0) {
        this._host.iactivity("act.fix.cry", [fixed], "ks-fixCry");
        this._host.storeForSummary("fix.cry", fixed);
      }
    }

    // auto turn on steamworks
    if (optionVals._steamworks.enabled) {
      const st = this._host.gamePage.bld.get("steamworks");
      if (st.val && st.on == 0) {
        const button = buildManager.getBuildButton("steamworks");
        button.controller.onAll(button.model);
      }
    }
  }

  /**
   *
   * @see https://github.com/Bioniclegenius/NummonCalc/blob/112f716e2fde9956dfe520021b0400cba7b7113e/NummonCalc.js#L490
   * @returns
   */
  getBestUnicornBuilding(): unknown {
    const unicornPasture = "unicornPasture";
    const pastureButton = this._buildManager.getBuildButton("unicornPasture");
    if (typeof pastureButton === "undefined") return;
    const validBuildings = [
      "unicornTomb",
      "ivoryTower",
      "ivoryCitadel",
      "skyPalace",
      "unicornUtopia",
      "sunspire",
    ];
    const unicornsPerSecond =
      this._host.gamePage.getEffect("unicornsPerTickBase") *
      this._host.gamePage.getTicksPerSecondUI();
    const globalRatio = this._host.gamePage.getEffect("unicornsGlobalRatio") + 1;
    const religionRatio = this._host.gamePage.getEffect("unicornsRatioReligion") + 1;
    const paragonRatio = this._host.gamePage.prestige.getParagonProductionRatio() + 1;
    const faithBonus = this._host.gamePage.religion.getSolarRevolutionRatio() + 1;
    let cycle = 1;
    if (
      this._host.gamePage.calendar.cycles[this._host.gamePage.calendar.cycle].festivalEffects[
        "unicorns"
      ] != undefined
    )
      if (
        this._host.gamePage.prestige.getPerk("numeromancy").researched &&
        this._host.gamePage.calendar.festivalDays
      )
        cycle = this._host.gamePage.calendar.cycles[this._host.gamePage.calendar.cycle]
          .festivalEffects["unicorns"];
    const onZig = Math.max(this._host.gamePage.bld.getBuildingExt("ziggurat").meta.on, 1);
    const total =
      unicornsPerSecond * globalRatio * religionRatio * paragonRatio * faithBonus * cycle;
    const baseUnicornsPerRift =
      500 * (1 + this._host.gamePage.getEffect("unicornsRatioReligion") * 0.1);
    let riftChanceRatio = 1;
    if (this._host.gamePage.prestige.getPerk("unicornmancy").researched) riftChanceRatio *= 1.1;
    const baseRift =
      ((this._host.gamePage.getEffect("riftChance") * riftChanceRatio) / (10000 * 2)) *
      baseUnicornsPerRift;
    let bestAmoritization = Infinity;
    let bestBuilding = "";
    let pastureAmor =
      this._host.gamePage.bld.getBuildingExt("unicornPasture").meta.effects["unicornsPerTickBase"] *
      this._host.gamePage.getTicksPerSecondUI();
    pastureAmor = pastureAmor * globalRatio * religionRatio * paragonRatio * faithBonus * cycle;
    pastureAmor = pastureButton.model.prices[0].val / pastureAmor;
    if (pastureAmor < bestAmoritization) {
      bestAmoritization = pastureAmor;
      bestBuilding = unicornPasture;
    }
    for (const i in this._religionManager.manager.tab.zgUpgradeButtons) {
      const btn = this._religionManager.manager.tab.zgUpgradeButtons[i];
      if (validBuildings.indexOf(btn.id) != -1) {
        if (btn.model.visible) {
          let unicornPrice = 0;
          for (var j in btn.model.prices) {
            if (btn.model.prices[j].name == "unicorns") unicornPrice += btn.model.prices[j].val;
            if (btn.model.prices[j].name == "tears")
              unicornPrice += (btn.model.prices[j].val * 2500) / onZig;
          }
          const bld = this._host.gamePage.religion.getZU(btn.id);
          let relBonus = religionRatio;
          let riftChance = this._host.gamePage.getEffect("riftChance");
          for (var j in bld.effects) {
            if (j == "unicornsRatioReligion") relBonus += bld.effects[j];
            if (j == "riftChance") riftChance += bld.effects[j];
          }
          const unicornsPerRift = 500 * ((relBonus - 1) * 0.1 + 1);
          let riftBonus = ((riftChance * riftChanceRatio) / (10000 * 2)) * unicornsPerRift;
          riftBonus -= baseRift;
          let amor = unicornsPerSecond * globalRatio * relBonus * paragonRatio * faithBonus * cycle;
          amor -= total;
          amor = amor + riftBonus;
          amor = unicornPrice / amor;
          if (amor < bestAmoritization)
            if (riftBonus > 0 || (relBonus > religionRatio && unicornPrice > 0)) {
              bestAmoritization = amor;
              bestBuilding = btn.id;
            }
        }
      }
    }
    return bestBuilding;
  }
}
