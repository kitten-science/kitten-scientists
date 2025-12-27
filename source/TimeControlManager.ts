import { isNil, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import type { BonfireManager } from "./BonfireManager.js";
import type { Engine, FrameContext } from "./Engine.js";
import type { KittenScientists } from "./KittenScientists.js";
import type { ReligionManager } from "./ReligionManager.js";
import { type CycleIndices, TimeControlSettings } from "./settings/TimeControlSettings.js";
import { objectEntries } from "./tools/Entries.js";
import { negativeOneToInfinity } from "./tools/Format.js";
import type { BuildingMeta, UnsafeBuilding } from "./types/buildings.js";
import {
  type ChronoForgeUpgrade,
  Cycles,
  TimeItemVariant,
  type VoidSpaceUpgrade,
} from "./types/index.js";
import type { ShatterTCBtnController } from "./types/time.js";
import type { WorkshopManager } from "./WorkshopManager.js";

export class TimeControlManager {
  private readonly _host: KittenScientists;
  readonly settings: TimeControlSettings;
  private readonly _religionManager: ReligionManager;
  private readonly _workshopManager: WorkshopManager;

  constructor(
    host: KittenScientists,
    _bonfireManager: BonfireManager,
    religionManager: ReligionManager,
    workshopManager: WorkshopManager,
    settings = new TimeControlSettings(),
  ) {
    this._host = host;
    this.settings = settings;

    this._religionManager = religionManager;
    this._workshopManager = workshopManager;
  }

  async tick(_context: FrameContext) {
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

  async autoReset(engine: Engine) {
    // Don't reset if there's a challenge running.
    if (this._host.game.challenges.currentChallenge) {
      return;
    }

    const checkedList: Array<{ name: string; trigger: number; val: number }> = [];

    // check building
    for (const [name, entry] of objectEntries(this.settings.reset.bonfire.buildings)) {
      if (!entry.enabled) {
        continue;
      }

      // If the trigger for an item is set to infinity, it basically disables the entire feature.
      if (entry.trigger < 0) {
        return;
      }

      // TODO: Obvious error here. For upgraded buildings, it needs special handling.
      let bld: BuildingMeta<UnsafeBuilding> | null;
      try {
        // @ts-expect-error Obvious error here. For upgraded buildings, it needs special handling.
        bld = this._host.game.bld.getBuildingExt(name);
      } catch (_error) {
        bld = null;
      }
      if (isNil(bld)) {
        continue;
      }

      checkedList.push({
        name: bld.meta.label ?? mustExist(bld.meta.stages)[mustExist(bld.meta.stage)].label,
        trigger: entry.trigger,
        val: bld.meta.val,
      });
      // If the required amount of buildings hasn't been built yet, bail out.
      if (bld.meta.val < entry.trigger) {
        return;
      }
    }

    // unicornPasture
    // Special handling for unicorn pasture. As it's listed under religion, but is
    // actually a bonfire item.
    const unicornPasture = this.settings.reset.religion.buildings.unicornPasture;
    if (unicornPasture.enabled) {
      // If the trigger for an item is set to infinity, it basically disables the entire feature.
      if (unicornPasture.trigger < 0) {
        return;
      }

      const bld = this._host.game.bld.getBuildingExt("unicornPasture");
      checkedList.push({
        name: mustExist(bld.meta.label),
        trigger: unicornPasture.trigger,
        val: bld.meta.val,
      });
      if (bld.meta.val < unicornPasture.trigger) {
        return;
      }
    }

    // check space
    // This is identical to regular buildings.
    for (const [name, entry] of objectEntries(this.settings.reset.space.buildings)) {
      if (!entry.enabled) {
        continue;
      }

      // If the trigger for an item is set to infinity, it basically disables the entire feature.
      if (entry.trigger < 0) {
        return;
      }

      const bld = this._host.game.space.getBuilding(name);
      checkedList.push({ name: bld.label, trigger: entry.trigger, val: bld.val });
      if (bld.val < entry.trigger) {
        return;
      }
    }

    // check religion
    for (const [name, entry] of objectEntries(this.settings.reset.religion.buildings)) {
      if (!entry.enabled) {
        continue;
      }

      // If the trigger for an item is set to infinity, it basically disables the entire feature.
      if (entry.trigger < 0) {
        return;
      }

      const bld = mustExist(this._religionManager.getUpgradeMeta(name, entry.variant));
      checkedList.push({ name: bld.label, trigger: entry.trigger, val: bld.val });
      if (bld.val < entry.trigger) {
        return;
      }
    }

    // check time
    for (const [name, entry] of objectEntries(this.settings.reset.time.buildings)) {
      if (!entry.enabled) {
        continue;
      }

      // If the trigger for an item is set to infinity, it basically disables the entire feature.
      if (entry.trigger < 0) {
        return;
      }

      const bld = mustExist(this.getBuild(name, entry.variant));
      checkedList.push({ name: bld.label, trigger: entry.trigger, val: bld.val });
      if (bld.val < entry.trigger) {
        return;
      }
    }

    // check resources
    for (const [name, entry] of objectEntries(this.settings.reset.resources.resources)) {
      if (!entry.enabled) {
        continue;
      }

      // If the trigger for an item is set to infinity, it basically disables the entire feature.
      if (entry.trigger < 0) {
        return;
      }

      const res = mustExist(this._host.game.resPool.get(name));
      checkedList.push({
        name: this._host.engine.i18n(`$resources.${entry.resource}.title`),
        trigger: entry.trigger,
        val: res.value,
      });
      if (res.value < entry.trigger) {
        return;
      }
    }

    // Check Workshop upgrades
    for (const [, entry] of objectEntries(this.settings.reset.upgrades.upgrades)) {
      if (entry.enabled) {
        const upgrade = mustExist(
          this._host.game.workshop.upgrades.find(subject => subject.name === entry.upgrade),
        );
        checkedList.push({ name: upgrade.label, trigger: 1, val: upgrade.researched ? 1 : 0 });
        if (!upgrade.researched) {
          return;
        }
      }
    }

    if (checkedList.length === 0) {
      return;
    }

    // We have now determined that we either have all items or could buy all items.

    // stop!
    engine.standBy();

    const sleep = async (time = 1500) => {
      return new Promise((resolve, reject) => {
        if (!this._host.engine.settings.enabled) {
          reject(new Error("canceled by player"));
          return;
        }
        setTimeout(resolve, time);
      });
    };

    try {
      for (const checked of checkedList) {
        await sleep(500);
        this._host.engine.imessage("reset.check", [
          checked.name,
          this._host.game.getDisplayValueExt(checked.trigger),
          this._host.game.getDisplayValueExt(checked.val),
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
    } catch (_error) {
      this._host.engine.imessage("reset.cancel.message");
      this._host.engine.iactivity("reset.cancel.activity");
      return;
    }

    //=============================================================
    for (
      let challengeIndex = 0;
      challengeIndex < this._host.game.challenges.challenges.length;
      challengeIndex++
    ) {
      this._host.game.challenges.challenges[challengeIndex].pending = false;
    }
    this._host.game.resetAutomatic();
    //=============================================================
  }

  accelerateTime() {
    const temporalFluxAvailable = this._workshopManager.getValueAvailable("temporalFlux");

    // If there's no available flux (we went below the limit)
    if (temporalFluxAvailable <= 0) {
      if (this._host.game.time.isAccelerated) {
        // Stop the acceleration
        this._host.game.time.isAccelerated = false;
      }
      return;
    }

    if (this._host.game.time.isAccelerated) {
      return;
    }

    const temporalFlux = this._host.game.resPool.get("temporalFlux");

    if (temporalFlux.maxValue * this.settings.accelerateTime.trigger <= temporalFlux.value) {
      this._host.game.time.isAccelerated = true;
      this._host.engine.iactivity("act.accelerate", [], "ks-accelerate");
      this._host.engine.storeForSummary("accelerate", 1);
    }
  }

  timeSkip() {
    if (!this._host.game.workshop.get("chronoforge").researched) {
      return;
    }

    // Don't time skip while we're in a temporal paradox.
    if (this._host.game.calendar.day < 0) {
      return;
    }

    // If we have less time crystals than our required trigger value, bail out.
    const shatterCostIncreaseChallenge = this._host.game.getEffect("shatterCostIncreaseChallenge");
    const timeCrystalsAvailable = this._workshopManager.getValueAvailable("timeCrystal");
    if (
      timeCrystalsAvailable < this.settings.timeSkip.trigger ||
      timeCrystalsAvailable < 1 + shatterCostIncreaseChallenge
    ) {
      return;
    }

    const shatterVoidCost = this._host.game.getEffect("shatterVoidCost");
    const voidAvailable = this._workshopManager.getValueAvailable("void");
    if (voidAvailable < shatterVoidCost) {
      return;
    }

    // If skipping during this season was disabled, bail out.
    const season = this._host.game.calendar.season;
    if (!this.settings.timeSkip.seasons[this._host.game.calendar.seasons[season].name].enabled) {
      return;
    }

    // If skipping during this cycle was disabled, bail out.
    const currentCycle = this._host.game.calendar.cycle;
    if (!this.settings.timeSkip.cycles[Cycles[currentCycle]].enabled) {
      return;
    }

    // If we have too much stored heat, wait for it to cool down.
    const heatMax = this._host.game.getEffect("heatMax");
    const heatNow = this._host.game.time.heat;
    if (!this.settings.timeSkip.ignoreOverheat.enabled) {
      if (heatMax <= heatNow) {
        return;
      }
    }

    const factor = this._host.game.challenges.getChallenge("1000Years").researched ? 5 : 10;
    let maxSkipsActiveHeatTransfer = Number.POSITIVE_INFINITY;
    // Active Heat Transfer
    if (
      !this.settings.timeSkip.ignoreOverheat.enabled &&
      this.settings.timeSkip.activeHeatTransfer.enabled
    ) {
      const heatPerTick = this._host.game.getEffect("heatPerTick");
      const ticksPerSecond = this._host.game.ticksPerSecond;
      if (this.settings.timeSkip.activeHeatTransfer.activeHeatTransferStatus.enabled) {
        // Heat Transfer to specified value
        if (heatNow <= heatMax * this.settings.timeSkip.activeHeatTransfer.trigger) {
          this.settings.timeSkip.activeHeatTransfer.activeHeatTransferStatus.enabled = false;
          this._host.refreshEntireUserInterface();
          this._host.engine.iactivity("act.time.activeHeatTransferEnd", [], "ks-timeSkip");
        }
        // Get temporalFlux
        // TODO: More judgment(e.g. determining crystal cost)? Or should the players decide for themselves(Add options)?
        const temporalFluxProduction = this._host.game.getEffect("temporalFluxProduction");
        const daysPerYear =
          (this._host.game.calendar.daysPerSeason +
            10 +
            this._host.game.getEffect("temporalParadoxDay")) *
          this._host.game.calendar.seasonsPerYear;
        const ticksPerDay = this._host.game.calendar.ticksPerDay;
        const daysPerTicks = (1 + this._host.game.timeAccelerationRatio()) / ticksPerDay;
        const ticksPerYear = daysPerYear / daysPerTicks;
        const temporalFlux = this._host.game.resPool.get("temporalFlux");
        const fluxEnabled = temporalFlux.maxValue > ticksPerYear;
        const flux = temporalFlux.value < ticksPerYear;
        if (
          !season &&
          this._host.game.calendar.day < 10 &&
          temporalFluxProduction > factor / heatPerTick &&
          this.settings.accelerateTime.enabled &&
          fluxEnabled &&
          flux
        ) {
          maxSkipsActiveHeatTransfer = Math.ceil(
            (ticksPerYear + ticksPerDay * 10 - temporalFlux.value) / temporalFluxProduction,
          );
          this._host.engine.iactivity("act.time.getTemporalFlux", [], "ks-timeSkip");
          this._host.engine.storeForSummary("time.getTemporalFlux", 1);
        } else if (this.settings.timeSkip.activeHeatTransfer.cycles[Cycles[currentCycle]].enabled) {
          // Heat Transfer during selected cycles
          return;
        } else {
          maxSkipsActiveHeatTransfer =
            this._host.game.calendar.yearsPerCycle - this._host.game.calendar.cycleYear;
        }
      } else if (heatNow >= heatMax - heatPerTick * ticksPerSecond * 10) {
        this.settings.timeSkip.activeHeatTransfer.activeHeatTransferStatus.enabled = true;
        this._host.refreshEntireUserInterface();
        this._host.engine.iactivity("act.time.activeHeatTransferStart", [], "ks-timeSkip");
        this._host.engine.storeForSummary("time.activeHeatTransferStart", 1);
      }
    }

    // The maximum years to skip, based on the user configuration.
    const maxSkips = negativeOneToInfinity(this.settings.timeSkip.max);

    // The amount of skips we can perform.
    let canSkip = Math.floor(
      Math.min(
        this.settings.timeSkip.ignoreOverheat.enabled
          ? Number.POSITIVE_INFINITY
          : (heatMax - heatNow) / factor,
        maxSkips,
        maxSkipsActiveHeatTransfer,
        timeCrystalsAvailable / (1 + shatterCostIncreaseChallenge),
        0 < shatterVoidCost ? voidAvailable / shatterVoidCost : Number.POSITIVE_INFINITY,
      ),
    );

    // The amount of skips to perform.
    let willSkip = 0;

    const yearsPerCycle = this._host.game.calendar.yearsPerCycle;
    const remainingYearsCurrentCycle = yearsPerCycle - this._host.game.calendar.cycleYear;
    const cyclesPerEra = this._host.game.calendar.cyclesPerEra;
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
        this.settings.timeSkip.cycles[
          Cycles[((currentCycle + skipCycles) % cyclesPerEra) as CycleIndices]
        ].enabled
      ) {
        willSkip += yearsPerCycle;
        canSkip -= yearsPerCycle;
        skipCycles += 1;
      }
      if (
        this.settings.timeSkip.cycles[
          Cycles[((currentCycle + skipCycles) % cyclesPerEra) as CycleIndices]
        ].enabled &&
        0 < canSkip
      ) {
        willSkip += canSkip;
      }
    }
    // If we found we can skip any years, do so now.
    if (0 < willSkip) {
      const controller = new classes.ui.time.ShatterTCBtnController(
        this._host.game,
      ) as ShatterTCBtnController;
      const model = controller.fetchModel({});
      controller.doShatterAmt(model, willSkip);
      this._host.engine.iactivity("act.time.skip", [willSkip], "ks-timeSkip");
      this._host.engine.storeForSummary("time.skip", willSkip);
    }
  }

  getBuild(name: ChronoForgeUpgrade | VoidSpaceUpgrade, variant: TimeItemVariant) {
    if (variant === TimeItemVariant.Chronoforge) {
      return this._host.game.time.getCFU(name as ChronoForgeUpgrade);
    }
    return this._host.game.time.getVSU(name as VoidSpaceUpgrade);
  }
}
