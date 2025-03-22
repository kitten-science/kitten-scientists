import type { AnyFunction } from "@oliversalzburg/js-utils/core.js";
import type { BuildingsManager, BuildingsModern } from "./buildings.js";
import type { Calendar } from "./calendar.js";
import type { ChallengesManager } from "./challenges.js";
import type { Tab } from "./core.js";
import type { Diplomacy, DiplomacyManager } from "./diplomacy.js";
import type {
  AllBuildings,
  BuildingEffect,
  Kitten,
  Price,
  Resource,
  ResourceCraftable,
  TabId,
} from "./index.js";
import type { PrestigeManager } from "./prestige.js";
import type { ReligionManager, ReligionTab } from "./religion.js";
import type { UnsafeResource } from "./resources.js";
import type { ScienceManager, UnsafePolicy, UnsafeTech } from "./science.js";
import type { SpaceTab, UnsafePlanet } from "./space.js";
import type {
  ChronoForgeUpgrade,
  ChronoForgeUpgradeInfo,
  TimeTab,
  VoidSpaceUpgrade,
  VoidSpaceUpgradeInfo,
} from "./time.js";
import type { JobInfo, VillageTab } from "./village.js";

type Server = {
  showMotd: boolean;
  motdTitle: string | null;
  motdContent: string | null;

  game: Game | null;
  motdContentPrevious: string | null;
  motdFreshMessage: string | null;

  userProfile: unknown;
  chiral: null;

  lastBackup: null;
  saveData: null;

  setUserProfile: (userProfile: unknown) => void;
  getServerUrl: () => string;
  refresh: () => void;
  _xhr: (url: string, method: string, data: unknown, handler: AnyFunction) => Promise<unknown>;
  syncUserProfile: () => void;
  syncSaveData: () => Promise<unknown>;
  pushSave: () => void;
  pushSaveMetadata: (guid: string, metadata: unknown) => Promise<unknown>;
  loadSave: (guid: string) => void;
  save: (saveData: unknown) => void;
  sendCommand: (command: unknown) => void;
  setChiral: (data: unknown) => void;
};

export type CycleEffects = {
  "cryostation-coalMax": number;
  "cryostation-ironMax": number;
  "cryostation-mineralsMax": number;
  "cryostation-oilMax": number;
  "cryostation-titaniumMax": number;
  "cryostation-unobtainiumMax": number;
  "cryostation-uraniumMax": number;
  "cryostation-woodMax": number;
  "entangler-gflopsConsumption": number;
  "hrHarvester-energyProduction": number;
  "hydrofracturer-oilPerTickAutoprodSpace": number;
  "hydroponics-catnipRatio": number;
  "moonOutpost-unobtainiumPerTickSpace": number;
  "planetCracker-uraniumPerTickSpace": number;
  "researchVessel-starchartPerTickBaseSpace": number;
  "sattelite-observatoryRatio": number;
  "sattelite-starchartPerTickBaseSpace": number;
  "spaceBeacon-starchartPerTickBaseSpace": number;
  "spaceElevator-prodTransferBonus": number;
  "spaceStation-scienceRatio": number;
  "sunlifter-energyProduction": number;
};

export type FestivalEffects = {
  catnip: number;
  coal: number;
  culture: number;
  faith: number;
  gold: number;
  iron: number;
  manpower: number;
  minerals: number;
  oil: number;
  science: number;
  starchart: number;
  titanium: number;
  unicorns: number;
  unobtainium: number;
  uranium: number;
  wood: number;
};

export type Game = {
  bld: BuildingsManager;
  calendar: Calendar;
  challenges: ChallengesManager;
  compressLZData: (data: string) => string;
  console: {
    filters: Record<string, { enabled: boolean; title: string; unlocked: boolean }>;
    maxMessages: number;
  };
  craft: (name: string, amount: number) => void;
  decompressLZData: (lzData: string) => string;
  devMode: boolean;
  diplomacy: DiplomacyManager;
  diplomacyTab: Diplomacy;
  getCMBRBonus: () => number;
  getDisplayValueExt: (
    value: number,
    prefix?: boolean,
    usePerTickHack?: boolean,
    precision?: number,
    postifx?: string,
  ) => string;
  getEffect: (
    effect:
      | `${AllBuildings}CostReduction`
      | `${Resource}CostReduction`
      | `${AllBuildings}PriceRatio`
      | "catnipDemandWorkerRatioGlobal"
      | "catnipJobRatio"
      | "catnipPerTickBase"
      | "coldHarshness"
      | "corruptionBoostRatio"
      | "dataCenterAIRatio"
      | "heatMax"
      | "heatPerTick"
      | "hunterRatio"
      | "mapPriceReduction"
      | "oilReductionRatio"
      | "priceRatio"
      | "riftChance"
      | "shatterCostIncreaseChallenge"
      | "shatterVoidCost"
      | "solarRevolutionLimit"
      | "standingRatio"
      | "temporalFluxProduction"
      | "temporalParadoxDay"
      | "tradeCatpowerDiscount"
      | "tradeGoldDiscount"
      | "unicornsGlobalRatio"
      | "unicornsPerTickBase"
      | "unicornsRatioReligion"
      | "uplinkDCRatio",
  ) => number;

  /**
   * Calculate limited diminishing returns.
   */
  getLimitedDR: (effect: number, limit: number) => number;

  /**
   * The resource craft ratio indicates how many items you receive
   * as the result of a single craft. This is subject to a variety
   * of bonus effects.
   *
   * @param name The resource to check.
   */
  getResCraftRatio: (name: ResourceCraftable) => number;

  getResourcePerDay: (resName: Resource) => number;
  getResourceOnYearProduction: (resName: Resource) => number;

  /**
   * Determine how much of the given resource is produced per tick.
   *
   * @param resName The resource to check.
   * @param withConversion Should resource convertions be taken into account?
   */
  getResourcePerTick: (resName: Resource, withConversion: boolean) => number;

  /**
   * Determine how much of the resource, per tick, is subject to be converted
   * into another resource. For example, smelters convert wood and minerals.
   *
   * @param resName The resource to check.
   */
  getResourcePerTickConvertion: (resName: Resource) => number;

  /**
   * How many ticks pass per second.
   * Subject to time acceleration.
   */
  getTicksPerSecondUI: () => number;

  /**
   * Calculate unlimited diminishing returns.
   */
  getUnlimitedDR: (value: number, stripe: number) => number;

  /**
   * Are we in iron will mode?
   */
  ironWill: boolean;
  managers: Array<{
    load: (saveData: Record<string, unknown>) => void;
    save: (saveData: Record<string, unknown>) => void;
  }>;
  msg: (...args: Array<number | string>) => { span: HTMLElement };
  opts: {
    disableCMBR: boolean;
    /**
     * Should `confirm()` calls be skipped in the game?
     */
    noConfirm: boolean;
    usePerSecondValues: boolean;
  };
  prestige: PrestigeManager;
  religion: ReligionManager;
  religionTab: ReligionTab;
  resetAutomatic: () => void;
  resPool: {
    get: (name: Resource) => UnsafeResource;
    energyCons: number;
    energyProd: number;
    resources: Array<UnsafeResource>;
    hasRes: (resources: Array<Price>) => boolean;
  };
  /**
   * Saves the game and returns the save game.
   */
  save(): KGSaveData;
  /**
   * Import a savegame blob.
   */
  saveImportDropboxText(lzdata: string, callback: (error?: Error) => unknown): void;
  science: ScienceManager;
  server: Server;
  space: {
    getBuilding: (building: SpaceBuilding) => {
      calculateEffects: (self: unknown, game: Game) => void;
      /**
       * An internationalized description for this space building.
       */
      description: string;

      effects: Partial<Record<BuildingEffect, number>>;

      /**
       * An internationalized label for this space building.
       */
      label: string;
      name: SpaceBuilding;
      priceRatio: number;
      prices: Array<Price>;
      requiredTech: Array<"sattelites">;
      unlocked: boolean;
      unlocks: { policies: Array<"militarizeSpace" | "outerSpaceTreaty"> };
      unlockScheme: {
        name: "space";
        threshold: number;
      };
      upgrades: {
        buildings: Array<"observatory">;
      };
      val: number;
    };
    meta: Array<{
      meta: Array<{
        effects?: Partial<Record<BuildingEffect, number>>;
        label: string;
        name: string;
        on: number;
        prices: Array<Price>;
        unlocked: boolean;
        val: number;
      }>;
    }>;
    planets: Array<UnsafePlanet>;
    programs: Array<{ name: Mission; label: string }>;
  };
  stats: {
    statGroups: Array<{
      title: string;
      group: Array<{
        name:
          | "averageKittens"
          | "buildingsConstructed"
          | "eventsObserved"
          | "kittensDead"
          | "timePlayed"
          | "totalChallengesCompleted"
          | "totalClicks"
          | "totalCrafts"
          | "totalKittens"
          | "totalParagon"
          | "totalResets"
          | "totalTrades"
          | "totalYears"
          | "transcendenceTier"
          | "unicornsSacrificed";
        title: string;
        val: number;
        unlocked: boolean;
        defaultUnlocked: boolean;
      }>;
    }>;
  };
  tabs: [
    BuildingsModern,
    VillageTab,
    Tab,
    Tab,
    Diplomacy,
    ReligionTab,
    SpaceTab,
    TimeTab,
    Tab,
    Tab,
    Tab,
  ];
  telemetry: {
    buildRevision: number;
    guid: string;
    version: string;
  };
  ticksPerSecond: number;
  time: {
    chronoforgeUpgrades: Array<ChronoForgeUpgradeInfo>;
    /**
     * Get ChronoForge upgrade.
     */
    getCFU: (name: ChronoForgeUpgrade) => ChronoForgeUpgradeInfo;
    /**
     * Get Void Space upgrade.
     */
    getVSU: (name: VoidSpaceUpgrade) => VoidSpaceUpgradeInfo;
    heat: number;
    isAccelerated: boolean;
    meta: Array<{
      meta: Array<ChronoForgeUpgradeInfo | VoidSpaceUpgradeInfo>;
      provider: { getEffect: (item: unknown, effect: unknown) => unknown };
    }>;
    voidspaceUpgrades: Array<{
      name: Exclude<VoidSpaceUpgrade, "usedCryochambers">;
      label: string;
    }>;
  };
  timeAccelerationRatio: () => number;
  timer: {
    ticksTotal: number;
  };
  timeTab: TimeTab;
  unlock: (value: unknown) => void;
  upgrade: (value: unknown) => void;
  ui: {
    activeTabId: TabId;
    confirm: (
      title: string,
      message: string,
      callbackOk: () => void,
      callbackCancel: () => void,
    ) => void;
    render: () => void;
  };
  village: {
    assignJob: (job: unknown, count: number) => void;
    getEffectLeader: <TDefaultObject>(
      role: "manager" | "scientist",
      defaultObject: TDefaultObject,
    ) => TDefaultObject;
    getFreeKittens: () => number;
    getJob: (name: string) => unknown;
    getJobLimit: (name: string) => number;
    /**
     * Get a list of resource consumptions per tick
     *
     * @see getResProduction
     */
    getResConsumption: () => { catnip: number };
    /**
     * Get a list of resource modifiers per tick
     * This method returns positive villager production that can be multiplied by building bonuses
     */
    getResProduction: () => { catnip: number };
    happiness: number;
    huntAll: () => void;
    jobs: Array<JobInfo>;
    leader: Kitten | null;
    makeLeader: (kitten: Kitten) => void;
    removeLeader: () => void;
    /**
     * @deprecated
     */
    map: {
      expeditionNode: {
        x: number;
        y: number;
      };
      explore: (x: number, y: number) => void;
      toLevel: (x: number, y: number) => number;
      getExplorationPrice: (x: number, y: number) => number;
      villageData: Record<string, unknown>;
    };
    promoteKittens(): void;
    sim: {
      goldToPromote: (rank: number, value0: number, value1: number) => Array<unknown>;
      kittens: Array<Kitten>;
      promote: (leader: unknown, rank: number) => number;
    };
  };
  villageTab: VillageTab;
  workshop: {
    crafts: Array<CraftableInfo>;
    get: (
      technology: "chronoforge" | "cryocomputing" | "goldOre" | "machineLearning" | "uplink",
    ) => { researched: boolean };
    getCraft: (name: ResourceCraftable) => CraftableInfo | undefined;
    getCraftPrice: (craft: CraftableInfo) => Array<Price>;
    upgrades: Array<UpgradeInfo>;
  };
  workshopTab: WorkshopTab;
};
