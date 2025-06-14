import { isNil, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import type { Automation, FrameContext } from "./Engine.js";
import { MaterialsCache } from "./helper/MaterialsCache.js";
import type { KittenScientists } from "./KittenScientists.js";
import { VillageSettings } from "./settings/VillageSettings.js";
import { objectEntries } from "./tools/Entries.js";
import { negativeOneToInfinity } from "./tools/Format.js";
import type { Resource } from "./types/index.js";
import type { UnsafeJob } from "./types/village.js";
import type { WorkshopManager } from "./WorkshopManager.js";

export class VillageManager implements Automation {
  private readonly _host: KittenScientists;
  readonly settings: VillageSettings;
  private readonly _cacheManager: MaterialsCache;
  private readonly _workshopManager: WorkshopManager;

  constructor(
    host: KittenScientists,
    workshopManager: WorkshopManager,
    settings = new VillageSettings(),
  ) {
    this._host = host;
    this.settings = settings;
    this._cacheManager = new MaterialsCache(this._host);
    this._workshopManager = workshopManager;
  }

  tick(context: FrameContext) {
    if (!this.settings.enabled) {
      return;
    }

    this.autoDistributeKittens(context);

    if (this.settings.hunt.enabled) {
      this.autoHunt(this._cacheManager);
    }

    if (this.settings.holdFestivals.enabled) {
      this.autoFestival(this._cacheManager);
    }

    if (this.settings.electLeader.enabled) {
      this.autoElect();
    }

    if (this.settings.promoteLeader.enabled) {
      this.autoPromoteLeader();
    }

    if (this.settings.promoteKittens.enabled) {
      this.autoPromoteKittens();
    }
  }

  autoDistributeKittens(context: FrameContext) {
    const freeKittens = this._host.game.village.getFreeKittens();
    if (!freeKittens) {
      return;
    }

    for (let assignedKitten = 0; assignedKitten < freeKittens; ++assignedKitten) {
      // Find all jobs where we haven't assigned the maximum desired kittens yet.
      const jobsNotCapped = new Array<{ job: UnsafeJob; count: number; toCap: number }>();
      for (const job of this._host.game.village.jobs) {
        // Skip disabled jobs and those that haven't been unlocked;
        const enabled = this.settings.jobs[job.name].enabled;
        const unlocked = job.unlocked;
        if (!enabled || !unlocked) {
          continue;
        }

        const maxKittensInJob = this._host.game.village.getJobLimit(job.name);
        const maxKittensToAssign = negativeOneToInfinity(this.settings.jobs[job.name].max);
        const kittensInJob = job.value;
        if (kittensInJob < maxKittensInJob && kittensInJob < maxKittensToAssign) {
          jobsNotCapped.push({ count: kittensInJob, job, toCap: maxKittensInJob - kittensInJob });
        }
      }

      if (!jobsNotCapped.length) {
        return;
      }

      // Check if we _could_ assign farmers _and_ currently don't have any assigned.
      // The idea here is, don't assign any kittens into jobs without having filled
      // that single open farmer position first. This might prevent kitten death in
      // certain scenarios.
      const noFarmersAssigned = !isNil(
        jobsNotCapped.find(job => job.job.name === "farmer" && job.count === 0),
      );

      // Find the job with the least kittens assigned and assign a kitten to that job.
      jobsNotCapped.sort((a, b) => a.count - b.count);
      const jobName = noFarmersAssigned ? "farmer" : jobsNotCapped[0].job.name;

      this._host.game.village.assignJob(this._host.game.village.getJob(jobName), 1);
      context.requestGameUiRefresh = true;
      this._host.engine.iactivity(
        "act.distribute",
        [this._host.engine.i18n(`$village.job.${jobName}` as const)],
        "ks-distribute",
      );
    }
    this._host.engine.storeForSummary("distribute", freeKittens);
  }

  autoElect(): void {
    // We can't assign a leader in the Anarchy challenge.
    if (this._host.game.challenges.isActive("anarchy")) {
      return;
    }

    const kittens = this._host.game.village.sim.kittens;
    const leader = this._host.game.village.leader;
    const job = this.settings.electLeader.job.selected;
    const trait = this.settings.electLeader.trait.selected;

    const leaderCandidates = kittens.filter(
      kitten => (kitten.job === job || job === "any") && kitten.trait.name === trait,
    );

    if (leaderCandidates.length === 0) {
      return;
    }

    leaderCandidates.sort((a, b) => b.rank - a.rank);
    const bestLeader = leaderCandidates[0];
    if (!isNil(leader)) {
      if (
        leader.trait.name === trait &&
        (leader.job === job || job === "any") &&
        bestLeader.rank <= leader.rank
      ) {
        return;
      }
    }

    this._host.game.village.makeLeader(bestLeader);
    this._host.engine.iactivity("act.elect");
  }

  autoPromoteKittens(): void {
    const gold = this._workshopManager.getResource("gold");
    if (this.settings.promoteKittens.trigger < gold.value / gold.maxValue) {
      return;
    }

    for (
      let kittenIndex = 0;
      kittenIndex < this._host.game.village.sim.kittens.length;
      kittenIndex++
    ) {
      let tier = -1;
      const engineerSpeciality =
        this._host.game.village.sim.kittens[kittenIndex].engineerSpeciality;
      // If this kitten has no engineer specialty, skip it.
      if (isNil(engineerSpeciality)) {
        continue;
      }

      // Check which rank would be ideal for their craft.
      tier = mustExist(this._host.game.workshop.getCraft(engineerSpeciality)).tier;
      // If the rank has already been reached, check next kitten.
      if (tier <= this._host.game.village.sim.kittens[kittenIndex].rank) {
        continue;
      }

      // We have found an engineer that isn't at their ideal rank.
      // No need to look further.
      this._host.game.village.promoteKittens();
      return;
    }
  }

  autoPromoteLeader(): void {
    // If we have Civil Service unlocked and a leader elected.
    if (
      this._host.game.science.get("civil").researched &&
      this._host.game.village.leader !== null
    ) {
      const leader = this._host.game.village.leader;
      const rank = leader.rank;
      const gold = this._workshopManager.getResource("gold");
      const goldStock = this._workshopManager.getStock("gold");

      // this._host.game.village.sim.goldToPromote will check gold
      // this._host.game.village.sim.promote check both gold and exp
      if (
        this._host.game.village.sim.goldToPromote(rank, rank + 1, gold.value - goldStock)[0] &&
        this._host.game.village.sim.promote(leader, rank + 1) === 1
      ) {
        this._host.engine.iactivity("act.promote", [rank + 1], "ks-promote");
        this._host.game.villageTab.censusPanel?.census.renderGovernment(
          this._host.game.villageTab.censusPanel.census.container,
        );
        this._host.game.villageTab.censusPanel?.census.update();
        this._host.engine.storeForSummary("promote", 1);
      }
    }
  }

  autoHunt(cacheManager?: MaterialsCache) {
    const manpower = this._workshopManager.getResource("manpower");
    const trigger = this.settings.hunt.trigger;

    if (manpower.value < 100 || this._host.game.challenges.isActive("pacifism")) {
      return;
    }

    if (trigger <= manpower.value / manpower.maxValue && 100 <= manpower.value) {
      // Determine how many hunts are being performed.
      const huntCount = Math.floor(manpower.value / 100);
      this._host.engine.storeForSummary("hunt", huntCount);
      this._host.engine.iactivity("act.hunt", [this._host.renderAbsolute(huntCount)], "ks-hunt");

      const averageOutput = this._workshopManager.getAverageHunt();
      const trueOutput: Partial<Record<Resource, number>> = {};

      for (const [out, outValue] of objectEntries(averageOutput)) {
        const res = this._workshopManager.getResource(out);
        trueOutput[out] =
          // If this is a capped resource...
          0 < res.maxValue
            ? // multiply the amount of times we hunted with the result of an average hunt.
              // Capping at the max value and 0 bounds.
              Math.min(outValue * huntCount, Math.max(res.maxValue - res.value, 0))
            : // Otherwise, just multiply unbounded
              outValue * huntCount;
      }

      // Store the hunted resources in the cache. Why? No idea.
      if (!isNil(cacheManager)) {
        cacheManager.pushToCache({
          materials: trueOutput,
          timeStamp: this._host.game.timer.ticksTotal,
        });
      }

      // Now actually perform the hunts.
      this._host.game.village.huntAll();
    }
  }

  autoFestival(cacheManager?: MaterialsCache) {
    // If we haven't researched festivals yet, or still have more than 400 days left on one,
    // don't hold (another) one.
    if (
      !this._host.game.science.get("drama").researched ||
      400 < this._host.game.calendar.festivalDays
    ) {
      return;
    }

    // If we don't have stacked festivals researched yet, and we still have days left on one,
    // don't hold one.
    if (
      !this._host.game.prestige.getPerk("carnivals").researched &&
      0 < this._host.game.calendar.festivalDays
    ) {
      return;
    }

    // Check if we can afford a festival.
    const craftManager = this._workshopManager;
    if (
      craftManager.getValueAvailable("manpower") < 1500 ||
      craftManager.getValueAvailable("culture") < 5000 ||
      craftManager.getValueAvailable("parchment") < 2500
    ) {
      return;
    }

    // Check if the festival would even be profitable for any resource production.
    const catpowProfitable =
      4000 *
        (craftManager.getTickVal(
          craftManager.getResource("manpower"),
          cacheManager,
          true,
        ) as number) >
      1500;
    const cultureProfitable =
      4000 *
        (craftManager.getTickVal(
          craftManager.getResource("culture"),
          cacheManager,
          true,
        ) as number) >
      5000;
    const parchProfitable =
      4000 *
        (craftManager.getTickVal(
          craftManager.getResource("parchment"),
          cacheManager,
          true,
        ) as number) >
      2500;

    if (!catpowProfitable && !cultureProfitable && !parchProfitable) {
      return;
    }

    const beforeDays = this._host.game.calendar.festivalDays;
    const controller = new classes.village.ui.FestivalButtonController(this._host.game);
    const model = controller.fetchModel({
      controller,
      description: "",
      handler: () => {
        this._host.game.village.holdFestival(1);
      },
      name: "",
      prices: [
        { name: "manpower" as const, val: 1500 },
        { name: "culture" as const, val: 5000 },
        { name: "parchment" as const, val: 2500 },
      ],
    });
    controller.buyItem(model);
    this._host.engine.storeForSummary("festival");
    if (beforeDays > 0) {
      this._host.engine.iactivity("festival.extend", [], "ks-festival");
    } else {
      this._host.engine.iactivity("festival.hold", [], "ks-festival");
    }
  }
}
