import type {
  BuildingStackableBtnController,
  ButtonModern,
  ButtonModernController,
  Panel,
  Tab,
  UnsafeButtonModel,
} from "./core.js";
import type { Game } from "./game.js";
import type { Price, Race, Resource, Season } from "./index.js";

export type DiplomacyManager = {
  game: Game;
  defaultGoldCost: number;
  defaultManpowerCost: number;
  baseGoldCost: number;
  baseManpowerCost: number;
  races: Array<UnsafeRace>;
  new (game: Game): DiplomacyManager;
  get: (raceName: Race) => UnsafeRace;
  getTradeRatio: () => number;
  resetState: () => void;
  save: (saveData: unknown) => void;
  load: (saveData: unknown) => void;
  hasUnlockedRaces: () => boolean;
  isValidTrade: (sell: UnsafeTradeSellOffer, race: UnsafeRace) => boolean;
  unlockRandomRace: () => UnsafeRace | null;
  update: () => void;
  onLeavingIW: () => void;
  unlockElders: () => void;
  onNewDay: () => void;
  tradeImpl: (race: UnsafeRace, totalTradeAmount: number) => void;
  _fuzzGainedAmount: (amount: number, width: number) => number;
  getManpowerCost: () => number;
  getGoldCost: () => number;
  trade: (race: UnsafeRace) => void;
  tradeMultiple: (race: UnsafeRace, amt: number) => void;
  hasMultipleResources: (race: UnsafeRace, amt: number) => void;
  tradeAll: (race: UnsafeRace) => void;
  gainTradeRes: (yieldResTotal: boolean, amtTrade: number) => void;
  getMaxTradeAmt: (race: UnsafeRace) => number | undefined;
  getFinalStanding: (race: UnsafeRace) => number;
  getSpiceTradeChance: (race: UnsafeRace) => number;
  getResourceTradeChance: (race: UnsafeRace) => number;
  getMarkerCap: () => number;
  feedElders: (amtRequested: number) => void;
  buyBcoin: () => void;
  sellBcoin: () => void;
  unlockAll: () => void;
  calculatePhantomTradeposts: (raceName: Race, game: Game) => number;
  calculateStandingFromPolicies: (raceName: Race, game: Game) => number;
  calculateTradeBonusFromPolicies: (raceName: Race, game: Game) => number;
};

export type RacePanel = Panel & {
  tradeBtn: null;
  embassyButton: null;
  new (race: UnsafeRace): RacePanel;
  race: UnsafeRace;
  name: string;
  onToggle: (isToggled: boolean) => void;
  render: (container: unknown) => void;
  update: () => void;
};

export type EldersPanel = Panel & {
  feedBtn: null;
  render: (container: unknown) => void;
  update: () => void;
};

export type CrashBcoinButtonController = ButtonModernController & {
  defaults: () => UnsafeTradeButtonModel;
  updateEnabled: (model: UnsafeTradeButtonModel) => void;
  fetchExtendedModel: (model: UnsafeTradeButtonModel) => void;
  getPrices: () => [{ name: "timeCrystal"; val: number }];
};

export type TradeButtonController = ButtonModernController & {
  defaults: () => UnsafeTradeButtonModel;
};

export type TradeButton = ButtonModern & {
  race: UnsafeRace;
  trade25Href: null;
  trade100Href: null;
  tradeAllHref: null;
  new (opts: { race: UnsafeRace }, game: unknown): TradeButtonController;
  afterRender: () => void;
  renderLinks: () => void;
  update: () => void;
};

export type EmbassyButtonController = BuildingStackableBtnController & {
  defaults: () => UnsafeEmbassyButtonModel;
  getEffects: (model: UnsafeEmbassyButtonModel) => Record<string, number> | undefined;
  getTotalEffects: (model: unknown) => undefined;
  getMetadata: (model: UnsafeEmbassyButtonModel) => UnsafeRace;
  getPrices: (model: UnsafeEmbassyButtonModel) => Array<Price>;
  buyItem: (model: unknown, event: unknown) => void;
  incrementValue: (model: UnsafeEmbassyButtonModel) => void;
  hasSellLink: (model: unknown) => false;
  updateVisible: (model: UnsafeEmbassyButtonModel) => void;
};

export type EmbassyButton = ButtonModern & {
  pinLinkHref: null;
  race: UnsafeRace;
  new (opts: { race: UnsafeRace }, game: unknown): EmbassyButton;
  renderLinks: () => void;
  getTooltipHTML: (controller: EmbassyButtonController, model: UnsafeEmbassyButtonModel) => string;
  update: () => void;
};

export type AutoPinnedButtonController = ButtonModernController & {
  defaults: () => UnsafeTradeButtonModel;
  getName: (model: UnsafeTradeButtonModel) => string;
  hasSellLink: (model: unknown) => false;
  updateVisible: (model: UnsafeTradeButtonModel) => void;
};

export type AutoPinnedButton = ButtonModern & {
  pinLinkHref: null;
  race: UnsafeRace;
  new (opts: { race: UnsafeRace }, game: unknown): AutoPinnedButton;
  renderLinks: () => void;
  update: () => void;
};

export type SendExplorersButtonController = ButtonModernController & {
  defaults: () => UnsafeTradeButtonModel;
  clickHandler: (model: unknown, event: unknown) => void;
};

export type SendExplorersButton = ButtonModern & {
  afterRender: () => void;
};

export type Diplomacy = Tab & {
  racePanels: Array<RacePanel>;
  leviathansInfo: null;
  new (tabName: unknown, game: Game): Diplomacy;
  render: (tabContainer: HTMLElement) => void;
  update: () => void;
  updateTab: () => void;
};

export type UnsafeTradeSellOffer = {
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

export type UnsafeRace = {
  buys: Array<Price>;
  collapsed: boolean;
  /**
   * How many embassies you have.
   */
  embassyLevel: number;
  embassyPrices?: Array<Price>;
  energy: number;
  name: Race;
  sells: Array<UnsafeTradeSellOffer>;
  standing: number;
  title: string;
  unlocked: boolean;
};

export type UnsafeTradeButtonModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
> = {
  hasResourceHover: boolean;
  simplePrices: boolean;
} & UnsafeButtonModel<TModelOptions>;

export type UnsafeEmbassyButtonModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
> = {
  simplePrices: boolean;
} & UnsafeButtonModel<TModelOptions>;
