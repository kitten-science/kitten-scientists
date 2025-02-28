import type { BuildButton, GameTab, Price, Resource, Season } from "./index.js";

export type TradeTab = GameTab & {
  racePanels: Array<{
    embassyButton?: BuildButton;
    race: RaceInfo;
    tradeBtn: BuildButton;
  }>;
};

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

export type TradeInfo = {
  chance: number;
  /**
   * How many embassies you need to receive this resource.
   */
  minLevel: number;
  name: Resource;
  seasons?: Record<Season, number>;
  value: number;
  width: number;
};

export type RaceInfo = {
  buys: Array<Price>;
  /**
   * How many embassies you have.
   */
  embassyLevel: number;
  embassyPrices?: Array<Price>;
  energy: number;
  name: Race;
  sells: Array<TradeInfo>;
  standing: number;
  title: string;
  unlocked: boolean;
};
