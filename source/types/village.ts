import type { AnyFunction } from "@oliversalzburg/js-utils/core.js";
import type {
  BuildingStackableBtnController,
  ButtonModern,
  ButtonModernController,
  IChildrenAware,
  IGameAware,
  Panel,
  Tab,
  TabManager,
  UnsafeButtonModernModel,
  UnsafeButtonModernModelDefaults,
} from "./core.js";
import type { GamePage } from "./game.js";
import type { Biome, Job, Link, Price, Resource, ResourceCraftable, Trait } from "./index.js";

export type VillageManager = TabManager & {
  kittens: number;
  maxKittens: number;
  kittensPerTickBase: number;
  /**
   * amount of catnip per tick that kitten consumes
   */
  catnipPerKitten: number;
  /**
   * percents of happiness modifier
   */
  happiness: number;
  jobs: Array<UnsafeJob>;
  jobNames: Array<unknown>;
  /**
   * resource modifiers per tick
   */
  resourceModifiers: {
    catnip: 0;
  };
  game: GamePage;
  sim: KittenSim;
  map: Map;
  deathTimeout: 0;
  /**
   * a reference to a leader kitten for fast access, must be restored on load
   */
  leader: Kitten | null;
  senators: Array<unknown>;
  traits: Array<unknown>;
  getRankExp: (rank: number) => number;
  canHaveLeaderOrPromote: () => boolean;
  getEffectLeader: <TDefaultObject>(
    role: "manager" | "scientist",
    defaultObject: TDefaultObject,
  ) => TDefaultObject;
  updateEffectCached: () => void;
  new (game: GamePage): VillageManager;
  loadoutController: LoadoutController;
  getJob: (name: Job) => UnsafeJob;
  getBiome: (id: string) => unknown;
  getJobLimit: (jobName: Job) => number;
  assignJob: (job: UnsafeJob, count: number) => void;
  unassignJob: (kitten: Kitten) => void;
  calculateSimMaxKittens: () => number;
  calculateKittensPerTick: () => number;
  update: () => void;
  fastforward: (daysOffset: number) => void;
  getFreeKittens: () => number;
  hasFreeKittens: (amt?: number) => boolean;
  getWorkerKittens: (jobName: Job) => number;
  getFreeEngineers: () => number;
  clearJobs: (hard: boolean) => void;
  getKittens: () => unknown;
  /**
   * Get a list of resource modifiers per tick
   * This method returns positive villager production that can be multiplied by building bonuses
   */
  getResProduction: () => Record<Resource, number>;
  updateResourceProduction: () => void;
  updateTraits: () => void;
  makeLeader: (kitten: Kitten) => void;
  removeLeader: () => void;
  getLeaderBonus: (rank: number) => number;
  /**
   * Same but with negative values
   *
   * @see getResProduction
   */
  getResConsumption: () => Record<Resource, number>;
  resetState: () => void;
  save: (saveData: unknown) => void;
  load: (saveData: unknown) => void;
  getUnhappiness: () => number;
  getEnvironmentEffect: () => number;
  getOverpopulation: () => number;
  updateHappines: () => void;
  sendHunters: () => void;
  huntAll: () => void;
  gainHuntRes: (squads: unknown) => void;
  holdFestival: (amt: number) => void;
  rand: (val: unknown) => ReturnType<GamePage["rand"]>;
  optimizeJobs: () => void;
  promoteKittens: () => void;
  promoteKittensRepeatedly: () => void;
  _promoteKittensInternal: () => {
    numPromoted: number;
    numNotEnoughGold: number;
    numNotEnoughExp: number;
  };
  getValueModifierPerSkill: (value: number) => number;
  getSkillExpRange: (value: number) => number;
  getStyledName: (kitten: Kitten, isLeaderPanel: unknown) => string;
};

export type Kitten = {
  statics: {
    SAVE_PACKET_OFFSET: number;
  };
  names: Array<string>;
  surnames: Array<string>;
  traits: Array<UnsafeTrait>;
  colors: Array<{ color: string }>;
  varieties: Array<{ style: string }>;
  name: string;
  surname: string;
  job: null;
  trait: UnsafeTrait;
  age: number;
  skills: Record<string, unknown>;
  exp: number;
  rank: number;
  /**
   * a growth/skill potential, 0 if none
   */
  rarity: number;
  /**
   * kitten color, the higher the rarer, 0 if none
   */
  color: number;
  /**
   * rare kitten pattern variety
   */
  variety: number;
  isLeader: boolean;
  /**
   * obsolete
   * @deprecated
   */
  isSenator: boolean;
  favorite: boolean;
  rand: (ratio: number) => number;
  load: (data: unknown, jobNames: unknown) => void;
  loadUncompressed: (data: unknown) => void;
  loadCompressed: (data: unknown, jobNames: unknown) => void;
  _splitSSN: (mergedResult: number, numberOfValues: number) => Array<number>;
  save: (compress: boolean, jobNames: unknown) => unknown;
  saveUncompressed: () => unknown;
  saveCompressed: (jobNames: Array<Job>) => unknown;
  _mergeSSN: (values: Array<number>) => number;
  _getTraitIndex: (name: Trait) => number;
  engineerSpeciality?: ResourceCraftable;
};

export type Map = {
  game: GamePage;
  villageLevel: number;
  /**
   * % explored, affects your priceRatio
   */
  exploredLevel: number;
  /**
   * point on map currently being explored
   */
  currentBiome: UnsafeBiome | null;
  /**
   * level of expedition squad
   */
  explorersLevel: number;
  /**
   * level of your supply depo
   */
  hqLevel: number;
  /**
   * hp of a current squad
   */
  hp: number;
  /**
   * energy/stamina/supplies of your exploration squad
   */
  energy: number;
  defaultFaunaNames: ["giant moth", "mantis", "slime mold"];
  biomes: Array<UnsafeBiome>;
  new (game: GamePage): Map;
  init: () => void;
  resetMap: () => void;
  toLevel: (biome: UnsafeBiome) => number;
  update: () => void;
  getMaxEnergy: () => number;
  getMaxHP: () => number;
  explore: (biomeId: string) => void;
  combat: () => void;
  onLevelUp: (biome: UnsafeBiome) => void;
  getBiomeRewards: (biome: UnsafeBiome) => unknown;
  getExplorationPrice: (x: number, y: number) => number;
  getExploreRatio: () => number;
  getPriceReduction: () => number;
  updateEffectCached: () => void;
  save: () => {
    hqLevel: number;
    energy: number;
    explorersLevel: number;
  };
  load: (data: {
    hqLevel: number;
    energy: number;
    explorersLevel: number;
  }) => void;
};

export type BiomeBtnController = ButtonModernController & {
  fetchModel: (options: { id: string }) => UnsafeBiomeBtnModel;
  clickHandler: (model: UnsafeBiomeBtnModel, event: unknown) => void;
  getName: (model: UnsafeBiomeBtnModel) => string;
  updateVisible: (model: UnsafeBiomeBtnModel) => void;
  updateEnabled: (model: UnsafeBiomeBtnModel) => void;
};

export type BiomeBtn = ButtonModern<
  {
    id: Biome;
    name: string;
    description: string;
    prices: Array<Price>;
    controller: BiomeBtnController;
  },
  UnsafeBiomeBtnModel,
  BiomeBtnController,
  Biome
> & {
  renderLinks: () => void;
  update: () => void;
  getTooltipHTML: () => (controller: BiomeBtnController, model: UnsafeBiomeBtnModel) => string;
};

export type UpgradeHQController = BuildingStackableBtnController & {
  defaults: () => UnsafeUpgradeHQBtnModel;
  getMetadata: (model: UnsafeUpgradeHQBtnModel) => {
    label: string;
    description: string;
    val: number;
    on: number;
  };
  getPrices: (model: UnsafeUpgradeHQBtnModel) => Array<Price>;
  buyItem: (
    model: unknown,
    event: unknown,
  ) => ReturnType<BuildingStackableBtnController["buyItem"]>;
  incrementValue: (model: unknown) => void;
  hasSellLink: (model: unknown) => false;
  updateVisible: (model: UnsafeUpgradeHQBtnModel) => void;
};

export type UpgradeExplorersController = BuildingStackableBtnController & {
  defaults: () => UnsafeUpgradeExplorersBtnModel;
  getMetadata: (model: UnsafeUpgradeExplorersBtnModel) => {
    label: string;
    description: string;
    val: number;
    on: number;
  };
  getPrices: (model: UnsafeUpgradeExplorersBtnModel) => Array<Price>;
  buyItem: (
    model: unknown,
    event: unknown,
  ) => ReturnType<BuildingStackableBtnController["buyItem"]>;
  incrementValue: (model: unknown) => void;
  hasSellLink: (model: unknown) => false;
  updateVisible: (model: UnsafeUpgradeExplorersBtnModel) => void;
};

export type MapOverviewWgt = IChildrenAware<BiomeBtn> &
  IGameAware & {
    new (game: GamePage): MapOverviewWgt;
    game: GamePage;
    upgradeExplorersBtn: ButtonModern<
      {
        name: string;
        description: string;
        handler: AnyFunction;
        prices: Array<Price>;
        controller: UpgradeExplorersController;
      },
      UnsafeButtonModernModel,
      ButtonModernController
    >;
    upgradeHQBtn: ButtonModern<
      {
        name: string;
        description: string;
        handler: AnyFunction;
        prices: Array<Price>;
        controller: UpgradeHQController;
      },
      UnsafeButtonModernModel,
      ButtonModernController
    >;
    render: (container?: HTMLElement) => void;
    update: () => void;
  };

export type KittenSim = {
  kittens: Array<Kitten>;
  game: GamePage;
  /**
   * If 1 or more, will increment kitten pool
   */
  nextKittenProgress: number;
  maxKittens: number;
  hadKittenHunters: boolean;
  new (game: GamePage): KittenSim;
  update: (kittensPerTick: number, times: number) => void;
  addKitten: () => void;
  killKittens: (amount: number) => number;
  sortKittensByExp: () => void;
  sortKittensByFavorite: () => void;
  sortKittensByColor: () => void;
  sortKittensByVariety: () => void;
  getKittens: () => number;
  rand: (ratio: number) => number;
  getSkillsSorted: (skillsDict: unknown) => Array<unknown>;
  getSkillsSortedWithJob: (skillsDict: unknown, job: Job) => Array<unknown>;
  assignJob: (job: unknown, amt: number) => void;
  removeJob: (job: unknown, amt: number) => void;
  assignCraftJob: (craft: unknown) => boolean;
  unassignCraftJob: (craft: unknown) => boolean;
  unassignCraftJobIfEngineer: (job: Job, kitten: Kitten) => void;
  clearCraftJobs: () => void;
  promote: (kitten: Kitten, rank: number) => number;
  expToPromote: (rankBase: number, rankFinal: number, expNeeded: number) => [boolean, number];
  goldToPromote: (rankBase: number, rankFinal: number, goldNeeded: number) => [boolean, number];
  canPromote: (kitten: Kitten) => boolean;
  clearJobs: (hard: boolean) => void;
};

export type LoadoutController = {
  game: GamePage;
  loadouts: Array<unknown>;
  defaultLoadouts: Array<unknown>;
  new (game: GamePage): LoadoutController;
  toggleDefaultLoadouts: () => void;
};

export type Loadout = {
  game: GamePage;
  title: null;
  jobs: Array<unknown>;
  leaderTrait: null;
  leaderJob: null;
  engineerJobs: Array<unknown>;
  pinned: boolean;
  isDefault: boolean;
  new (game: GamePage, isDefault: boolean): Loadout;
  save: () => {
    title: string;
    jobs: Array<unknown>;
    engineerJobs: Array<unknown>;
    leaderTrait: null;
    pinned: boolean;
    isDefault: boolean;
  };
  load: (data: {
    title: string;
    jobs: Array<unknown>;
    engineerJobs: Array<unknown>;
    leaderTrait: null;
    pinned: boolean;
    isDefault: boolean;
  }) => void;
  saveLoadout: (setDefault: boolean) => void;
  setLoadout: (setLeader: boolean) => void;
  assignCraftJob: (craft: unknown, value: number) => void;
  renameLoadout: () => void;
  getLoadoutJobsSum: () => number;
  getLoadoutEngineerJobsSum: () => number;
};

export type LoadoutButtonController = ButtonModernController & {
  defaults: () => UnsafeLoadoutButtonModelDefaults;
  clickHandler: (model: UnsafeLoadoutButtonModel) => void;
  getDescription: (model: UnsafeLoadoutButtonModel) => string;
  fetchModel: (options: unknown) => UnsafeLoadoutButtonModel;
  deleteLoadout: (loadout: Loadout) => void;
  saveLoadout: (loadout: Loadout) => void;
  renameLoadout: (loadout: Loadout) => void;
};

export type LoadoutButton = ButtonModern<
  {
    name: string;
    loadout: unknown;
    controller: LoadoutButtonController;
  },
  UnsafeButtonModernModel,
  ButtonModernController
> & {
  renderLinks: () => void;
  editLinks?: Array<Link>;
  pinLink?: Link;
};

export type JobButtonController = ButtonModernController & {
  defaults: () => UnsafeJobButtonModelDefaults;
  initModel: (options: unknown) => UnsafeJobButtonModel;
  getJob: (model: UnsafeBiomeBtnModel) => UnsafeJob;
  updateEnabled: (model: UnsafeBiomeBtnModel) => void;
  getName: (model: UnsafeBiomeBtnModel) => string;
  getDescription: (model: UnsafeBiomeBtnModel) => string;
  updateVisible: (model: UnsafeBiomeBtnModel) => void;
  clickHandler: (model: UnsafeBiomeBtnModel, event: Event) => void;
  unassignJobs: (model: UnsafeBiomeBtnModel, amt: number) => void;
  unassignAllJobs: (model: UnsafeBiomeBtnModel) => void;
  assignJobs: (model: UnsafeBiomeBtnModel, amt: number) => void;
  assignAllJobs: (model: UnsafeBiomeBtnModel) => void;
  fetchModel: (options: unknown) => UnsafeJobButtonModel;
  getEffects: (model: UnsafeBiomeBtnModel) => UnsafeJob["modifiers"];
  getFlavor: (model: UnsafeBiomeBtnModel) => UnsafeJob["flavor"];
};

export type JobButton = ButtonModern<
  {
    name: string;
    job: Job;
    controller: JobButtonController;
  },
  UnsafeButtonModernModel,
  ButtonModernController
> & {
  renderLinks: () => void;
  unassignLinks?: Array<Link>;
  assignLinks?: Array<Link>;
};

export type Census = {
  game: GamePage;
  records: Array<unknown>;
  container: HTMLElement;
  statics: {
    filterJob: null;
    filterTrait: null;
    sortKittens: null;
    startKitten: number;
  };
  /**
   * Total count of kittens that meet the filter
   */
  numKittensFiltered: number;
  sortOptions: Array<{
    name: "color" | "exp" | "favorite" | "variety";
    title: string;
  }>;
  governmentDiv: null;
  leaderDiv: null;
  expDiv: null;
  jobBonusDiv: null;
  promoteLeaderHref: null;
  unassignLeaderJobHref: null;
  new (game: GamePage): Census;
  _applyJobFilter: (kitten: Kitten, filter: Job) => boolean;
  _applyTraitFilter: (kitten: Kitten, filter: Trait) => boolean;
  render: (container?: HTMLElement) => void;
  getGovernmentInfo: () => string;
  getSkillInfo: (kitten: Kitten) => string;
  renderGovernment: (container: HTMLElement) => void;
  updateGovernment: () => void;
  renderPageSwitching: (container: HTMLElement) => void;
  update: () => void;
};

export type CensusPanel = Panel & {
  census: Census;
  needsRefresh: boolean;
  new (name: unknown, village: unknown, game: GamePage): CensusPanel;
  render: (container?: unknown) => void;
  update: () => void;
};

export type VillageButtonController = ButtonModernController & {
  defaults: () => UnsafeVillageButtonModelDefaults;
};

export type FestivalButtonController = VillageButtonController & {
  fetchModel: (options: unknown) => UnsafeFestivalButtonModel;
  _newLink: (holdQuantity: number) => Link;
  updateVisible: (model: UnsafeFestivalButtonModel) => void;
  hasMultipleResources: (amt: number) => boolean;
};

export type FestivalButton = ButtonModern<
  {
    name: string;
    description: string;
    handler: AnyFunction;
    prices: Array<Price>;
    controller: FestivalButtonController;
  },
  UnsafeFestivalButtonModel,
  ButtonModernController
> & {
  renderLinks: () => void;
  x100?: Link;
  x10?: Link;
  update: () => void;
};

export type Village = Tab & {
  tdTop: HTMLTableCellElement | null;
  advModeButtons: Array<unknown>;
  huntBtn: ButtonModern<
    {
      name: string;
      description: string;
      handler: AnyFunction;
      prices: Array<Price>;
      controller: VillageButtonController;
    },
    UnsafeButtonModernModel,
    ButtonModernController
  >;
  festivalBtn: FestivalButton;
  optimizeJobsBtn: ButtonModern<
    {
      name: string;
      description: string;
      handler: AnyFunction;
      controller: VillageButtonController;
    },
    UnsafeButtonModernModel,
    ButtonModernController
  >;
  promoteKittensBtn: ButtonModern<
    {
      name: string;
      description: string;
      handler: AnyFunction;
      controller: VillageButtonController;
    },
    UnsafeButtonModernModel,
    ButtonModernController
  >;
  redeemGiftBtn: ButtonModern<
    {
      name: string;
      description: string;
      handler: AnyFunction;
      controller: VillageButtonController;
    },
    UnsafeButtonModernModel,
    ButtonModernController
  >;
  new (tabName: unknown, game: GamePage): Village;
  createJobBtn: (job: Job, game: GamePage) => JobButton;
  createLoadoutBtn: (loadout: Loadout, game: GamePage) => LoadoutButton;
  render: (tabContainer?: HTMLElement) => void;
  buttons?: Array<unknown>;
  jobsPanel?: Panel;
  createLoadoutHref?: HTMLAnchorElement;
  mapPanel?: Map;
  mapWgt?: MapOverviewWgt;
  statisticsPanel?: Panel;
  advVillageTable?: HTMLTableElement;
  happinessStats?: HTMLTableCellElement;
  censusPanel?: CensusPanel;
  update: () => void;
  updateTab: () => void;
  evaluateLocks: () => boolean;
  getVillageTitle: () => string;
  skillToText: (value: number) => string;
  sendHunterSquad: () => void;
  holdFestival: (amt: number) => void;
  requestCensusRefresh: () => void;
  rand: (ratio: number) => number;
};

export type UnsafeJob = {
  name: Job;
  title: string;
  description: string;
  flavor?: string;
  unlocked: boolean;
  value: number;
  modifiers: Record<string, number>;
  calculateEffects?: (self: UnsafeJob, game: GamePage) => void;
  evaluateLocks?: (game: GamePage) => boolean;
};

export type UnsafeTrait = { name: string; title: string };

export type UnsafeBiome = {
  name: string;
  title: string;
  desc: string;
  terrainPenalty: number;
  faunaPenalty: number;
  unlocked: boolean;
};

export type UnsafeBiomeBtnModel = UnsafeButtonModernModel & {
  biome: UnsafeBiome;
};

export type UnsafeUpgradeHQBtnModel = UnsafeButtonModernModel & {
  simplePrices: boolean;
};

export type UnsafeUpgradeExplorersBtnModel = UnsafeButtonModernModel & {
  simplePrices: boolean;
};

export type UnsafeLoadoutButtonModelDefaults = {
  tooltipName: boolean;
} & UnsafeButtonModernModelDefaults;

export type UnsafeLoadoutButtonModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
> = UnsafeLoadoutButtonModelDefaults &
  UnsafeButtonModernModel<TModelOptions> & {
    editLinks: Array<Link>;
    pinLink: Link;
  };

export type UnsafeJobButtonModelDefaults = {
  tooltipName: boolean;
} & UnsafeButtonModernModelDefaults;

export type UnsafeJobButtonModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
> = UnsafeJobButtonModelDefaults &
  UnsafeButtonModernModel<TModelOptions> & {
    job: UnsafeJob;
    unassignLinks: Array<Link>;
    assignLinks: Array<Link>;
  };

export type UnsafeVillageButtonModelDefaults = {
  simplePrices: boolean;
  hasResourceHover: boolean;
} & UnsafeButtonModernModelDefaults;

export type UnsafeFestivalButtonModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
> = UnsafeVillageButtonModelDefaults &
  UnsafeButtonModernModel<TModelOptions> & {
    x10Link: Link;
    x100Link: Link;
  };
