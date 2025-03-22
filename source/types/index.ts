import type { Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import type JQuery from "jquery";
import "dojo";
import type { KittenScientists } from "../KittenScientists.js";
import type { AchTab, Achievements, AchievementsPanel, BadgesPanel } from "./achievements.js";
import type {
  BuildingBtnModernController,
  BuildingMeta,
  BuildingsManager,
  BuildingsModern,
  GatherCatnipButtonController,
  Metadata,
  RefineCatnipButton,
  RefineCatnipButtonController,
  StagingBldBtn,
  StagingBldBtnController,
} from "./buildings.js";
import type { Calendar, Event } from "./calendar.js";
import type {
  ChallengeBtnController,
  ChallengeEffectsPanel,
  ChallengePanel,
  ChallengesManager,
  ChallengesTab,
  ReserveMan,
  ReservesPanel,
} from "./challenges.js";
import type {
  BuildingBtn,
  BuildingBtnController,
  BuildingNotStackableBtnController,
  BuildingResearchBtn,
  BuildingStackableBtn,
  BuildingStackableBtnController,
  Button,
  ButtonController,
  ButtonModern,
  ButtonModernController,
  Console,
  ContentRowRenderer,
  Control,
  IChildrenAware,
  IGameAware,
  Spacer,
  Tab,
  TabManager,
} from "./core.js";
import type {
  AutoPinnedButton,
  AutoPinnedButtonController,
  CrashBcoinButtonController,
  Diplomacy,
  DiplomacyManager,
  EldersPanel,
  EmbassyButton,
  EmbassyButtonController,
  RacePanel,
  SendExplorersButton,
  SendExplorersButtonController,
  TradeButton,
  TradeButtonController,
} from "./diplomacy.js";
import type { Game } from "./game.js";
import type { Math as KGMath } from "./math.js";
import type {
  BurnParagonBtnController,
  PrestigeBtnController,
  PrestigeManager,
  PrestigePanel,
  TurnHGOffButtonController,
} from "./prestige.js";
import type {
  CryptotheologyPanel,
  CryptotheologyWGT,
  MultiLinkBtn,
  PactsBtnController,
  PactsManager,
  PactsPanel,
  PactsWGT,
  PraiseBtnController,
  RefineBtn,
  RefineTearsBtnController,
  ReligionBtnController,
  ReligionManager,
  ReligionTab,
  ResetFaithBtnController,
  TranscendBtnController,
  TranscendenceBtnController,
  TransformBtnController,
  ZigguratBtnController,
} from "./religion.js";
import type { ResourceManager } from "./resources.js";
import type {
  Library,
  PolicyBtnController,
  PolicyPanel,
  ScienceManager,
  TechButtonController,
} from "./science.js";
import type { SpaceBuilding } from "./space.js";
import type { ChronoForgeUpgrade, VoidSpaceUpgrade } from "./time.js";
import type { Upgrade } from "./workshop.js";

export const BuyItemResultReasons = [
  "already-bought",
  "cannot-afford",
  "dev-mode",
  "item-is-free",
  "not-enabled",
  "not-unlocked",
  "paid-for",
  "player-denied",
  "require-confirmation",
];
export type BuyItemResultReason = (typeof BuyItemResultReasons)[number];

export type UnsafeBuyItemResult = {
  itemBought: boolean;
  reason: BuyItemResultReason;
};
export type UnsafeBuyItemResultDeferred = {
  itemBought: boolean;
  reason: "require-confirmation";
  def: dojo.Deferred & {
    then: (callable: (result: UnsafeBuyItemResult) => void) => void;
  };
};

export const Buildings = [
  "academy",
  "accelerator",
  "aiCore",
  "amphitheatre",
  "aqueduct",
  "barn",
  "biolab",
  "brewery",
  "calciner",
  "chapel",
  "chronosphere",
  "factory",
  "field",
  "harbor",
  "hut",
  "library",
  "logHouse",
  "lumberMill",
  "magneto",
  "mansion",
  "mine",
  "mint",
  "observatory",
  "oilWell",
  "pasture",
  "quarry",
  "reactor",
  "smelter",
  "steamworks",
  "temple",
  "tradepost",
  "unicornPasture",
  "warehouse",
  "workshop",
  "zebraForge",
  "zebraOutpost",
  "zebraWorkshop",
  "ziggurat",
] as const;
export type Building = (typeof Buildings)[number];

export const StagedBuildings = [
  "broadcasttower",
  "dataCenter",
  "hydroplant",
  "solarfarm",
  "spaceport",
] as const;
export type StagedBuilding = (typeof StagedBuildings)[number];

export const BuildingEffects = [
  // from game.bld
  "academyMeteorBonus",
  "aiLevel",
  "alicornPerTickCon",
  "bloodstoneRatio",
  "cathPollutionPerTickCon",
  "cathPollutionPerTickProd",
  "catnipDemandRatio",
  "catnipMax",
  "catnipPerTickBase",
  "catnipPerTickCon",
  "catnipRatio",
  "coalMax",
  "coalPerTickAutoprod",
  "coalPerTickBase",
  "coalPerTickCon",
  "coalRatioGlobal",
  "craftRatio",
  "cultureMax",
  "cultureMaxRatio",
  "culturePerTickBase",
  "energyConsumption",
  "energyProduction",
  "faithMax",
  "faithPerTickBase",
  "festivalArrivalRatio",
  "festivalRatio",
  "fursDemandRatio",
  "fursPerTickProd",
  "gflopsPerTickBase",
  "goldMax",
  "goldPerTickAutoprod",
  "goldPerTickCon",
  "happiness",
  "hunterRatio",
  "ironMax",
  "ironPerTickAutoprod",
  "ironPerTickCon",
  "ivoryDemandRatio",
  "ivoryPerTickCon",
  "ivoryPerTickProd",
  "magnetoBoostRatio",
  "magnetoRatio",
  "manpowerMax",
  "manpowerPerTickCon",
  "manuscriptPerTickProd",
  "maxKittens",
  "mineralsMax",
  "mineralsPerTickCon",
  "mineralsPerTickProd",
  "mineralsRatio",
  "oilMax",
  "oilPerTick",
  "oilPerTickBase",
  "oilPerTickCon",
  "oilPerTickProd",
  "productionRatio",
  "refineRatio",
  "resStasisRatio",
  "scienceMax",
  "scienceRatio",
  "skillXP",
  "spiceDemandRatio",
  "spicePerTickCon",
  "standingRatio",
  "starAutoSuccessChance",
  "starEventChance",
  "steelPerTickProd",
  "tMythrilCraftRatio",
  "tMythrilPerTick",
  "temporalFluxProduction",
  "thoriumPerTick",
  "titaniumMax",
  "titaniumPerTickAutoprod",
  "titaniumPerTickCon",
  "tradeRatio",
  "unhappinessRatio",
  "unicornsPerTickBase",
  "uraniumMax",
  "uraniumPerTick",
  "uraniumPerTickAutoprod",
  "uraniumPerTickBase",
  "woodMax",
  "woodPerTickCon",
  "woodRatio",
  "zebraPreparations",

  // from game.religion
  "activeHG",
  "alicornChance",
  "alicornPerTick",
  "blackLibraryBonus",
  "blsCorruptionRatio",
  "blsLimit",
  "compendiaTTBoostRatio",
  "corruptionBoostRatio",
  "corruptionRatio",
  "cultureMaxRatioBonus",
  "deficitRecoveryRatio",
  "energyProductionRatio",
  "faithRatioReligion",
  "globalResourceRatio",
  "goldMaxRatio",
  "ivoryMeteorChance",
  "ivoryMeteorRatio",
  "maxKittensRatio",
  "necrocornPerDay",
  "pactBlackLibraryBoost",
  "pactDeficitRecoveryRatio",
  "pactFaithRatio",
  "pactGlobalProductionRatio",
  "pactGlobalResourceRatio",
  "pactSpaceCompendiumRatio",
  "pactsAvailable",
  "pyramidFaithRatio",
  "pyramidGlobalProductionRatio",
  "pyramidGlobalResourceRatio",
  "pyramidRecoveryRatio",
  "pyramidSpaceCompendiumRatio",
  "relicRefineRatio",
  "riftChance",
  "rrRatio",
  "simScalingRatio",
  "solarRevolutionLimit",
  "solarRevolutionRatio",
  "tcRefineRatio",
  "timeRatio",
  "unicornsRatioReligion",

  // from game.workshop.upgrades
  "acceleratorRatio",
  "barnRatio",
  "beaconRelicsPerDay",
  "biofuelRatio",
  "broadcastTowerRatio",
  "cadBlueprintCraftRatio",
  "calcinerRatio",
  "calcinerSteelCraftRatio",
  "calcinerSteelRatio",
  "calcinerSteelReactorBonus",
  "catnipDemandWorkerRatioGlobal",
  "catnipJobRatio",
  "catnipMaxRatio",
  "coalRatioGlobalReduction",
  "coalSuperRatio",
  "crackerRatio",
  "dataCenterAIRatio",
  "eludiumAutomationBonus",
  "factoryRefineRatio",
  "harborCoalRatio",
  "harborRatio",
  "hutPriceRatio",
  "hydroPlantRatio",
  "libraryRatio",
  "lumberMillRatio",
  "lunarOutpostRatio",
  "manpowerJobRatio",
  "oilWellRatio",
  "queueCap",
  "reactorEnergyRatio",
  "reactorThoriumPerTick",
  "routeSpeed",
  "satnavRatio",
  "shipLimit",
  "skillMultiplier",
  "smelterRatio",
  "solarFarmRatio",
  "solarFarmSeasonRatio",
  "spaceScienceRatio",
  "starchartGlobalRatio",
  "t1CraftRatio",
  "t2CraftRatio",
  "t3CraftRatio",
  "t4CraftRatio",
  "t5CraftRatio",
  "temporalFluxProductionChronosphere",
  "temporalParadoxDayBonus",
  "unicornsGlobalRatio",
  "uplinkDCRatio",
  "uplinkLabRatio",
  "uraniumRatio",
  "warehouseRatio",
  "woodJobRatio",

  // other tabs
  "goldPriceRatio",
  "happinessKittenProductionRatio",
  "heatMax",
  "heatPerTick",
  "observatoryRatio",
  "starchartPerTickBaseSpace",
  "temporalFluxMax",
  "unobtainiumPerTickSpace",
  "uraniumPerTickCon",
];
export type BuildingEffect = (typeof BuildingEffects)[number];

export const Seasons = ["autumn", "spring", "summer", "winter"] as const;
export type Season = (typeof Seasons)[number];

export const Cycles = [
  "charon",
  "umbra",
  "yarn",
  "helios",
  "cath",
  "redmoon",
  "dune",
  "piscine",
  "terminus",
  "kairo",
] as const;
export type Cycle = (typeof Cycles)[number];

export const ResourcesCraftable = [
  "alloy",
  "beam",
  "bloodstone",
  "blueprint",
  "compedium",
  "concrate",
  "eludium",
  "gear",
  "kerosene",
  "manuscript",
  "megalith",
  "parchment",
  "plate",
  "scaffold",
  "ship",
  "slab",
  "steel",
  "tanker",
  "tMythril",
  "thorium",
  "wood",
] as const;
export type ResourceCraftable = (typeof ResourcesCraftable)[number];

export const Resources = [
  ...ResourcesCraftable,
  "alicorn",
  "antimatter",
  "blackcoin",
  "burnedParagon",
  "catnip",
  "coal",
  "culture",
  "elderBox",
  "faith",
  "furs",
  "gflops",
  "gold",
  "hashrates",
  "iron",
  "ivory",
  "karma",
  "kittens",
  "manpower",
  "minerals",
  "necrocorn",
  "oil",
  "paragon",
  "relic",
  "science",
  "sorrow",
  "spice",
  "starchart",
  "tears",
  "temporalFlux",
  "timeCrystal",
  "titanium",
  "unicorns",
  "unobtainium",
  "uranium",
  "void",
  "wrappingPaper",
  "zebras",
] as const;
export type Resource = (typeof Resources)[number];

export const TabIds = [
  "Bonfire",
  "Religion",
  "Science",
  "Space",
  "Time",
  "Trade",
  "Village",
  "Workshop",
] as const;
export type TabId = (typeof TabIds)[number];

export const Jobs = [
  "any",
  "engineer",
  "farmer",
  "geologist",
  "hunter",
  "miner",
  "priest",
  "scholar",
  "woodcutter",
] as const;
export type Job = (typeof Jobs)[number];

export const Traits = [
  "chemist",
  "engineer",
  "manager",
  "metallurgist",
  "merchant",
  "none",
  "scientist",
  "wise",
] as const;
export type Trait = (typeof Traits)[number];

export enum UnicornItemVariant {
  Cryptotheology = "c",
  OrderOfTheSun = "s",
  Ziggurat = "z",
  UnicornPasture = "zp",
}

export const ReligionUpgrades = [
  "apocripha",
  "basilica",
  "goldenSpire",
  "scholasticism",
  "solarRevolution",
  "solarchant",
  "stainedGlass",
  "sunAltar",
  "templars",
  "transcendence",
] as const;
export type ReligionUpgrade = (typeof ReligionUpgrades)[number];

export const TranscendenceUpgrades = [
  "blackCore",
  "blackLibrary",
  "blackNexus",
  "blackObelisk",
  "blackRadiance",
  "blazar",
  "darkNova",
  "holyGenocide",
  "mausoleum",
  "singularity",
] as const;
export type TranscendenceUpgrade = (typeof TranscendenceUpgrades)[number];

export const ZiggurathUpgrades = [
  "blackPyramid",
  "ivoryCitadel",
  "ivoryTower",
  "marker",
  "skyPalace",
  "sunspire",
  "unicornGraveyard",
  "unicornNecropolis",
  "unicornTomb",
  "unicornUtopia",
] as const;
export type ZiggurathUpgrade = (typeof ZiggurathUpgrades)[number];

export const Pacts = [
  "fractured",
  "pactOfCleansing",
  "pactOfDestruction",
  "pactOfExtermination",
  "pactOfPurity",
  "payDebt",
];
export type Pact = (typeof Pacts)[number];

export type AllBuildings =
  | Building
  | ChronoForgeUpgrade
  | ReligionUpgrade
  | SpaceBuilding
  | TranscendenceUpgrade
  | VoidSpaceUpgrade
  | ZiggurathUpgrade;

export const Races = [
  "dragons",
  "griffins",
  "nagas",
  "leviathans",
  "lizards",
  "sharks",
  "spiders",
  "zebras",
] as const;
export type Race = (typeof Races)[number];

export const Policies = [
  "authocracy",
  "bigStickPolicy",
  "carnivale",
  "cityOnAHill",
  "clearCutting",
  "communism",
  "conservation",
  "cryochamberExtraction",
  "culturalExchange",
  "diplomacy",
  "dragonRelationsAstrologers",
  "dragonRelationsDynamicists",
  "dragonRelationsPhysicists",
  "environmentalism",
  "epicurianism",
  "expansionism",
  "extravagance",
  "fascism",
  "frugality",
  "fullIndustrialization",
  "griffinRelationsMachinists",
  "griffinRelationsMetallurgists",
  "griffinRelationsScouts",
  "isolationism",
  "knowledgeSharing",
  "liberalism",
  "liberty",
  "lizardRelationsDiplomats",
  "lizardRelationsEcologists",
  "lizardRelationsPriests",
  "militarizeSpace",
  "monarchy",
  "mysticism",
  "nagaRelationsArchitects",
  "nagaRelationsCultists",
  "nagaRelationsMasons",
  "necrocracy",
  "openWoodlands",
  "outerSpaceTreaty",
  "radicalXenophobia",
  "rationality",
  "rationing",
  "republic",
  "scientificCommunism",
  "sharkRelationsBotanists",
  "sharkRelationsMerchants",
  "sharkRelationsScribes",
  "siphoning",
  "socialism",
  "spiderRelationsChemists",
  "spiderRelationsGeologists",
  "spiderRelationsPaleontologists",
  "stoicism",
  "stripMining",
  "sustainability",
  "technocracy",
  "terraformingInsight",
  "theocracy",
  "tradition",
  "transkittenism",
  "zebraRelationsAppeasement",
  "zebraRelationsBellicosity",
] as const;
export type Policy = (typeof Policies)[number];

export const TechnologiesIgnored = ["brewery"] as const;
export type TechnologyIgnored = (typeof TechnologiesIgnored)[number];

export const Technologies = [
  "acoustics",
  "advExogeology",
  "agriculture",
  "ai",
  "animal",
  "antimatter",
  "archeology",
  "archery",
  "architecture",
  "artificialGravity",
  "astronomy",
  "biochemistry",
  "biology",
  "blackchain",
  "calendar",
  "chemistry",
  "chronophysics",
  "civil",
  "combustion",
  "construction",
  "cryptotheology",
  "currency",
  "dimensionalPhysics",
  "drama",
  "ecology",
  "electricity",
  "electronics",
  "engineering",
  "exogeology",
  "exogeophysics",
  "genetics",
  "hydroponics",
  "industrialization",
  "machinery",
  "math",
  "mechanization",
  "metal",
  "metalurgy",
  "metaphysics",
  "mining",
  "nanotechnology",
  "navigation",
  "nuclearFission",
  "oilProcessing",
  "orbitalEngineering",
  "paradoxalKnowledge",
  "particlePhysics",
  "philosophy",
  "physics",
  "quantumCryptography",
  "robotics",
  "rocketry",
  "sattelites",
  "steel",
  "superconductors",
  "tachyonTheory",
  "terraformation",
  "theology",
  "thorium",
  "voidSpace",
  "writing",
] as const;
export type Technology = (typeof Technologies)[number];

export const Missions = [
  "centaurusSystemMission",
  "charonMission",
  "duneMission",
  "furthestRingMission",
  "heliosMission",
  "kairoMission",
  "moonMission",
  "orbitalLaunch",
  "piscineMission",
  "rorschachMission",
  "terminusMission",
  "umbraMission",
  "yarnMission",
] as const;
export type Mission = (typeof Missions)[number];

export const Planets = [
  "cath",
  "centaurusSystem",
  "charon",
  "dune",
  "furthestRing",
  "helios",
  "kairo",
  "moon",
  "piscine",
  "terminus",
  "umbra",
  "yarn",
] as const;
export type Planet = (typeof Planets)[number];

export const SpaceBuildings = [
  "containmentChamber",
  "cryostation",
  "entangler",
  "heatsink",
  "hrHarvester",
  "hydrofracturer",
  "hydroponics",
  "moltenCore",
  "moonBase",
  "moonOutpost",
  "orbitalArray",
  "planetCracker",
  "researchVessel",
  "sattelite",
  "spaceBeacon",
  "spaceElevator",
  "spaceStation",
  "spiceRefinery",
  "sunforge",
  "sunlifter",
  "tectonic",
  "terraformingStation",
] as const;
export type SpaceBuilding = (typeof SpaceBuildings)[number];

export type Unlocks = {
  buildings: Array<Building>;
  challenges: Array<Challenge>;
  chronoforge: Array<ChronoForgeUpgrade>;
  crafts: Array<ResourceCraftable>;
  jobs: Array<Job>;
  policies: Array<Policy>;
  stages: Array<StagedBuilding>;
  tabs: Array<TabId>;
  tech: Array<Technology>;
  upgrades: Array<Upgrade>;
  voidSpace: Array<VoidSpaceUpgrade>;
  zebraUpgrades: Array<unknown>;
};

export type CraftableInfo = {
  name: ResourceCraftable;
  label: string;
  description: string;
  prices: Array<Price>;
  ignoreBonuses?: boolean;
  progressHandicap: number;
  tier: number;
  unlocked?: boolean;
};

/**
 * A combination of a resource and an amount.
 */
export type Price = { name: Resource; val: number };

/**
 * Not necessarily a button, but a KG UI element.
 */
export type BuildButton<
  T = string,
  TModel extends ButtonModel = ButtonModel,
  TController extends ButtonController =
    | BuildingBtnController
    | BuildingNotStackableBtnController
    | BuildingStackableBtnController
    | ButtonController
    | ButtonModernController
    | EmbassyButtonController
    | FixCryochamberBtnController
    | PolicyBtnController
    | RefineTearsBtnController
    | ShatterTCBtnController
    | TechButtonController
    | TransformBtnController,
> = Button<TModel, TController> & {
  children: Array<BuildButton>;
  controller: TController;
  domNode: HTMLDivElement;
  id: T;
  model: TModel | null;
  onClick: () => void;
  render: () => void;
};

export type Kitten = {
  age: number;
  color: number;
  engineerSpeciality: ResourceCraftable | null;
  exp: number;
  isAdopted: boolean;
  isLeader: boolean;
  isSenator: boolean;
  job: Job;
  name: string;
  rank: number;
  rarity: number;
  skills: {
    priest: number;
  };
  surname: string;
  trait: {
    name: Trait;
    title: string;
  };
  variety: number;
};

export type Challenge =
  | "1000Years"
  | "anarchy"
  | "atheism"
  | "energy"
  | "ironWill"
  | "pacifism"
  | "postApocalypse"
  | "winterIsComing";

export type ButtonControllerOptions = Record<string, unknown>;
export type ButtonModelDefaults = {
  name: string;
  description: string;
  visible: boolean;
  enabled: boolean;
  handler: null;
  prices: Array<Price> | null;
  priceRatio: null;
  twoRow: null;
  refundPercentage: number;
  highlightUnavailable: boolean;
  resourceIsLimited: string;
  multiplyEffects: boolean;
};
export type ButtonModel = { options: ButtonControllerOptions } & ButtonModelDefaults;

export type FixCryochamberBtnController = ButtonModernController & {
  new (game: Game): EmbassyButtonController;
  doFixCryochamber: (model: ButtonModernModel) => boolean;
};

export type ShatterTCBtnController = ButtonModernController & {
  new (game: Game): ButtonModernController;
  doShatterAmt: (model: ButtonModel, amt: number) => void;
};

export type Link = {
  visible: boolean;
  title: string;
  tooltip: string;
  getDisplayValueExt: () => string;
  handler: (event: Event, callback: (success: boolean) => void) => void;
};

export type ClassList = {
  BuildingMeta: BuildingMeta;
  diplomacy: {
    ui: {
      autoPinnedButtonController: AutoPinnedButtonController;
      autoPinnedButton: AutoPinnedButton;
      EldersPanel: EldersPanel;
      EmbassyButtonController: EmbassyButtonController;
      EmbassyButton: EmbassyButton;
      RacePanel: RacePanel;
    };
  };
  game: {
    ui: {
      GatherCatnipButtonController: GatherCatnipButtonController;
      RefineCatnipButton: RefineCatnipButton;
      RefineCatnipButtonController: RefineCatnipButtonController;
    };
  };
  managers: {
    Achievements: Achievements;
    BuildingsManager: BuildingsManager;
    ChallengesManager: ChallengesManager;
    DiplomacyManager: DiplomacyManager;
    PrestigeManager: PrestigeManager;
    ReligionManager: ReligionManager;
    ResourceManager: ResourceManager;
    ScienceManager: ScienceManager;
  };
  Metadata: Metadata;
  religion: {
    pactsManager: PactsManager;
  };
  reserveMan: ReserveMan;
  tab: {
    ChallengesTab: ChallengesTab;
  };
  trade: {
    ui: {
      SendExplorersButtonController: SendExplorersButtonController;
      SendExplorersButton: SendExplorersButton;
    };
  };
  ui: {
    AchievementsPanel: AchievementsPanel;
    BadgesPanel: BadgesPanel;
    btn: {
      BuildingBtnModernController: BuildingBtnModernController;
      StagingBldBtnController: StagingBldBtnController;
      StagingBldBtn: StagingBldBtn;
    };
    BuildingBtnController: BuildingBtnController;
    BurnParagonBtnController: BurnParagonBtnController;
    ButtonController: ButtonController;
    ButtonModernController: ButtonModernController;
    BuildingStackableBtnController: BuildingStackableBtnController;
    ChallengeBtnController: ChallengeBtnController;
    ChallengeEffectsPanel: ChallengeEffectsPanel;
    ChallengePanel: ChallengePanel;
    CryptotheologyPanel: CryptotheologyPanel;
    CryptotheologyWGT: CryptotheologyWGT;
    PactsPanel: PactsPanel;
    PactsWGT: PactsWGT;
    PolicyBtnController: PolicyBtnController;
    PolicyPanel: PolicyPanel;
    PrestigeBtnController: PrestigeBtnController;
    PrestigePanel: PrestigePanel;
    religion: {
      MultiLinkBtn: MultiLinkBtn;
      RefineBtn: RefineBtn;
      RefineTearsBtnController: RefineTearsBtnController;
      TransformBtnController: TransformBtnController;
    };
    ReservesPanel: ReservesPanel;
    time: {
      FixCryochamberBtnController: FixCryochamberBtnController;
      ShatterTCBtnController: ShatterTCBtnController;
    };
    TranscendenceBtnController: TranscendenceBtnController;
    turnHGOffButtonController: TurnHGOffButtonController;
  };
};

export type ComInterface = {
  nuclearunicorn: {
    core: {
      Control: Control;
      TabManager: TabManager;
    };
    game: {
      Calendar: Calendar;
      calendar: {
        Event: Event;
      };
      log: {
        Console: Console;
      };
      Math: KGMath;
      ui: {
        BuildingBtn: BuildingBtn;
        BuildingBtnController: BuildingBtnController;
        BuildingNotStackableBtnController: BuildingNotStackableBtnController;
        BuildingResearchBtn: BuildingResearchBtn;
        BuildingStackableBtn: BuildingStackableBtn;
        BuildingStackableBtnController: BuildingStackableBtnController;
        Button: Button;
        ButtonController: ButtonController;
        ButtonModern: ButtonModern;
        ButtonModernController: ButtonModernController;
        ContentRowRenderer: ContentRowRenderer;
        CrashBcoinButtonController: CrashBcoinButtonController;
        PactsBtnController: PactsBtnController;
        Panel: Panel;
        PraiseBtnController: PraiseBtnController;
        ReligionBtnController: ReligionBtnController;
        ResetFaithBtnController: ResetFaithBtnController;
        Spacer: Spacer;
        tab: Tab & {
          AchTab: AchTab;
          BuildingsModern: BuildingsModern;
          Diplomacy: Diplomacy;
          Library: Library;
          ReligionTab: ReligionTab;
        };
        TechButtonController: TechButtonController;
        TradeButton: TradeButton;
        TradeButtonController: TradeButtonController;
        TranscendBtnController: TranscendBtnController;
        ZigguratBtnController: ZigguratBtnController;
      };
    };
  };
};

export type MixinInterface = {
  IGameAware: IGameAware;
  IChildrenAware: IChildrenAware;
};

export type I18nEngine = (key: string, args?: Array<number | string>) => string;

declare global {
  const classes: ClassList;
  const com: ComInterface;
  const game: Game;
  let unsafeWindow: Window | undefined;
  interface Window {
    $: JQuery;
    $I?: Maybe<I18nEngine>;
    dojo: {
      clone: <T>(subject: T) => T;
      subscribe: <TEvent extends string>(
        event: TEvent,
        // biome-ignore lint/suspicious/noExplicitAny: Not our type.
        handler: (...args: Array<any>) => void,
      ) => [TEvent, number];
      unsubscribe: (handle: [string, number]) => void;
    };
    game?: Maybe<Game>;
    gamePage?: Maybe<Game>;
    kittenScientists?: KittenScientists;
    LZString: {
      compressToBase64: (input: string) => string;
      compressToUTF16: (input: string) => string;
      decompressFromBase64: (input: string) => string;
      decompressFromUTF16: (input: string) => string;
    };
  }
}

/*
export * from "./_releases.js";
export * from "./_save.js";
export * from "./achievements.js";
export * from "./buildings.js";
export * from "./calendar.js";
export * from "./challenges.js";
export * from "./core.js";
export * from "./diplomacy.js";
export * from "./game.js";
export * from "./math.js";
export * from "./prestige.js";
export * from "./religion.js";
export * from "./resources.js";
export * from "./science.js";
export * from "./space.js";
export * from "./time.js";
export * from "./village.js";
export * from "./workshop.js";
*/
