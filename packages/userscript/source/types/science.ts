import { BuildButton, GameTab, Job, Price } from ".";
import { GamePage } from "./gamePage";

export type ScienceTab = GameTab & {
  policyPanel: BuildButton;
};

export type Policy =
  | "authocracy"
  | "bigStickPolicy"
  | "carnivale"
  | "cityOnAHill"
  | "clearCutting"
  | "communism"
  | "conservation"
  | "culturalExchange"
  | "diplomacy"
  | "environmentalism"
  | "epicurianism"
  | "expansionism"
  | "extravagance"
  | "fascism"
  | "frugality"
  | "fullIndustrialization"
  | "isolationism"
  | "knowledgeSharing"
  | "liberalism"
  | "liberty"
  | "militarizeSpace"
  | "monarchy"
  | "mysticism"
  | "necrocracy"
  | "openWoodlands"
  | "outerSpaceTreaty"
  | "radicalXenophobia"
  | "rationality"
  | "rationing"
  | "republic"
  | "socialism"
  | "stoicism"
  | "stripMining"
  | "sustainability"
  | "technocracy"
  | "theocracy"
  | "tradition"
  | "transkittenism"
  | "zebraRelationsAppeasement"
  | "zebraRelationsBellicosity";

export type Technology = "civil" | "cryptotheology" | "drama" | "nuclearFission";

export type PolicyInfo = {
  blocked: boolean;
  blocks: Array<Policy>;
  calculateEffects: (self: unknown, game: GamePage) => void;
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
