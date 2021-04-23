import { BuildButton, GameTab, Price, Resource, Season } from ".";

export type TradingTab = GameTab & {
  racePanels: Array<{
    embassyButton: BuildButton;
    race: RaceInfo;
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
  buys: Array<Price>;
  embassyLevel: number;
  embassyPrices: Array<Price>;
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
