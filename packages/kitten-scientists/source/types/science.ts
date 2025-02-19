import { Game } from "./game.js";
import {
  BuildButton,
  Building,
  BuildingEffects,
  Challenge,
  ChronoForgeUpgrade,
  GameTab,
  Job,
  Price,
  ResourceCraftable,
  StagedBuilding,
  TabId,
  Upgrade,
  VoidSpaceUpgrade,
} from "./index.js";

export type ScienceTab = GameTab & {
  policyPanel: BuildButton;
};

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

export type PolicyInfo = {
  blocked: boolean;
  blocks: Array<Policy>;
  calculateEffects: (self: unknown, game: Game) => void;
  description: string;
  effects: Partial<BuildingEffects>;
  label: string;
  name: Policy;
  prices: Array<Price>;
  requiredLeaderJob?: Job;
  /**
   * Has this policy already been researched?
   */
  researched: boolean;
  unlocked: boolean;
  unlocks: { policies: Array<Policy> };
};

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

export type TechInfo = {
  description: string;
  effectDesdc: string;
  flavor: string;
  label: string;
  name: Technology;
  prices: Array<Price>;
  researched: boolean;
  unlocked: boolean;
  unlocks?: Partial<Unlocks>;
};
