import { CacheManager } from "./CacheManager";
import { TabManager } from "./TabManager";
import { objectEntries } from "./tools/Entries";
import { isNil } from "./tools/Maybe";
import { Job, Resource } from "./types";
import { VillageTab } from "./types/village";
import { UserScript } from "./UserScript";
import { WorkshopManager } from "./WorkshopManager";

export class VillageManager {
  private readonly _host: UserScript;
  readonly manager: TabManager<VillageTab>;
  private readonly _workshopManager: WorkshopManager;

  constructor(host: UserScript) {
    this._host = host;
    this.manager = new TabManager(this._host, "Village");
    this._workshopManager = new WorkshopManager(this._host);
  }

  autoDistributeKittens() {
    const freeKittens = this._host.gamePage.village.getFreeKittens();
    if (!freeKittens) {
      return;
    }

    let jobName: Job | undefined;
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
      this.manager.render();
      this._host.iactivity(
        "act.distribute",
        [this._host.i18n(`$village.job.${jobName}` as const)],
        "ks-distribute"
      );
      this._host.storeForSummary("distribute", 1);
    }
  }

  autoPromote(): void {
    // If we have Civil Service unlocked and a leader elected.
    if (
      this._host.gamePage.science.get("civil").researched &&
      this._host.gamePage.village.leader !== null
    ) {
      const leader = this._host.gamePage.village.leader;
      const rank = leader.rank;
      const gold = this._workshopManager.getResource("gold");
      const goldStock = this._workshopManager.getStock("gold");

      // this._host.gamePage.village.sim.goldToPromote will check gold
      // this._host.gamePage.village.sim.promote check both gold and exp
      if (
        this._host.gamePage.village.sim.goldToPromote(rank, rank + 1, gold.value - goldStock)[0] &&
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

  autoHunt(cacheManager?: CacheManager) {
    const manpower = this._workshopManager.getResource("manpower");
    const subTrigger = this._host.options.auto.options.items.hunt.subTrigger ?? 0;

    if (manpower.value < 100 || this._host.gamePage.challenges.isActive("pacifism")) {
      return;
    }

    if (subTrigger <= manpower.value / manpower.maxValue && 100 <= manpower.value) {
      // Determine how many hunts are being performed.
      let huntCount = Math.floor(manpower.value / 100);
      this._host.storeForSummary("hunt", huntCount);
      this._host.iactivity("act.hunt", [huntCount], "ks-hunt");

      huntCount = Math.floor(manpower.value / 100);
      const averageOutput = this._workshopManager.getAverageHunt();
      const trueOutput: Partial<Record<Resource, number>> = {};

      for (const [out, outValue] of objectEntries(averageOutput)) {
        const res = this._workshopManager.getResource(out);
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
      if (!isNil(cacheManager)) {
        cacheManager.pushToCache({
          materials: trueOutput,
          timeStamp: this._host.gamePage.timer.ticksTotal,
        });
      }

      // Now actually perform the hunts.
      this._host.gamePage.village.huntAll();
    }
  }

  autoFestival(cacheManager?: CacheManager) {
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
    const craftManager = this._workshopManager;
    if (
      craftManager.getValueAvailable("manpower", true) < 1500 ||
      craftManager.getValueAvailable("culture", true) < 5000 ||
      craftManager.getValueAvailable("parchment", true) < 2500
    ) {
      return;
    }

    // Check if the festival would even be profitable for any resource production.
    const catpowProfitable =
      4000 *
        (craftManager.getTickVal(
          craftManager.getResource("manpower"),
          cacheManager,
          true
        ) as number) >
      1500;
    const cultureProfitable =
      4000 *
        (craftManager.getTickVal(
          craftManager.getResource("culture"),
          cacheManager,
          true
        ) as number) >
      5000;
    const parchProfitable =
      4000 *
        (craftManager.getTickVal(
          craftManager.getResource("parchment"),
          cacheManager,
          true
        ) as number) >
      2500;

    if (!catpowProfitable && !cultureProfitable && !parchProfitable) {
      return;
    }

    // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
    this.manager.render();

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
}
