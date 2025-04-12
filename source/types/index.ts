import type { Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import type JQuery from "jquery";
import "dojo";
import type { KittenScientists } from "../KittenScientists.js";
import type { Achievements, AchievementsPanel, AchTab, BadgesPanel } from "./achievements.js";
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
  UnsafeBuilding,
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
  UnsafeChallenge,
} from "./challenges.js";
import type { KGConfig } from "./config.js";
import type {
  AllBuildingBtnOptions,
  AllBuildingResearchBtnOptions,
  AllBuildingStackableBtnOptions,
  AllButtonModernOptions,
  AllButtonOptions,
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
  Panel,
  Spacer,
  Tab,
  TabManager,
  UnsafeBuildingBtnModel,
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
import type {
  EffectsManager,
  GamePage,
  IDataStorageAware,
  Server,
  Telemetry,
  Timer,
  UndoChange,
} from "./game.js";
import type { Math as KGMath } from "./math.js";
import type {
  BurnParagonBtnController,
  PrestigeBtnController,
  PrestigeManager,
  PrestigePanel,
  TurnHGOffButtonController,
  UnsafePerk,
} from "./prestige.js";
import type {
  AllMultiLinkBtnOptions,
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
  UnsafePact,
  UnsafeReligionUpgrade,
  UnsafeTranscendenceUpgrade,
  UnsafeZigguratUpgrade,
  ZigguratBtnController,
} from "./religion.js";
import type { ResourceManager } from "./resources.js";
import type {
  Library,
  PolicyBtnController,
  PolicyPanel,
  ScienceManager,
  TechButtonController,
  UnsafePolicy,
  UnsafeTech,
} from "./science.js";
import type {
  FurthestRingPanel,
  PlanetBuildingBtnController,
  PlanetPanel,
  SpaceManager,
  SpaceProgramBtnController,
  SpaceTab,
  UnsafePlanet,
  UnsafeSpaceBuilding,
} from "./space.js";
import type { StatsManager, StatsTab } from "./stats.js";
import type {
  AccelerateTimeBtn,
  AccelerateTimeBtnController,
  ChronoforgeBtnController,
  ChronoforgeWgt,
  FixCryochamberBtnController,
  Manager,
  QueueTab,
  ResetWgt,
  ShatterTCBtn,
  ShatterTCBtnController,
  TimeControlWgt,
  TimeManager,
  TimeTab,
  UnsafeChronoForgeUpgrade,
  UnsafeVoidSpaceUpgrade,
  VoidSpaceBtnController,
  VoidSpaceWgt,
} from "./time.js";
import type {
  Toolbar,
  ToolbarEnergy,
  ToolbarHappiness,
  ToolbarIcon,
  ToolbarMOTD,
} from "./toolbar.js";
import type { DesktopUI, IReactAware, UISystem } from "./ui.js";
import type {
  BiomeBtn,
  BiomeBtnController,
  Census,
  CensusPanel,
  FestivalButton,
  FestivalButtonController,
  JobButton,
  JobButtonController,
  Kitten,
  KittenSim,
  Loadout,
  LoadoutButton,
  LoadoutButtonController,
  LoadoutController,
  MapOverviewWgt,
  UnsafeBiome,
  UnsafeJob,
  UpgradeExplorersController,
  UpgradeHQController,
  Village,
  VillageButtonController,
  VillageManager,
} from "./village.js";
import type { RorshachWgt, VoidManager } from "./void.js";
import type {
  CraftButton,
  CraftButtonController,
  UnsafeCraft,
  UnsafeUpgrade,
  UpgradeButtonController,
  Workshop,
  WorkshopManager,
  ZebraUpgradeButtonController,
} from "./workshop.js";

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

export const ZigguratUpgrades = [
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
export type ZigguratUpgrade = (typeof ZigguratUpgrades)[number];

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
  | ZigguratUpgrade;

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

export const Stats = [
  "averageKittens",
  "buildingsConstructed",
  "eventsObserved",
  "kittensDead",
  "timePlayed",
  "totalChallengesCompleted",
  "totalClicks",
  "totalCrafts",
  "totalKittens",
  "totalParagon",
  "totalResets",
  "totalTrades",
  "totalYears",
  "transcendenceTier",
  "unicornsSacrificed",
];
export type Stat = (typeof Stats)[number];

export const ChronoForgeUpgrades = [
  "blastFurnace",
  "ressourceRetrieval",
  "temporalAccelerator",
  "temporalBattery",
  "temporalImpedance",
  "temporalPress",
  "timeBoiler",
] as const;
export type ChronoForgeUpgrade = (typeof ChronoForgeUpgrades)[number];

export const VoidSpaceUpgrades = [
  "cryochambers",
  "usedCryochambers",
  "voidHoover",
  "voidRift",
  "chronocontrol",
  "voidResonator",
] as const;
export type VoidSpaceUpgrade = (typeof VoidSpaceUpgrades)[number];

export const Upgrades = [
  "advancedAutomation",
  "advancedRefinement",
  "aiBases",
  "aiEngineers",
  "alloyArmor",
  "alloyAxe",
  "alloyBarns",
  "alloySaw",
  "alloyWarehouses",
  "amBases",
  "amDrive",
  "amFission",
  "amReactors",
  "amReactorsMK2",
  "assistance",
  "astrolabe",
  "astrophysicists",
  "augumentation",
  "automatedPlants",
  "barges",
  "biofuel",
  "bolas",
  "cadSystems",
  "caravanserai",
  "carbonSequestration",
  "cargoShips",
  "celestialMechanics",
  "chronoEngineers",
  "chronoforge",
  "coalFurnace",
  "coldFusion",
  "combustionEngine",
  "compositeBow",
  "concreteBarns",
  "concreteHuts",
  "concreteWarehouses",
  "crossbow",
  "cryocomputing",
  "darkEnergy",
  "deepMining",
  "distorsion",
  "electrolyticSmelting",
  "eludiumCracker",
  "eludiumHuts",
  "eludiumReflectors",
  "energyRifts",
  "enrichedThorium",
  "enrichedUranium",
  "factoryAutomation",
  "factoryLogistics",
  "factoryOptimization",
  "factoryProcessing",
  "factoryRobotics",
  "fluidizedReactors",
  "fluxCondensator",
  "fuelInjectors",
  "geodesy",
  "gmo",
  "goldOre",
  "hubbleTelescope",
  "huntingArmor",
  "hydroPlantTurbines",
  "internet",
  "invisibleBlackHand",
  "ironAxes",
  "ironHoes",
  "ironwood",
  "lhc",
  "logistics",
  "longRangeSpaceships",
  "machineLearning",
  "mineralAxes",
  "mineralHoes",
  "miningDrill",
  "mWReactor",
  "nanosuits",
  "neuralNetworks",
  "nuclearPlants",
  "nuclearSmelters",
  "offsetPress",
  "oilDistillation",
  "oilRefinery",
  "orbitalGeodesy",
  "oxidation",
  "photolithography",
  "photovoltaic",
  "pneumaticPress",
  "printingPress",
  "pumpjack",
  "pyrolysis",
  "qdot",
  "railgun",
  "reactorVessel",
  "refrigeration",
  "register",
  "reinforcedBarns",
  "reinforcedSaw",
  "reinforcedWarehouses",
  "relicStation",
  "rotaryKiln",
  "satelliteRadio",
  "satnav",
  "seti",
  "silos",
  "solarSatellites",
  "spaceEngineers",
  "spaceManufacturing",
  "spiceNavigation",
  "starlink",
  "stasisChambers",
  "steelArmor",
  "steelAxe",
  "steelPlants",
  "steelSaw",
  "stoneBarns",
  "storageBunkers",
  "strenghtenBuild",
  "tachyonAccelerators",
  "thinFilm",
  "thoriumEngine",
  "thoriumReactors",
  "titaniumAxe",
  "titaniumBarns",
  "titaniumMirrors",
  "titaniumSaw",
  "titaniumWarehouses",
  "turnSmoothly",
  "unicornSelection",
  "unobtainiumAxe",
  "unobtainiumDrill",
  "unobtainiumHuts",
  "unobtainiumReflectors",
  "unobtainiumSaw",
  "uplink",
  "voidAspiration",
  "voidEnergy",
  "voidReactors",
] as const;
export type Upgrade = (typeof Upgrades)[number];

export const ZebraUpgrades = [
  "bloodstoneInstitute",
  "darkBrew",
  "darkRevolution",
  "minerologyDepartment",
  "whispers",
];
export type ZebraUpgrade = (typeof ZebraUpgrades)[number];

export enum TimeItemVariant {
  Chronoforge = "chrono",
  VoidSpace = "void",
}

export type FaithItem = Exclude<ReligionItem, UnicornItem>;

export const UnicornItems = [
  "ivoryCitadel",
  "ivoryTower",
  "skyPalace",
  "sunspire",
  "unicornPasture",
  "unicornTomb",
  "unicornUtopia",
] as const;
export type UnicornItem = (typeof UnicornItems)[number];

export type ReligionItem = ReligionUpgrade | TranscendenceUpgrade | ZigguratUpgrade;
export type ReligionAdditionItem = "adore" | "autoPraise" | "bestUnicornBuilding" | "transcend";

export const ReligionOptions = [
  "sacrificeUnicorns",
  "sacrificeAlicorns",
  "refineTears",
  "refineTimeCrystals",
  "transcend",
  "adore",
  "autoPraise",
] as const;
export type ReligionOption = (typeof ReligionOptions)[number];

export const Biomes = [
  "bloodDesert",
  "boneForest",
  "desert",
  "forest",
  "hills",
  "mountain",
  "plains",
  "rainForest",
  "swamp",
  "village",
  "volcano",
];
export type Biome = (typeof Biomes)[number];

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

export const Perks = [
  "adjustmentBureau",
  "anachronomancy",
  "ascoh",
  "astromancy",
  "binah",
  "blackCodex",
  "carnivals",
  "chesed",
  "chokhmah",
  "chronomancy",
  "codexAgrum",
  "codexLeviathanianus",
  "codexLogos",
  "codexVox",
  "diplomacy",
  "divineProportion",
  "engeneering",
  "gevurah",
  "goldenRatio",
  "hod",
  "keter",
  "malkuth",
  "megalomania",
  "navigationDiplomacy",
  "netzach",
  "numerology",
  "numeromancy",
  "pawgan",
  "renaissance",
  "tiferet",
  "unicornmancy",
  "vitruvianFeline",
  "voidOrder",
  "willenfluff",
  "yesod",
  "zebraCovenant",
  "zebraDiplomacy",
];
export type Perk = (typeof Perks)[number];

export const ColorSchemes = [
  "anthracite",
  "arctic",
  "black",
  "bluish",
  "catnip",
  "chocolate",
  "computer",
  "cyber",
  "dark",
  "default",
  "dune",
  "factory",
  "fluid",
  "gold",
  "grassy",
  "grayish",
  "greenish",
  "minimalist",
  "oil",
  "school",
  "sleek",
  "space",
  "spooky",
  "tombstone",
  "unicorn",
  "vessel",
  "vintage",
  "wood",
] as const;
export type ColorScheme = (typeof ColorSchemes)[number];

export const Locales = [
  "be",
  "br",
  "cz",
  "de",
  "en",
  "es",
  "esl",
  "fr",
  "it",
  "ja",
  "ko",
  "pl",
  "ru",
  "uk",
  "zh",
  "zht",
] as const;
export type Locale = (typeof Locales)[number];

export const Notations = ["si", "e", "sie"] as const;
export type Notation = (typeof Notations)[number];

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

export type UnlockTypeMap = {
  biomes: UnsafeBiome;
  buildings: UnsafeBuilding;
  challenges: UnsafeChallenge;
  chronoforge: UnsafeChronoForgeUpgrade;
  crafts: UnsafeCraft;
  jobs: UnsafeJob;
  pacts: UnsafePact;
  perks: UnsafePerk;
  planet: UnsafePlanet;
  policies: UnsafePolicy;
  religion: UnsafeReligionUpgrade;
  schemes: unknown;
  spaceBuilding: UnsafeSpaceBuilding;
  spaceMission: UnsafePlanet;
  stages: UnsafeBuilding;
  tabs: Tab;
  tech: UnsafeTech;
  transcendenceUpgrades: UnsafeTranscendenceUpgrade;
  upgrades: UnsafeUpgrade;
  voidSpace: UnsafeVoidSpaceUpgrade;
  zebraUpgrades: UnsafeUpgrade;
  zigguratUpgrades: UnsafeZigguratUpgrade;
};
export type Unlock = keyof UnlockTypeMap;

/**
 * A combination of a resource and an amount.
 */
export type Price = { name: Resource; val: number };

export const Challenges = [
  "1000Years",
  "anarchy",
  "atheism",
  "energy",
  "ironWill",
  "pacifism",
  "postApocalypse",
  "winterIsComing",
];
export type Challenge = (typeof Challenges)[number];

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
    Server: Server;
    Telemetry: Telemetry;
    Timer: Timer;
    ui: {
      GatherCatnipButtonController: GatherCatnipButtonController;
      RefineCatnipButton: RefineCatnipButton;
      RefineCatnipButtonController: RefineCatnipButtonController;
    };
    UndoChange: UndoChange;
  };
  KGConfig: KGConfig;
  managers: {
    Achievements: Achievements;
    BuildingsManager: BuildingsManager;
    ChallengesManager: ChallengesManager;
    DiplomacyManager: DiplomacyManager;
    PrestigeManager: PrestigeManager;
    ReligionManager: ReligionManager;
    ResourceManager: ResourceManager;
    ScienceManager: ScienceManager;
    SpaceManager: SpaceManager;
    StatsManager: StatsManager;
    TimeManager: TimeManager;
    VillageManager: VillageManager;
    VoidManager: VoidManager;
    WorkshopManager: WorkshopManager;
  };
  Metadata: Metadata;
  queue: {
    manager: Manager;
  };
  religion: {
    pactsManager: PactsManager;
  };
  reserveMan: ReserveMan;
  tab: {
    ChallengesTab: ChallengesTab;
    QueueTab: QueueTab;
    StatsTab: StatsTab;
    TimeTab: TimeTab;
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
    ChronoforgeWgt: ChronoforgeWgt;
    CryptotheologyPanel: CryptotheologyPanel;
    CryptotheologyWGT: CryptotheologyWGT;
    DesktopUI: DesktopUI;
    PactsPanel: PactsPanel;
    PactsWGT: PactsWGT;
    PolicyBtnController: PolicyBtnController;
    PolicyPanel: PolicyPanel;
    PrestigeBtnController: PrestigeBtnController;
    PrestigePanel: PrestigePanel;
    RorshachWgt: RorshachWgt;
    religion: {
      MultiLinkBtn: MultiLinkBtn<AllMultiLinkBtnOptions>;
      RefineBtn: RefineBtn;
      RefineTearsBtnController: RefineTearsBtnController;
      TransformBtnController: TransformBtnController;
    };
    ReservesPanel: ReservesPanel;
    ResetWgt: ResetWgt;
    space: {
      FurthestRingPanel: FurthestRingPanel;
      PlanetBuildingBtnController: PlanetBuildingBtnController;
      PlanetPanel: PlanetPanel;
    };
    time: {
      AccelerateTimeBtn: AccelerateTimeBtn;
      AccelerateTimeBtnController: AccelerateTimeBtnController;
      ChronoforgeBtnController: ChronoforgeBtnController;
      FixCryochamberBtnController: FixCryochamberBtnController;
      ShatterTCBtn: ShatterTCBtn;
      ShatterTCBtnController: ShatterTCBtnController;
      VoidSpaceBtnController: VoidSpaceBtnController;
    };
    TimeControlWgt: TimeControlWgt;
    toolbar: {
      ToolbarEnergy: ToolbarEnergy;
      ToolbarHappiness: ToolbarHappiness;
      ToolbarMOTD: ToolbarMOTD;
    };
    Toolbar: Toolbar;
    ToolbarIcon: ToolbarIcon;
    TranscendenceBtnController: TranscendenceBtnController;
    turnHGOffButtonController: TurnHGOffButtonController;
    UISystem: UISystem;
    village: {
      BiomeBtn: BiomeBtn;
      BiomeBtnController: BiomeBtnController;
      Census: Census;
    };
    VoidSpaceWgt: VoidSpaceWgt;
  };
  village: {
    KittenSim: KittenSim;
    LoadoutController: LoadoutController;
    ui: {
      FestivalButton: FestivalButton;
      FestivalButtonController: FestivalButtonController;
      map: {
        UpgradeExplorersController: UpgradeExplorersController;
        UpgradeHQController: UpgradeHQController;
      };
      MapOverviewWgt: MapOverviewWgt;
      VillageButtonController: VillageButtonController;
    };
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
      EffectsManager: EffectsManager;
      log: {
        Console: Console;
      };
      Math: KGMath;
      ui: {
        BuildingBtn: BuildingBtn<AllBuildingBtnOptions>;
        BuildingBtnController: BuildingBtnController;
        BuildingNotStackableBtnController: BuildingNotStackableBtnController;
        BuildingResearchBtn: BuildingResearchBtn<AllBuildingResearchBtnOptions>;
        BuildingStackableBtn: BuildingStackableBtn<AllBuildingStackableBtnOptions>;
        BuildingStackableBtnController: BuildingStackableBtnController;
        Button: Button<AllButtonOptions>;
        ButtonController: ButtonController;
        ButtonModern: ButtonModern<AllButtonModernOptions>;
        ButtonModernController: ButtonModernController;
        CensusPanel: CensusPanel;
        ContentRowRenderer: ContentRowRenderer;
        CraftButton: CraftButton;
        CraftButtonController: CraftButtonController;
        CrashBcoinButtonController: CrashBcoinButtonController;
        GamePage: GamePage;
        JobButton: JobButton;
        JobButtonController: JobButtonController;
        LoadoutButton: LoadoutButton;
        LoadoutButtonController: LoadoutButtonController;
        PactsBtnController: PactsBtnController;
        Panel: Panel;
        PraiseBtnController: PraiseBtnController;
        ReligionBtnController: ReligionBtnController;
        ResetFaithBtnController: ResetFaithBtnController;
        SpaceProgramBtnController: SpaceProgramBtnController<UnsafeBuildingBtnModel>;
        Spacer: Spacer;
        tab: Tab & {
          AchTab: AchTab;
          BuildingsModern: BuildingsModern;
          Diplomacy: Diplomacy;
          Library: Library;
          ReligionTab: ReligionTab;
          SpaceTab: SpaceTab;
          Village: Village;
          Workshop: Workshop;
        };
        TechButtonController: TechButtonController;
        TradeButton: TradeButton;
        TradeButtonController: TradeButtonController;
        TranscendBtnController: TranscendBtnController;
        UpgradeButtonController: UpgradeButtonController;
        ZebraUpgradeButtonController: ZebraUpgradeButtonController;
        ZigguratBtnController: ZigguratBtnController;
      };
      village: {
        Kitten: Kitten;
        Loadout: Loadout;
      };
    };
  };
};

export type MixinInterface = {
  IChildrenAware: IChildrenAware;
  IDataStorageAware: IDataStorageAware;
  IGameAware: IGameAware;
  IReactAware: IReactAware;
};

export type I18nEngine = (key: string, args?: Array<number | string>) => string;

declare global {
  const classes: ClassList;
  const com: ComInterface;
  const game: GamePage;
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
    game?: Maybe<GamePage>;
    gamePage?: Maybe<GamePage>;
    kittenScientists?: KittenScientists;
    LZString: {
      compressToBase64: (input: string) => string;
      compressToUTF16: (input: string) => string;
      decompressFromBase64: (input: string) => string;
      decompressFromUTF16: (input: string) => string;
    };
  }
}

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
export * from "./toolbar.js";
export * from "./ui.js";
export * from "./village.js";
export * from "./void.js";
export * from "./workshop.js";
