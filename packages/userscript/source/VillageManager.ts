import { Automation, TickContext } from "./Engine";
import { MaterialsCache } from "./helper/MaterialsCache";
import { VillageSettings } from "./settings/VillageSettings";
import { TabManager } from "./TabManager";
import { objectEntries } from "./tools/Entries";
import { cdebug } from "./tools/Log";
import { isNil, mustExist } from "./tools/Maybe";
import { Resource } from "./types";
import { JobInfo, VillageTab } from "./types/village";
import { UserScript } from "./UserScript";
import { WorkshopManager } from "./WorkshopManager";

export class VillageManager implements Automation {
  private readonly _host: UserScript;
  settings: VillageSettings;
  readonly manager: TabManager<VillageTab>;
  private readonly _cacheManager: MaterialsCache;
  private readonly _workshopManager: WorkshopManager;

  constructor(
    host: UserScript,
    workshopManager: WorkshopManager,
    settings = new VillageSettings()
  ) {
    this._host = host;
    this.settings = settings;
    this.manager = new TabManager(this._host, "Village");
    this._cacheManager = new MaterialsCache(this._host);
    this._workshopManager = workshopManager;
  }

  tick(context: TickContext) {
    if (!this.settings.enabled) {
      return;
    }

    this.autoDistributeKittens();

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

  load(settings: VillageSettings) {
    this.settings.load(settings);
  }

  autoDistributeKittens() {
    const freeKittens = this._host.gamePage.village.getFreeKittens();
    if (!freeKittens) {
      return;
    }

    // Find all jobs where we haven't assigned the maximum desired kittens yet.
    const jobsNotCapped = new Array<{ job: JobInfo; count: number; toCap: number }>();
    for (const job of this._host.gamePage.village.jobs) {
      // Skip disabled jobs and those that haven't been unlocked;
      const enabled = this.settings.jobs[job.name].enabled;
      const unlocked = job.unlocked;
      if (!enabled || !unlocked) {
        continue;
      }

      const maxKittensInJob = this._host.gamePage.village.getJobLimit(job.name);
      const maxKittensToAssign =
        this.settings.jobs[job.name].max === -1
          ? Number.POSITIVE_INFINITY
          : this.settings.jobs[job.name].max;
      const kittensInJob = job.value;
      if (kittensInJob < maxKittensInJob && kittensInJob < maxKittensToAssign) {
        jobsNotCapped.push({ job, count: kittensInJob, toCap: maxKittensInJob - kittensInJob });
      }
    }

    if (!jobsNotCapped.length) {
      return;
    }

    // Find the job with the least kittens assigned and assign a kitten to that job.
    jobsNotCapped.sort((a, b) => a.count - b.count);
    const jobName = jobsNotCapped[0].job.name;

    this._host.gamePage.village.assignJob(this._host.gamePage.village.getJob(jobName), 1);
    this.manager.render();
    this._host.engine.iactivity(
      "act.distribute",
      [this._host.engine.i18n(`$village.job.${jobName}` as const)],
      "ks-distribute"
    );
    this._host.engine.storeForSummary("distribute", 1);
  }

  autoElect(): void {
    const kittens = this._host.gamePage.village.sim.kittens;
    const leader = this._host.gamePage.village.leader;
    const job = this.settings.electLeader.job.selected;
    const trait = this.settings.electLeader.trait.selected;

    const leaderCandidates = kittens.filter(
      kitten => kitten.job === job && kitten.trait.name === trait
    );
    cdebug(`Found '${leaderCandidates.length}' possible leader candidates.`);

    if (leaderCandidates.length === 0) {
      return;
    }

    leaderCandidates.sort((a, b) => b.rank - a.rank);
    const bestLeader = leaderCandidates[0];
    cdebug(
      `Best leader candidate (${bestLeader.name} ${bestLeader.surname}) has rank '${bestLeader.rank}'.`
    );
    if (!isNil(leader)) {
      cdebug(`Current leader (${leader.name} ${leader.surname}) has rank '${leader.rank}'.`);

      if (leader.trait.name === trait && leader.job === job && bestLeader.rank <= leader.rank) {
        cdebug("Current leader is already ideal. No changes are made.");
        return;
      }
    }

    this._host.gamePage.villageTab.censusPanel.census.makeLeader(bestLeader);
    this._host.engine.iactivity("act.elect");
  }

  autoPromoteKittens(): void {
    const gold = this._workshopManager.getResource("gold");
    if (this.settings.promoteKittens.trigger < gold.value / gold.maxValue) {
      return;
    }

    for (
      let kittenIndex = 0;
      kittenIndex < this._host.gamePage.village.sim.kittens.length;
      kittenIndex++
    ) {
      let tier = -1;
      const engineerSpeciality =
        this._host.gamePage.village.sim.kittens[kittenIndex].engineerSpeciality;
      // If this kitten has no engineer speciality, skip it.
      if (isNil(engineerSpeciality)) {
        continue;
      }

      // Check which rank would be ideal for their craft.
      tier = mustExist(this._host.gamePage.workshop.getCraft(engineerSpeciality)).tier;
      // If the rank has already been reached, check next kitten.
      if (tier <= this._host.gamePage.village.sim.kittens[kittenIndex].rank) {
        continue;
      }

      // We have found an engineer that isn't at their ideal rank.
      // No need to look further.
      this._host.gamePage.village.promoteKittens();
      return;
    }
  }

  autoPromoteLeader(): void {
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
        this._host.engine.iactivity("act.promote", [rank + 1], "ks-promote");
        this._host.gamePage.tabs[1].censusPanel.census.renderGovernment(
          this._host.gamePage.tabs[1].censusPanel.census
        );
        this._host.gamePage.tabs[1].censusPanel.census.update();
        this._host.engine.storeForSummary("promote", 1);
      }
    }
  }

  autoHunt(cacheManager?: MaterialsCache) {
    const manpower = this._workshopManager.getResource("manpower");
    const trigger = this.settings.hunt.trigger ?? 0;

    if (manpower.value < 100 || this._host.gamePage.challenges.isActive("pacifism")) {
      return;
    }

    if (trigger <= manpower.value / manpower.maxValue && 100 <= manpower.value) {
      // Determine how many hunts are being performed.
      let huntCount = Math.floor(manpower.value / 100);
      this._host.engine.storeForSummary("hunt", huntCount);
      this._host.engine.iactivity("act.hunt", [huntCount], "ks-hunt");

      huntCount = Math.floor(manpower.value / 100);
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
          timeStamp: this._host.gamePage.timer.ticksTotal,
        });
      }

      // Now actually perform the hunts.
      this._host.gamePage.village.huntAll();
    }
  }

  autoFestival(cacheManager?: MaterialsCache) {
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
      this._host.engine.storeForSummary("festival");
      if (beforeDays > 0) {
        this._host.engine.iactivity("festival.extend", [], "ks-festival");
      } else {
        this._host.engine.iactivity("festival.hold", [], "ks-festival");
      }
    }
  }
}
