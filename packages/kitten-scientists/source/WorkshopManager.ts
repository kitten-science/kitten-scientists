import { isNil, mustExist } from "@oliversalzburg/js-utils/lib/nil.js";
import { Automation, TickContext } from "./Engine.js";
import { TabManager } from "./TabManager.js";
import { UpgradeManager } from "./UpgradeManager.js";
import { UserScript } from "./UserScript.js";
import { MaterialsCache } from "./helper/MaterialsCache.js";
import { CraftSettingsItem, WorkshopSettings } from "./settings/WorkshopSettings.js";
import { objectEntries } from "./tools/Entries.js";
import { cerror } from "./tools/Log.js";
import { CraftableInfo, ResourceInfo } from "./types/craft.js";
import { Resource, ResourceCraftable, UpgradeInfo } from "./types/index.js";
import { VillageTab } from "./types/village.js";

export class WorkshopManager extends UpgradeManager implements Automation {
  readonly settings: WorkshopSettings;
  readonly manager: TabManager<VillageTab>;

  static readonly DEFAULT_CONSUME_RATE = 1;

  constructor(host: UserScript, settings = new WorkshopSettings()) {
    super(host);
    this.settings = settings;
    this.manager = new TabManager(this._host, "Workshop");
  }

  tick(context: TickContext) {
    if (!this.settings.enabled) {
      return;
    }

    this.autoCraft();
    this.refreshStock();

    if (this.settings.unlockUpgrades.enabled) {
      return this.autoUnlock();
    }
  }

  async autoUnlock() {
    if (!this._host.gamePage.tabs[3].visible) {
      return;
    }

    this.manager.render();

    const upgrades = this._host.gamePage.workshop.upgrades;
    const toUnlock = new Array<UpgradeInfo>();

    workLoop: for (const setting of Object.values(this.settings.unlockUpgrades.upgrades)) {
      if (!setting.enabled) {
        continue;
      }

      const upgrade = upgrades.find(subject => subject.name === setting.upgrade);
      if (isNil(upgrade)) {
        cerror(`Upgrade '${setting.upgrade}' not found in game!`);
        continue;
      }

      if (upgrade.researched || !upgrade.unlocked) {
        continue;
      }

      // Create a copy of the prices for this upgrade, so that we can apply effects to it.
      let prices = UserScript.window.dojo.clone(upgrade.prices);
      prices = this._host.gamePage.village.getEffectLeader("scientist", prices);
      for (const resource of prices) {
        // If we can't afford this resource price, continue with the next upgrade.
        if (this.getValueAvailable(resource.name) < resource.val) {
          continue workLoop;
        }
      }

      toUnlock.push(upgrade);
      await this.upgrade(upgrade, "workshop");
    }

    for (const item of toUnlock) {
      await this.upgrade(item, "workshop");
    }
  }

  /**
   * Try to craft as many of the passed resources as possible.
   * Usually, this is called at each iteration of the automation engine to
   * handle the crafting of items on the Workshop tab.
   *
   * @param crafts The resources to build.
   */
  autoCraft(
    crafts: Partial<Record<ResourceCraftable, CraftSettingsItem>> = this.settings.resources,
  ) {
    const craftRequests = new Map<
      CraftSettingsItem,
      {
        countRequested: number;
        materials: Array<{
          resource: Resource;
          consume: number;
        }>;
      }
    >();

    // Find all resources we would want to craft.
    // For crafts that require resources with a capacity, those resources must
    // be at or above the trigger for them to be considered to be crafted.
    for (const craft of Object.values(crafts)) {
      if (!craft.enabled) {
        continue;
      }

      const current = !craft.max ? false : this.getResource(craft.resource);

      const max = craft.max === -1 ? Number.POSITIVE_INFINITY : craft.max;
      if (current && max < current.value) {
        continue;
      }

      // If we can't even craft a single item of the resource, skip it.
      if (!this.singleCraftPossible(craft.resource)) {
        continue;
      }

      const materials = Object.keys(this.getMaterials(craft.resource)) as Array<Resource>;
      // The resource information for the requirement of this craft which have a capacity.
      const requiredMaterials = materials
        .map(material => this.getResource(material))
        .filter(material => 0 < material.maxValue);

      const allMaterialsAboveTrigger =
        requiredMaterials.filter(
          material => material.value / material.maxValue < this.settings.trigger,
        ).length === 0;

      if (!allMaterialsAboveTrigger) {
        continue;
      }

      craftRequests.set(craft, {
        countRequested: 1,
        materials: materials.map(material => ({
          resource: material,
          consume: 0,
        })),
      });
    }

    if (craftRequests.size < 1) {
      return;
    }

    // For all crafts under consideration, find the crafts that share resources in their requirements.
    // We will use this to split crafts evenly among the available stock of that resource.
    const billOfMaterials = new Map<Resource, Array<ResourceCraftable>>();
    for (const [craft, request] of craftRequests) {
      for (const material of request.materials) {
        if (!billOfMaterials.has(material.resource)) {
          billOfMaterials.set(material.resource, new Array<ResourceCraftable>());
        }
        const consumers = mustExist(billOfMaterials.get(material.resource));
        consumers.push(craft.resource);
      }
    }

    // Determine how much of each resource we want to spend on each craft.
    for (const [, request] of craftRequests) {
      for (const material of request.materials) {
        const available = this.getValueAvailable(material.resource);
        material.consume = available / mustExist(billOfMaterials.get(material.resource)).length;
      }
    }

    // Determine how much of each craft we want to perform, given our resource allocations.
    for (const [craft, request] of craftRequests) {
      const materials = this.getMaterials(craft.resource);
      let amount = Number.MAX_VALUE;
      for (const material of request.materials) {
        // How much of the material is needed to craft 1 new resource.
        const materialAmount = mustExist(materials[material.resource]);

        const materialResource = this.getResource(material.resource);
        const materialCraft =
          material.resource in this.settings.resources
            ? this.settings.resources[material.resource as ResourceCraftable]
            : undefined;
        if (
          // For unlimited crafts, assign all resources.
          !craft.limited ||
          // For materials that have a resource cap, also assign all resources.
          // It makes no sense to apply source material balancing here. If we did, we'd stop
          // crafting resources when the source material becomes capped. We would never be able
          // to get enough source stock so the balancing would allow for more crafts.
          0 < materialResource.maxValue ||
          // For materials that are also crafted, if they have already been crafted to their `max`,
          // treat them the same as capped source materials, to avoid the same conflict.
          (!isNil(materialCraft) && -1 < materialCraft.max
            ? materialCraft.max - materialResource.value < 1
            : false) ||
          // Handle the ship override.
          (craft.resource === "ship" &&
            this.settings.shipOverride.enabled &&
            this.getResource("ship").value < 243)
        ) {
          amount = Math.min(amount, material.consume / materialAmount);
          continue;
        }

        const ratio = this._host.gamePage.getResCraftRatio(craft.resource);

        // Quantity of source and target resource currently available.
        const availableSource =
          this.getValueAvailable(material.resource) /
          mustExist(billOfMaterials.get(material.resource)).length;
        const availableTarget = this.getValueAvailable(craft.resource);

        // How much source resource is consumed and target resource is crafted per craft operation.
        const recipeRequires = materialAmount;
        const recipeProduces = 1 + ratio;

        // How many crafts could we do given the amount of source resource available.
        const craftsPossible = availableSource / recipeRequires;

        // How many crafts were hypothetically done to produce the current amount of target resource.
        const craftsDone = availableTarget / recipeProduces;

        // Craft only when the craftsPossible >= craftsDone.
        // Crafting gets progressively more expensive as the amount of the target increases.
        // This heuristic gives other, cheaper, targets a chance to get built from the same source resource.
        // There is no checking if there actually exists a different target that could get built.
        amount = Math.min(amount, craftsPossible - craftsDone, material.consume / materialAmount);
      }
      request.countRequested = Math.max(0, amount);
    }

    for (const [craft, request] of craftRequests) {
      if (request.countRequested < 1) {
        continue;
      }
      this.craft(craft.resource, request.countRequested);
    }
  }

  /**
   * Craft a certain amount of items.
   *
   * @param name The resource to craft.
   * @param amount How many items of the resource to craft.
   */
  craft(name: ResourceCraftable, amount: number): void {
    amount = Math.floor(amount);

    if (!name || amount < 1) {
      return;
    }
    if (!this._canCraft(name, amount)) {
      return;
    }

    const craft = this.getCraft(name);
    const ratio = this._host.gamePage.getResCraftRatio(craft.name);

    this._host.gamePage.craft(craft.name, amount);

    const resourceName = mustExist(this._host.gamePage.resPool.get(name)).title;

    // Determine actual amount after crafting upgrades
    amount = parseFloat((amount * (1 + ratio)).toFixed(2));

    this._host.engine.storeForSummary(resourceName, amount, "craft");
    this._host.engine.iactivity(
      "act.craft",
      [this._host.gamePage.getDisplayValueExt(amount), resourceName],
      "ks-craft",
    );
  }

  private _canCraft(name: ResourceCraftable, amount: number): boolean {
    // Can't craft anything but wood until workshop is unlocked.
    if (!this._host.gamePage.workshopTab.visible && name !== "wood") {
      return false;
    }

    const craft = this.getCraft(name);
    const enabled = mustExist(this.settings.resources[name]).enabled;
    let result = false;

    if (craft.unlocked && enabled) {
      result = true;

      const prices = this._host.gamePage.workshop.getCraftPrice(craft);
      for (const price of prices) {
        const value = this.getValueAvailable(price.name);

        if (value < price.val * amount) {
          result = false;
        }
      }
    }

    return result;
  }

  /**
   * Retrieve the resource information object from the game.
   *
   * @param name The name of the craftable resource.
   * @returns The information object for the resource.
   */
  getCraft(name: ResourceCraftable): CraftableInfo {
    const craft = this._host.gamePage.workshop.getCraft(name);
    if (!craft) {
      throw new Error(`Unable to find craft '${name}'`);
    }
    return craft;
  }

  /**
   * Check if we have enough resources to craft a single craftable resource.
   *
   * @param name The name of the resource.
   * @returns `true` if the build is possible; `false` otherwise.
   */
  singleCraftPossible(name: ResourceCraftable): boolean {
    // Can't craft anything but wood until workshop is unlocked.
    if (!this._host.gamePage.workshopTab.visible && name !== "wood") {
      return false;
    }

    const materials = this.getMaterials(name);
    for (const [material, amount] of objectEntries(materials)) {
      if (this.getValueAvailable(material) < amount) {
        return false;
      }
    }
    return true;
  }

  /**
   * Returns a hash of the required source resources and their
   * amount to craft the given resource.
   *
   * @param name The resource to craft.
   * @returns The source resources you need and how many.
   */
  getMaterials(name: ResourceCraftable): Partial<Record<Resource, number>> {
    const materials: Partial<Record<Resource, number>> = {};
    const craft = this.getCraft(name);

    const prices = this._host.gamePage.workshop.getCraftPrice(craft);

    for (const price of prices) {
      materials[price.name] = price.val;
    }

    return materials;
  }

  /**
   * Determine how much of a resource is produced per tick. For craftable resources,
   * this also includes how many of them we *could* craft this tick.
   *
   * @param resource The resource to retrieve the production for.
   * @param cacheManager A `CacheManager` to use in the process.
   * @param preTrade ?
   * @returns The amount of resources produced per tick, adjusted arbitrarily.
   */
  getTickVal(
    resource: ResourceInfo,
    cacheManager?: MaterialsCache,
    preTrade: boolean | undefined = undefined,
  ): number | "ignore" {
    let production = this._host.gamePage.getResourcePerTick(resource.name, true);

    // For craftable resources, we also want to take into account how much of them
    // we *could* craft.
    if (resource.craftable) {
      let minProd = Number.MAX_VALUE;
      const materials = this.getMaterials(resource.name as ResourceCraftable);
      for (const [mat, amount] of objectEntries<Resource, number>(materials)) {
        const rat =
          (1 + this._host.gamePage.getResCraftRatio(resource.name as ResourceCraftable)) / amount;
        // Currently preTrade is only true for the festival stuff, so including furs from hunting is ideal.
        const addProd = this.getTickVal(this.getResource(mat));
        if (addProd === "ignore") {
          continue;
        }
        minProd = Math.min(addProd * rat, minProd);
      }
      production += minProd !== Number.MAX_VALUE ? minProd : 0;
    }

    // If we have negative production (or none), and we're looking at either spice or
    // blueprints, return "ignore".
    // TODO: This special case seems to revolve around trading. As trading results in
    //       spice and blueprints.
    if (production <= 0 && (resource.name === "spice" || resource.name === "blueprint")) {
      return "ignore";
    }

    // If "preTrade" was set, increase the production. The "resValue" stored in the cache
    // makes no sense.
    // TODO: The only time this is used is for holding festivals.
    //       It's unclear why this would be necessary.
    if (!preTrade && !isNil(cacheManager)) {
      production += cacheManager.getResValue(resource.name);
    }
    return production;
  }

  /**
   * Determine the resources and their amount that would usually result from a hunt.
   *
   * @returns The amounts of resources usually gained from hunting.
   */
  getAverageHunt(): Partial<Record<Resource, number>> {
    const output: Partial<Record<Resource, number>> = {};
    const hunterRatio =
      this._host.gamePage.getEffect("hunterRatio") +
      this._host.gamePage.village.getEffectLeader("manager", 0);

    output["furs"] = 40 + 32.5 * hunterRatio;

    output["ivory"] =
      50 * Math.min(0.225 + 0.01 * hunterRatio, 0.5) +
      40 * hunterRatio * Math.min(0.225 + 0.01 * hunterRatio, 0.5);

    output["unicorns"] = 0.05;

    if (this.getValue("zebras") >= 10) {
      output["bloodstone"] = this.getValue("bloodstone") === 0 ? 0.05 : 0.0005;
    }

    if (this._host.gamePage.ironWill && this._host.gamePage.workshop.get("goldOre").researched) {
      output["gold"] = 0.625 + 0.625 * hunterRatio;
    }

    return output;
  }

  /**
   * Retrieve the information object for a resource.
   *
   * @param name The resource to retrieve info for.
   * @returns The information object for the resource.
   */
  getResource(name: Resource): ResourceInfo {
    const res = this._host.gamePage.resPool.get(name);
    if (isNil(res)) {
      throw new Error(`Unable to find resource ${name}`);
    }
    return res;
  }

  /**
   * Determine how many items of a resource are currently available.
   *
   * @param name The resource.
   * @returns How many items are currently available.
   */
  getValue(name: Resource): number {
    return this.getResource(name).value;
  }

  /**
   * Determine how many items of the resource to always keep in stock.
   *
   * @param name The resource.
   * @returns How many items of the resource to always keep in stock.
   */
  getStock(name: Resource): number {
    const res = this._host.engine.settings.resources.resources[name];
    const stock = res && res.enabled ? res.stock : 0;

    return !stock ? 0 : stock;
  }

  /**
   * Determine how much of a resource is available for a certain operation
   * to use.
   *
   * @param name The resource to check.
   * @returns The available amount of the resource.
   */
  getValueAvailable(name: Resource): number {
    // How many items to keep in stock.
    let stock = this.getStock(name);

    // If the resource is catnip, ensure to not use so much that we can't satisfy
    // consumption by kittens.
    if ("catnip" === name) {
      const pastureMeta = this._host.gamePage.bld.getBuildingExt("pasture").meta;
      const aqueductMeta = this._host.gamePage.bld.getBuildingExt("aqueduct").meta;
      const pastures = pastureMeta.stage === 0 ? pastureMeta.val : 0;
      const aqueducts = aqueductMeta.stage === 0 ? aqueductMeta.val : 0;
      // How many catnip per tick do we have available? This can be negative.
      const resPerTick = this.getPotentialCatnip(true, pastures, aqueducts);

      // If our stock is currently decreasing. Ensure we work with the value
      // where it should be in 5 ticks.
      // TODO: I'm assuming 202 is the catnip consumption per tick and the 5 are a
      //       magic value that just made sense, or the script assumes it runs every
      //       5 ticks. Which would mean it probably ignores the `interval` setting.
      if (resPerTick < 0) {
        stock -= resPerTick * 202 * 5;
      }
    }

    // How many items are currently available.
    let value = this.getValue(name);
    // Subtract the amount to keep in stock.
    value = Math.max(value - stock, 0);

    // Determine the consume rate.
    // If the consume rate is 0.6, we'll always only make 60% of the resource available.
    const resourceSettings = this._host.engine.settings.resources.resources[name];
    const consume = resourceSettings.consume;

    return value * consume;
  }

  /**
   * Determine how much catnip we have available to "work with" per tick.
   *
   * @param worstWeather Should the worst weather be assumed for this calculation?
   * @param pastures How many pastures to take into account.
   * @param aqueducts How many aqueducts to take into account
   * @returns The potential catnip per tick.
   */
  getPotentialCatnip(worstWeather: boolean, pastures: number, aqueducts: number): number {
    // Start of by checking how much catnip we produce per tick at base level.
    let productionField = this._host.gamePage.getEffect("catnipPerTickBase");

    if (worstWeather) {
      // Assume fields run at -90%
      productionField *= 0.1;
      // Factor in cold harshness.
      productionField *=
        1 + this._host.gamePage.getLimitedDR(this._host.gamePage.getEffect("coldHarshness"), 1);
    } else {
      productionField *=
        this._host.gamePage.calendar.getWeatherMod({ name: "catnip" }) +
        this._host.gamePage.calendar.getCurSeason().modifiers["catnip"];
    }

    // When the communism policy is active,
    if (this._host.gamePage.science.getPolicy("communism").researched) {
      productionField = 0;
    }

    // Get base production values for jobs.
    const resourceProduction = this._host.gamePage.village.getResProduction();
    // Check how much catnip we're producing through kitten jobs.
    const productionVillager = resourceProduction.catnip
      ? resourceProduction.catnip * (1 + this._host.gamePage.getEffect("catnipJobRatio"))
      : 0;

    // Base production is catnip fields + farmers.
    let baseProd = productionField + productionVillager;

    // Determine the effect of other buildings on the production value.
    let hydroponics = this._host.gamePage.space.getBuilding("hydroponics").val;
    // Index 21 is the "pawgan rituals" metaphysics upgrade. This makes no sense.
    // This likely wants index 22, which is "numeromancy", which has effects on
    // catnip production in cycles at index 2 and 7.
    // TODO: Fix this so the upgrade is properly taken into account.
    if (this._host.gamePage.prestige.meta[0].meta[21].researched) {
      if (this._host.gamePage.calendar.cycle === 2) {
        hydroponics *= 2;
      }
      if (this._host.gamePage.calendar.cycle === 7) {
        hydroponics *= 0.5;
      }
    }

    // Our base production value is boosted by our aqueducts and hydroponics accordingly.
    baseProd *= 1 + 0.03 * aqueducts + 0.025 * hydroponics;

    // Apply paragon bonus, except during the "winter is coming" challenge.
    const isWinterComing = this._host.gamePage.challenges.currentChallenge === "winterIsComing";
    const paragonBonus = isWinterComing
      ? 0
      : this._host.gamePage.prestige.getParagonProductionRatio();
    baseProd *= 1 + paragonBonus;

    // Apply faith bonus.
    baseProd *= 1 + this._host.gamePage.religion.getSolarRevolutionRatio();

    // Unless the user disabled the "global donate bonus", apply it.
    if (!this._host.gamePage.opts.disableCMBR) {
      baseProd *= 1 + this._host.gamePage.getCMBRBonus();
    }

    // Apply the effects of possibly running festival.
    baseProd = this._host.gamePage.calendar.cycleEffectsFestival({ catnip: baseProd })["catnip"];

    // Determine our demand for catnip. This is usually a negative value.
    let baseDemand = this._host.gamePage.village.getResConsumption()["catnip"];
    // Pastures and unicron pastures reduce catnip demand. Factor that in.
    const unicornPastures = this._host.gamePage.bld.getBuildingExt("unicornPasture").meta.val;
    baseDemand *=
      1 + this._host.gamePage.getLimitedDR(pastures * -0.005 + unicornPastures * -0.0015, 1.0);

    // If we have any kittens and happiness over 100%.
    if (
      this._host.gamePage.village.sim.kittens.length > 0 &&
      this._host.gamePage.village.happiness > 1
    ) {
      // How happy beyond 100% are we?
      const happyCon = this._host.gamePage.village.happiness - 1;
      const catnipDemandWorkerRatioGlobal = this._host.gamePage.getEffect(
        "catnipDemandWorkerRatioGlobal",
      );

      // Determine the effect of kittens without jobs.
      if (this._host.gamePage.challenges.currentChallenge === "anarchy") {
        // During anarchy, they have no effect. They eat all the catnip.
        baseDemand *= 1 + happyCon * (1 + catnipDemandWorkerRatioGlobal);
      } else {
        // During normal operation, reduce the demand proportionally.
        // TODO: This should probably be split up into 2 steps.
        baseDemand *=
          1 +
          happyCon *
            (1 + catnipDemandWorkerRatioGlobal) *
            (1 -
              this._host.gamePage.village.getFreeKittens() /
                this._host.gamePage.village.sim.kittens.length);
      }
    }

    // Subtract the demand from the production. Demand is negative.
    baseProd += baseDemand;

    // Subtract possible catnip consumers, like breweries.
    baseProd += this._host.gamePage.getResourcePerTickConvertion("catnip");

    // Might need to eventually factor in time acceleration using this._host.gamePage.timeAccelerationRatio().
    return baseProd;
  }

  /**
   * Maintains the CSS classes in the resource indicators in the game UI to
   * reflect if the amount of resource in stock is below or above the desired
   * total amount to keep in stock.
   * The user can configure this in the Workshop automation section.
   */
  refreshStock() {
    for (const [name, resource] of objectEntries(this._host.engine.settings.resources.resources)) {
      if (resource.stock === 0) {
        continue;
      }

      const isBelow = this._host.gamePage.resPool.get(name).value < resource.stock;

      const resourceCells = [
        // Resource table on the top.
        ...$(`#game .res-row.resource_${name} .res-cell.resAmount`),
        // Craft table on the bottom.
        ...$(`#game .res-row.resource_${name} .res-cell.resource-value`),
      ];

      if (!resourceCells) {
        continue;
      }

      for (const resourceCell of resourceCells) {
        resourceCell.classList.add(isBelow ? "ks-stock-below" : "ks-stock-above");
        resourceCell.classList.remove(isBelow ? "ks-stock-above" : "ks-stock-below");
      }
    }
  }
}
