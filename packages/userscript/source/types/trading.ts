import { BuildButton, GameTab, Resource, Season } from ".";

export type TradingTab = GameTab & {
  racePanels: Array<{
    race: {
      name: string;
    };
    tradeBtn: BuildButton;
  }>;
};

export type Race =
  | "dragons"
  | "griffins"
  | "nagas"
  | "leviathans"
  | "lizards"
  | "sharks"
  | "spiders"
  | "zebras";

export type RaceInfo = {
  buys: Array<{ name: Resource; val: number }>;
  embassyLevel: number;
  embassyPrices: Array<{ name: Resource; val: number }>;
  energy: number;
  name: Race;
  sells: Array<{
    chance: number;
    minLevel: number;
    name: Resource;
    seasons: Record<Season, number>;
    value: number;
    width: number;
  }>;
  standing: number;
  title: string;
  unlocked: boolean;
};
