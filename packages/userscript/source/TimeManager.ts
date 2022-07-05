import { BonfireManager } from "./BonfireManager";
import { BulkManager } from "./BulkManager";
import { Engine } from "./Engine";
import { SettingsStorage } from "./options/SettingsStorage";
import { CycleIndices } from "./options/TimeControlSettings";
import { TimeItem, TimeSettingsItem } from "./options/TimeSettings";
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

export class TimeManager {
  private readonly _host: UserScript;
  readonly manager: TabManager<TimeTab>;
  private readonly _bonfireManager: BonfireManager;
  private readonly _religionManager: ReligionManager;
  private readonly _spaceManager: SpaceManager;
  private readonly _bulkManager: BulkManager;

  constructor(host: UserScript) {
    this._host = host;
    this.manager = new TabManager(this._host, "Time");
    this._bonfireManager = new BonfireManager(this._host);
    this._religionManager = new ReligionManager(this._host);
    this._spaceManager = new SpaceManager(this._host);
    this._bulkManager = new BulkManager(this._host);
  }

  /**
   * Try to build as many of the passed buildings as possible.
   * Usually, this is called at each iteration of the automation engine to
   * handle the building of items on the Time tab.
   *
   * @param builds The buildings to build.
   */
  autoBuild(
    builds: Partial<Record<TimeItem, TimeSettingsItem>> = this._host.options.auto.time.items
  ) {
    // TODO: Refactor. See BonfireManager.autoBuild
    if (!this._host.gamePage.timeTab.visible) {
      return;
    }
    const trigger = this._host.options.auto.time.trigger;

    // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
    this.manager.render();

    const metaData: Partial<Record<TimeItem, ChronoForgeUpgradeInfo | VoidSpaceUpgradeInfo>> = {};
    for (const [name, build] of objectEntries(builds)) {
      metaData[name] = mustExist(this.getBuild(name, build.variant));

      const model = mustExist(this.getBuildButton(name, build.variant)).model;
      const panel =
        build.variant === TimeItemVariant.Chronoforge
          ? this.manager.tab.cfPanel
          : this.manager.tab.vsPanel;

      const buildingMetaData = mustExist(metaData[name]);
      buildingMetaData.tHidden = !model.visible || !model.enabled || !panel?.visible;
    }

    const buildList = this._bulkManager.bulk(builds, metaData, trigger);

    let refreshRequired = false;
    for (const build of buildList) {
      if (build.count > 0) {
        this.build(
          build.id as ChronoForgeUpgrades | VoidSpaceUpgrades,
          build.variant as TimeItemVariant,
          build.count
        );
        refreshRequired = true;
      }
    }

    if (refreshRequired) {
      this._host.gamePage.ui.render();
    }
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
    for (const [name, entry] of objectEntries(this._host.options.auto.timeCtrl.buildItems))
      if (entry.checkForReset) {
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
          trigger: entry.triggerForReset,
          val: bld.meta.val,
        });
        if (0 < entry.triggerForReset) {
          // If the required amount of buildings hasn't been built yet, bail out.
          if (bld.meta.val < entry.triggerForReset) {
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
      const bld = this._host.gamePage.bld.getBuildingExt("unicornPasture");
      checkedList.push({
        name: mustExist(bld.meta.label),
        trigger: unicornPasture.triggerForReset,
        val: bld.meta.val,
      });
      if (0 < unicornPasture.triggerForReset) {
        if (bld.meta.val < unicornPasture.triggerForReset) {
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
        const bld = mustExist(this.getBuild(name, entry.variant));
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
      check(this.manager.tab.children[2].children[0].children) ||
      check(this.manager.tab.children[3].children[0].children) ||
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
    engine.stop(false);

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

    // Force writing out current settings right now
    const toExport = this._host.options.asLegacyOptions();
    SettingsStorage.setLegacySettings(toExport);

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

  autoTimeControl() {
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

  build(
    name: ChronoForgeUpgrades | VoidSpaceUpgrades,
    variant: TimeItemVariant,
    amount: number
  ): void {
    const build = this.getBuild(name, variant);
    if (build === null) {
      throw new Error(`Unable to build '${name}'. Build information not available.`);
    }

    const button = this.getBuildButton(name, variant);
    if (!button || !button.model.enabled) return;

    const amountTemp = amount;
    const label = build.label;
    amount = this._bulkManager.construct(button.model, button, amount);
    if (amount !== amountTemp) {
      this._host.warning(`${label} Amount ordered: ${amountTemp} Amount Constructed: ${amount}`);
    }
    this._host.storeForSummary(label, amount, "build");

    if (amount === 1) {
      this._host.iactivity("act.build", [label], "ks-build");
    } else {
      this._host.iactivity("act.builds", [label, amount], "ks-build");
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

  getBuildButton(
    name: ChronoForgeUpgrades | VoidSpaceUpgrades,
    variant: TimeItemVariant
  ): BuildButton | null {
    let buttons: Array<BuildButton>;
    if (variant === TimeItemVariant.Chronoforge) {
      buttons = this.manager.tab.children[2].children[0].children;
    } else {
      buttons = this.manager.tab.children[3].children[0].children;
    }

    const build = this.getBuild(name, variant);
    if (build === null) {
      throw new Error(`Unable to retrieve build information for '${name}'`);
    }

    for (const button of buttons) {
      const haystack = button.model.name;
      if (haystack.indexOf(build.label) !== -1) {
        return button;
      }
    }

    return null;
  }
}
