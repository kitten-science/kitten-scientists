import { BonfireManager } from "./BonfireManager";
import { BulkManager } from "./BulkManager";
import { FaithItem, ReligionSettingsItem } from "./options/ReligionSettings";
import { TabManager } from "./TabManager";
import { objectEntries } from "./tools/Entries";
import { mustExist } from "./tools/Maybe";
import {
  BuildButton,
  ReligionTab,
  ReligionUpgradeInfo,
  ReligionUpgrades,
  TranscendenceUpgradeInfo,
  TranscendenceUpgrades,
  UnicornItemVariant,
  ZiggurathUpgradeInfo,
  ZiggurathUpgrades,
} from "./types";
import { UserScript } from "./UserScript";
import { WorkshopManager } from "./WorkshopManager";

export class ReligionManager {
  private readonly _host: UserScript;
  readonly manager: TabManager<ReligionTab>;
  private readonly _bulkManager: BulkManager;
  private readonly _bonfireManager: BonfireManager;
  private readonly _workshopManager: WorkshopManager;

  constructor(host: UserScript) {
    this._host = host;
    this.manager = new TabManager(this._host, "Religion");
    this._workshopManager = new WorkshopManager(this._host);
    this._bulkManager = new BulkManager(this._host);
    this._bonfireManager = new BonfireManager(this._host);
  }

  autoWorship() {
    const additions = this._host.options.auto.religion.addition;

    const IS_BUILD_BEST_BUILDING_STILL_BROKEN = true;

    // Build the best unicorn building if the option is enabled.
    // TODO: This is stupid, as it *only* builds unicorn buildings, instead of all
    //       religion buildings.
    if (!IS_BUILD_BEST_BUILDING_STILL_BROKEN && additions.bestUnicornBuilding.enabled) {
      const bestUnicornBuilding = this._getBestUnicornBuilding();
      if (bestUnicornBuilding !== null) {
        if (bestUnicornBuilding === "unicornPasture") {
          this._bonfireManager.build(bestUnicornBuilding, 0, 1);
        } else {
          const buildingButton = mustExist(
            this.getBuildButton(bestUnicornBuilding, UnicornItemVariant.Ziggurat)
          );
          let tearsNeeded = 0;
          // TODO: A simple `.find()` makes more sense here.
          for (const price of buildingButton.model.prices) {
            if (price.name === "tears") {
              tearsNeeded = price.val;
            }
          }

          const tearsAvailableForUse =
            this._workshopManager.getValue("tears") - this._workshopManager.getStock("tears");

          if (tearsAvailableForUse < tearsNeeded) {
            // if no ziggurat, getBestUnicornBuilding will return unicornPasture
            // TODO: ☝ Yeah. So?

            // How many times can we sacrifice unicorns to make tears?
            const maxSacrifice = Math.floor(
              (this._workshopManager.getValue("unicorns") -
                this._workshopManager.getStock("unicorns")) /
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
          this.build(bestUnicornBuilding, UnicornItemVariant.Ziggurat, 1);
        }
      }
    } else {
      // TODO: It's not clear why this process is split into two steps.

      // Create the list of builds, excluding the unicorn pasture.
      // Also reverse the build order, so that the best unicorn building is
      // always build preferably.
      // TODO: The "build best unicorn building first" feature might be redundant.
      const builds = Object.fromEntries(
        Object.entries(this._host.options.auto.religion.items)
          .filter(([k, v]) => v.variant !== UnicornItemVariant.UnicornPasture)
          .reverse()
      );
      // Now we build a unicorn pasture if possible.
      if (this._host.options.auto.religion.items.unicornPasture.enabled) {
        this._bonfireManager.autoBuild({
          unicornPasture: { require: false, enabled: true, max: -1 },
        });
      }
      // And then we build all other possible religion buildings.
      this._buildReligionBuildings(builds);
    }

    const faith = this._workshopManager.getResource("faith");
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
    this.manager.render();

    const metaData: Partial<
      Record<FaithItem, ReligionUpgradeInfo | TranscendenceUpgradeInfo | ZiggurathUpgradeInfo>
    > = {};
    for (const [name, build] of objectEntries<FaithItem, ReligionSettingsItem>(builds)) {
      const buildInfo = this.getBuild(name, build.variant);
      if (buildInfo === null) {
        continue;
      }
      metaData[name] = buildInfo;
      const buildMetaData = mustExist(metaData[name]);

      // If an item is marked as `rHidden`, it wouldn't be build.
      // TODO: Why not remove it from the `builds` then?
      if (!this.getBuildButton(name, build.variant)) {
        buildMetaData.rHidden = true;
      } else {
        const model = mustExist(this.getBuildButton(name, build.variant)).model;
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
    for (const build of buildList) {
      if (0 < build.count) {
        this.build(
          build.id as ReligionUpgrades | TranscendenceUpgrades | ZiggurathUpgrades,
          mustExist(build.variant) as UnicornItemVariant,
          build.count
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
   * Determine the best unicorn-related building to buy next.
   * This is the building where the cost is in the best proportion to the
   * unicorn production bonus it generates.
   *
   * @see https://github.com/Bioniclegenius/NummonCalc/blob/112f716e2fde9956dfe520021b0400cba7b7113e/NummonCalc.js#L490
   * @returns The best unicorn building.
   */
  private _getBestUnicornBuilding(): ZiggurathUpgrades | null {
    const pastureButton = this._bonfireManager.getBuildButton("unicornPasture");
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
    for (const button of this.manager.tab.zgUpgradeButtons) {
      // ...that are in the "valid" buildings (are unicorn-related) and visible (unlocked)...
      if (validBuildings.includes(button.id) && button.model.visible) {
        // Determine a price value for this building.
        let unicornPrice = 0;
        for (const price of button.model.prices) {
          // Add the amount of unicorns the building costs (if any).
          if (price.name === "unicorns") {
            unicornPrice += price.val;
          }
          // Tears result from unicorn sacrifices, so factor that into the price proportionally.
          if (price.name === "tears") {
            unicornPrice += (price.val * 2500) / ziggurathRatio;
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

  build(
    name: ReligionUpgrades | TranscendenceUpgrades | ZiggurathUpgrades,
    variant: UnicornItemVariant,
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

    if (variant === UnicornItemVariant.OrderOfTheSun) {
      this._host.storeForSummary(label, amount, "faith");
      if (amount === 1) {
        this._host.iactivity("act.sun.discover", [label], "ks-faith");
      } else {
        this._host.iactivity("act.sun.discovers", [label, amount], "ks-faith");
      }
    } else {
      this._host.storeForSummary(label, amount, "build");
      if (amount === 1) {
        this._host.iactivity("act.build", [label], "ks-build");
      } else {
        this._host.iactivity("act.builds", [label, amount], "ks-build");
      }
    }
  }

  /**
   * Retrieve information about an upgrade.
   *
   * @param name The name of the upgrade.
   * @param variant The variant of the upgrade.
   * @returns The build information for the upgrade.
   */
  getBuild(
    name: ReligionUpgrades | TranscendenceUpgrades | ZiggurathUpgrades,
    variant: UnicornItemVariant
  ): ReligionUpgradeInfo | TranscendenceUpgradeInfo | ZiggurathUpgradeInfo | null {
    switch (variant) {
      case UnicornItemVariant.Ziggurat:
        return this._host.gamePage.religion.getZU(name as ZiggurathUpgrades) ?? null;
      case UnicornItemVariant.OrderOfTheSun:
        return this._host.gamePage.religion.getRU(name as ReligionUpgrades) ?? null;
      case UnicornItemVariant.Cryptotheology:
        return this._host.gamePage.religion.getTU(name as TranscendenceUpgrades) ?? null;
    }
    return null;
  }

  /**
   * Find the button that allows purchasing a given upgrade.
   *
   * @param name The name of the upgrade.
   * @param variant The variant of the upgrade.
   * @returns The button to buy the upgrade, or `null`.
   */
  getBuildButton(
    name: ReligionUpgrades | TranscendenceUpgrades | ZiggurathUpgrades,
    variant: UnicornItemVariant
  ): BuildButton | null {
    let buttons: Array<BuildButton>;
    switch (variant) {
      case UnicornItemVariant.Ziggurat:
        buttons = this.manager.tab.zgUpgradeButtons;
        break;
      case UnicornItemVariant.OrderOfTheSun:
        buttons = this.manager.tab.rUpgradeButtons;
        break;
      case UnicornItemVariant.Cryptotheology:
        buttons = this.manager.tab.children[0].children[0].children;
        break;
      default:
        throw new Error(`Invalid variant '${variant}'`);
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
