import { BonfireManager } from "./BonfireManager";
import { Engine, TickContext } from "./Engine";
import { CycleIndices, TimeControlSettings } from "./options/TimeControlSettings";
import { ReligionManager } from "./ReligionManager";
import { SpaceManager } from "./SpaceManager";
import { TabManager } from "./TabManager";
import { objectEntries } from "./tools/Entries";
import { isNil, mustExist } from "./tools/Maybe";
import {
  BuildButton,
  ChronoForgeUpgradeInfo,
  ChronoForgeUpgrades,
  TimeItemVariant,
  TimeTab,
  VoidSpaceUpgradeInfo,
  VoidSpaceUpgrades,
} from "./types";
import { UserScript } from "./UserScript";

export class TimeControlManager {
  private readonly _host: UserScript;
  settings: TimeControlSettings;
  readonly manager: TabManager<TimeTab>;
  private readonly _bonfireManager: BonfireManager;
  private readonly _religionManager: ReligionManager;
  private readonly _spaceManager: SpaceManager;

  constructor(
    host: UserScript,
    bonfireManager: BonfireManager,
    religionManager: ReligionManager,
    spaceManager: SpaceManager,
    settings = new TimeControlSettings()
  ) {
    this._host = host;
    this.settings = settings;
    this.manager = new TabManager(this._host, "Time");

    this._bonfireManager = bonfireManager;
    this._religionManager = religionManager;
    this._spaceManager = spaceManager;
  }

  async tick(context: TickContext) {
    if (!this.settings.enabled) {
      return;
    }

    if (this.settings.accelerateTime.enabled) {
      this.accelerateTime();
    }
    if (this.settings.timeSkip.enabled) {
      this.timeSkip();
    }
    if (this.settings.reset.enabled) {
      await this.autoReset(this._host.engine);
    }
  }

  load(settings: TimeControlSettings) {
    this.settings.load(settings);
  }

  async autoReset(engine: Engine) {
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
        for (const button of buttons) {
          if (!button.model.metadata) {
            continue;
          }
          const name = button.model.metadata.name;
          const index = checkList.indexOf(name);
          if (index !== -1) {
            checkList.splice(index, 1);
            if (this._host.gamePage.resPool.hasRes(button.model.prices)) {
              return true;
            }
          }
        }
      }
      return false;
    };

    // check building
    for (const [name, entry] of objectEntries(this.settings.buildItems))
      if (entry.enabled) {
        // TODO: Obvious error here. For upgraded buildings, it needs special handling.
        let bld;
        try {
          // @ts-expect-error Obvious error here. For upgraded buildings, it needs special handling.
          bld = this._host.gamePage.bld.getBuildingExt(name);
        } catch (error) {
          bld = null;
        }
        if (isNil(bld)) {
          continue;
        }

        checkedList.push({
          name: mustExist(bld.meta.label),
          trigger: entry.trigger,
          val: bld.meta.val,
        });
        if (0 < entry.trigger) {
          // If the required amount of buildings hasn't been built yet, bail out.
          if (bld.meta.val < entry.trigger) {
            return;
          }
        } else {
          checkList.push(name);
        }
      }

    // unicornPasture
    // Special handling for unicorn pasture. As it's listed under religion, but is
    // actually a bonfire item.
    const unicornPasture = this.settings.religionItems.unicornPasture;
    if (unicornPasture.enabled) {
      const bld = this._host.gamePage.bld.getBuildingExt("unicornPasture");
      checkedList.push({
        name: mustExist(bld.meta.label),
        trigger: unicornPasture.trigger,
        val: bld.meta.val,
      });
      if (0 < unicornPasture.trigger) {
        if (bld.meta.val < unicornPasture.trigger) {
          return;
        }
      } else {
        checkList.push("unicornPasture");
      }
    }
    if (check(this._bonfireManager.manager.tab.buttons) || checkList.length) {
      return;
    }

    // check space
    // This is identical to regular buildings.
    for (const [name, entry] of objectEntries(this.settings.spaceItems)) {
      if (entry.enabled) {
        const bld = this._host.gamePage.space.getBuilding(name);
        checkedList.push({ name: bld.label, trigger: entry.trigger, val: bld.val });
        if (0 < entry.trigger) {
          if (bld.val < entry.trigger) {
            return;
          }
        } else {
          checkList.push(name);
        }
      }
    }

    if (checkList.length === 0) {
      const panels = this._spaceManager.manager.tab.planetPanels;
      for (const panel of panels) {
        for (const panelButton of panel.children) {
          const model = panelButton.model;
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
    for (const [name, entry] of objectEntries(this.settings.religionItems)) {
      if (entry.enabled) {
        const bld = mustExist(this._religionManager.getBuild(name, entry.variant));
        checkedList.push({ name: bld.label, trigger: entry.trigger, val: bld.val });
        if (0 < entry.trigger) {
          if (bld.val < entry.trigger) {
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
    for (const [name, entry] of objectEntries(this.settings.timeItems)) {
      if (entry.enabled) {
        const bld = mustExist(this.getBuild(name, entry.variant));
        checkedList.push({ name: bld.label, trigger: entry.trigger, val: bld.val });
        if (0 < entry.trigger) {
          if (bld.val < entry.trigger) {
            return;
          }
        } else {
          checkList.push(name);
        }
      }
    }

    if (
      check(this.manager.tab.children[2].children[0].children) ||
      check(this.manager.tab.children[3].children[0].children) ||
      checkList.length
    ) {
      return;
    }

    // check resources
    for (const [name, entry] of objectEntries(this.settings.resources)) {
      if (entry.enabled) {
        const res = mustExist(this._host.gamePage.resPool.get(name));
        checkedList.push({ name: res.title, trigger: entry.stock, val: res.value });
        if (res.value < entry.stock) {
          return;
        }
      }
    }

    // We have now determined that we either have all items or could buy all items.

    // stop!
    engine.stop(false);

    const sleep = async (time = 1500) => {
      return new Promise((resolve, reject) => {
        if (
          !(
            this._host.engine.settings.enabled &&
            this.settings.enabled &&
            this.settings.reset.enabled
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
        this._host.engine.imessage("reset.check", [
          checked.name,
          this._host.gamePage.getDisplayValueExt(checked.trigger),
          this._host.gamePage.getDisplayValueExt(checked.val),
        ]);
      }

      await sleep(0);
      this._host.engine.imessage("reset.checked");
      await sleep();
      this._host.engine.iactivity("reset.tip");
      await sleep();
      this._host.engine.imessage("reset.countdown.10");
      await sleep(2000);
      this._host.engine.imessage("reset.countdown.9");
      await sleep();
      this._host.engine.imessage("reset.countdown.8");
      await sleep();
      this._host.engine.imessage("reset.countdown.7");
      await sleep();
      this._host.engine.imessage("reset.countdown.6");
      await sleep();
      this._host.engine.imessage("reset.countdown.5");
      await sleep();
      this._host.engine.imessage("reset.countdown.4");
      await sleep();
      this._host.engine.imessage("reset.countdown.3");
      await sleep();
      this._host.engine.imessage("reset.countdown.2");
      await sleep();
      this._host.engine.imessage("reset.countdown.1");
      await sleep();
      this._host.engine.imessage("reset.countdown.0");
      await sleep();
      this._host.engine.iactivity("reset.last.message");
      await sleep();
    } catch (error) {
      this._host.engine.imessage("reset.cancel.message");
      this._host.engine.iactivity("reset.cancel.activity");
      return;
    }

    // Force writing out current settings right now
    this._host.saveSettings();

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

  accelerateTime() {
    if (this._host.gamePage.time.isAccelerated) {
      return;
    }
    const temporalFlux = this._host.gamePage.resPool.get("temporalFlux");
    if (temporalFlux.value >= temporalFlux.maxValue * this.settings.accelerateTime.trigger) {
      this._host.gamePage.time.isAccelerated = true;
      this._host.engine.iactivity("act.accelerate", [], "ks-accelerate");
      this._host.engine.storeForSummary("accelerate", 1);
    }
  }

  timeSkip() {
    if (!this._host.gamePage.workshop.get("chronoforge").researched) {
      return;
    }

    // TODO: Not sure when this would ever be true.
    if (this._host.gamePage.calendar.day < 0) {
      return;
    }

    // If we have less time crystals than our required trigger value, bail out.
    const timeCrystal = this._host.gamePage.resPool.get("timeCrystal");
    if (timeCrystal.value < this.settings.timeSkip.trigger) {
      return;
    }

    // If skipping during this season was disabled, bail out.
    const season = this._host.gamePage.calendar.season;
    if (!this.settings.timeSkip[this._host.gamePage.calendar.seasons[season].name]) {
      return;
    }

    // If skipping during this cycle was disabled, bail out.
    const currentCycle = this._host.gamePage.calendar.cycle;
    if (!this.settings.timeSkip[currentCycle]) {
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
    let canSkip = Math.min(
      Math.floor((heatMax - heatNow) / factor),
      this.settings.timeSkip.maximum
    );
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
        this.settings.timeSkip[((currentCycle + skipCycles) % cyclesPerEra) as CycleIndices]
      ) {
        willSkip += yearsPerCycle;
        canSkip -= yearsPerCycle;
        skipCycles += 1;
      }
      if (
        this.settings.timeSkip[((currentCycle + skipCycles) % cyclesPerEra) as CycleIndices] &&
        0 < canSkip
      ) {
        willSkip += canSkip;
      }
    }
    // If we found we can skip any years, do so now.
    if (0 < willSkip) {
      const shatter = this._host.gamePage.timeTab.cfPanel.children[0].children[0]; // check?
      this._host.engine.iactivity("act.time.skip", [willSkip], "ks-timeSkip");
      shatter.controller.doShatterAmt(shatter.model, willSkip);
      this._host.engine.storeForSummary("time.skip", willSkip);
    }
  }

  getBuild(
    name: ChronoForgeUpgrades | VoidSpaceUpgrades,
    variant: TimeItemVariant
  ): ChronoForgeUpgradeInfo | VoidSpaceUpgradeInfo | null {
    if (variant === TimeItemVariant.Chronoforge) {
      return this._host.gamePage.time.getCFU(name as ChronoForgeUpgrades) ?? null;
    } else {
      return this._host.gamePage.time.getVSU(name as VoidSpaceUpgrades) ?? null;
    }
  }
}
