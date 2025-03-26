import type {
  BuildingStackableBtnController,
  ButtonModern,
  ButtonModernController,
  Panel,
  Tab,
  UnsafeBuildingBtnModel,
  UnsafeButtonModel,
  UnsafeButtonModernModel,
} from "./core.js";
import type { GamePage } from "./game.js";
import type { Price, Race, Resource, Season } from "./index.js";

export type DiplomacyManager = {
  game: GamePage;
  defaultGoldCost: number;
  defaultManpowerCost: number;
  baseGoldCost: number;
  baseManpowerCost: number;
  races: Array<UnsafeRace>;
  new (game: GamePage): DiplomacyManager;
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
  feedElders: (amtRequested?: number) => void;
  buyBcoin: () => void;
  sellBcoin: () => void;
  unlockAll: () => void;
  calculatePhantomTradeposts: (raceName: Race, game: GamePage) => number;
  calculateStandingFromPolicies: (raceName: Race, game: GamePage) => number;
  calculateTradeBonusFromPolicies: (raceName: Race, game: GamePage) => number;
};

export type RacePanel = Panel & {
  tradeBtn: TradeButton;
  embassyButton: EmbassyButton;
  new (race: UnsafeRace): RacePanel;
  race: UnsafeRace;
  name: string;
  onToggle: (isToggled: boolean) => void;
  render: (container?: HTMLElement) => void;
  update: () => void;
};

export type EldersPanel = Panel & {
  feedBtn: null;
  render: (container?: HTMLElement) => void;
  update: () => void;
};

export type CrashBcoinButtonController = ButtonModernController<UnsafeTradeButtonModel> & {
  defaults: () => UnsafeTradeButtonModel;
  updateEnabled: (model: UnsafeTradeButtonModel) => void;
  fetchExtendedModel: (model: UnsafeTradeButtonModel) => void;
  getPrices: () => [{ name: "timeCrystal"; val: number }];
};

export type TradeButtonController = ButtonModernController<UnsafeTradeButtonModel> & {
  defaults: () => UnsafeTradeButtonModel;
};

export type TradeButton = ButtonModern<
  {
    name: string;
    description: string;
    prices: Array<Price>;
    race: Race;
    controller: TradeButtonController;
  },
  TradeButtonController,
  Resource
> & {
  race: UnsafeRace;
  trade25Href: null;
  trade100Href: null;
  tradeAllHref: null;
  new (opts: { race: UnsafeRace }, game: unknown): TradeButton;
  afterRender: () => void;
  renderLinks: () => void;
  update: () => void;
};

export type EmbassyButtonController = BuildingStackableBtnController<UnsafeEmbassyButtonModel> & {
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

export type EmbassyButton = ButtonModern<
  {
    prices: Array<Price>;
    race: Race;
    controller: EmbassyButtonController;
  },
  EmbassyButtonController
> & {
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

export type AutoPinnedButton = ButtonModern<
  {
    name: string;
    description: string;
    race: Race;
    controller: AutoPinnedButtonController;
    handler: (race: UnsafeRace) => void;
  },
  ButtonModernController
> & {
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

export type SendExplorersButton = ButtonModern<
  {
    name: string;
    description: string;
    prices: Array<Price>;
    controller: SendExplorersButtonController;
  },
  SendExplorersButtonController
> & {
  afterRender: () => void;
};

export type Diplomacy = Tab & {
  racePanels: Array<RacePanel>;
  leviathansInfo: null;
  new (tabName: unknown, game: GamePage): Diplomacy;
  render: (tabContainer?: HTMLElement) => void;
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
  autoPinned?: boolean;
};

export type UnsafeTradeButtonModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
> = {
  hasResourceHover: boolean;
  simplePrices: boolean;
} & UnsafeButtonModernModel<TModelOptions>;

export type UnsafeEmbassyButtonModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
> = {
  simplePrices: boolean;
} & UnsafeBuildingBtnModel<TModelOptions>;
