import { Game } from "./game.js";
import { BuildButton, GameTab, Job, Price } from "./index.js";

export type ScienceTab = GameTab & {
  policyPanel: BuildButton;
};

export const PolicyArray = [
  "authocracy",
  "bigStickPolicy",
  "carnivale",
  "cityOnAHill",
  "clearCutting",
  "communism",
  "conservation",
  "culturalExchange",
  "diplomacy",
  "environmentalism",
  "epicurianism",
  "expansionism",
  "extravagance",
  "fascism",
  "frugality",
  "fullIndustrialization",
  "isolationism",
  "knowledgeSharing",
  "liberalism",
  "liberty",
  "militarizeSpace",
  "monarchy",
  "mysticism",
  "necrocracy",
  "openWoodlands",
  "outerSpaceTreaty",
  "radicalXenophobia",
  "rationality",
  "rationing",
  "republic",
  "socialism",
  "stoicism",
  "stripMining",
  "sustainability",
  "technocracy",
  "theocracy",
  "tradition",
  "transkittenism",
  "zebraRelationsAppeasement",
  "zebraRelationsBellicosity",
] as const;
export type Policy = (typeof PolicyArray)[number];

export const TechnologyArray = [
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
  "brewery",
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
export type Technology = (typeof TechnologyArray)[number];

export type PolicyInfo = {
  blocked: boolean;
  blocks: Array<Policy>;
  calculateEffects: (self: unknown, game: Game) => void;
  description: string;
  effects: {
    goldPriceRatio?: number;
    happinessKittenProductionRatio?: number;
    maxKittens?: number;
  };
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

export type TechInfo = {
  description: string;
  effectDesdc: string;
  flavor: string;
  label: string;
  name: Technology;
  prices: Array<Price>;
  researched: boolean;
  unlocked: boolean;
  unlocks: { upgrades: Array<unknown> };
};
