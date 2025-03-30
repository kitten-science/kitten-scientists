import type { GamePage } from "./game.js";
import type { Cycle, CycleEffects, FestivalEffects, Resource, Season } from "./index.js";

export type Calendar = {
  game: GamePage;
  seasons: Array<UnsafeSeason>;
  cycleYearColors: Array<string>;
  cycles: Array<UnsafeCycle>;
  ticksPerDay: number;
  daysPerSeason: number;
  seasonsPerYear: number;
  yearsPerCycle: number;
  cyclesPerEra: number;
  darkFutureBeginning: number;
  season: number;
  cycle: number;
  cycleYear: number;
  day: number;
  year: number;
  eventChance: number;
  weather: null;
  festivalDays: number;
  futureSeasonTemporalParadox: number;
  cryptoPrice: number;
  observeBtn: null;
  observeRemainingTime: number;
  observeClear: () => void;
  observeHandler: () => void;
  observeTimeout: () => void;
  new (game: GamePage, displayElement: unknown): Calendar;
  displayElement: unknown;
  render: () => void;
  update: () => void;
  cycleYearColor: () => string;
  cycleEffectsBasics: (effects: unknown, building_name: string) => unknown;
  cycleEffectsFestival: <TEffects>(effects: TEffects) => TEffects;
  getAstroEventAutoChance: () => number;
  trueYear: () => number;
  darkFutureYears: () => number;
  tick: () => void;
  _roundToCentiday: () => void;
  onNewDay: () => void;
  fastForward: (daysOffset: number) => number;
  onNewSeason: () => void;
  getMilleniaChanged: (startYear: number, endYear: number) => number;
  calculateMilleniumProduction: (milleniums: number) => void;
  onNewYears: (updateUI: boolean, years: number, milleniumChangeCalculated: boolean) => void;
  onNewYear: (updateUI: boolean) => void;
  adjustCryptoPrice: () => void;
  correctCryptoPrice: () => void;
  getWeatherMod: (res: { name: Resource }) => number;
  getCurSeason: () => UnsafeSeason;
  getCurSeasonTitle: () => string;
  getCurSeasonTitleShorten: () => string;
  getWinterIsComingNumeral: () => string;
  resetState: () => void;
  save: (saveData: unknown) => void;
  load: (saveData: unknown) => void;
};

// biome-ignore lint/complexity/noBannedTypes: also left blank in game
export type Event = {};

export type UnsafeSeason = {
  name: Season;
  title: string;
  shortTitle: string;
  modifiers: {
    catnip: number;
  };
};

export type UnsafeCycle = {
  name: Cycle;
  effects: Partial<CycleEffects>;
  festivalEffects: Partial<FestivalEffects>;
  glyph: string;
  uglyph: string;
  title: string;
};
