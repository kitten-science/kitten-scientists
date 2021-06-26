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

export type TradeInfo = {
  chance: number;
  /**
   * How many embassies you need to receive this resource.F
   */
  minLevel: number;
  name: Resource;
  seasons: Record<Season, number>;
  value: number;
  width: number;
};

export type RaceInfo = {
  buys: Array<Price>;
  /**
   * How many embassies you have.
   */
  embassyLevel: number;
  embassyPrices: Array<Price>;
  energy: number;
  name: Race;
  sells: Array<TradeInfo>;
  standing: number;
  title: string;
  unlocked: boolean;
};
