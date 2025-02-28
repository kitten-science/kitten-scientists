import type { Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import type JQuery from "jquery";
import type { KittenScientists } from "../KittenScientists.js";
import type { Building, BuildingMeta } from "./buildings.js";
import type { Game } from "./game.js";
import type {
  ReligionUpgrade,
  TranscendenceUpgrade,
  TranscendenceUpgradeInfo,
  ZiggurathUpgrade,
  ZiggurathUpgradeInfo,
} from "./religion.js";
import type { TechInfo } from "./science.js";
import type { SpaceBuilding } from "./space.js";
import type { ChronoForgeUpgrade, VoidSpaceUpgrade, VoidSpaceUpgradeInfo } from "./time.js";
import type { UpgradeInfo } from "./workshop.js";

export const Seasons = ["autumn", "spring", "summer", "winter"] as const;
export type Season = (typeof Seasons)[number];

export const Cycles = [
  "charon",
  "umbra",
  "yarn",
  "helios",
  "cath",
  "redmoon",
  "dune",
  "piscine",
  "terminus",
  "kairo",
] as const;
export type Cycle = (typeof Cycles)[number];

export const ResourcesCraftable = [
  "alloy",
  "beam",
  "bloodstone",
  "blueprint",
  "compedium",
  "concrate",
  "eludium",
  "gear",
  "kerosene",
  "manuscript",
  "megalith",
  "parchment",
  "plate",
  "scaffold",
  "ship",
  "slab",
  "steel",
  "tanker",
  "tMythril",
  "thorium",
  "wood",
] as const;
export type ResourceCraftable = (typeof ResourcesCraftable)[number];

export const Resources = [
  ...ResourcesCraftable,
  "alicorn",
  "antimatter",
  "blackcoin",
  "burnedParagon",
  "catnip",
  "coal",
  "culture",
  "elderBox",
  "faith",
  "furs",
  "gflops",
  "gold",
  "hashrates",
  "iron",
  "ivory",
  "karma",
  "kittens",
  "manpower",
  "minerals",
  "necrocorn",
  "oil",
  "paragon",
  "relic",
  "science",
  "sorrow",
  "spice",
  "starchart",
  "tears",
  "temporalFlux",
  "timeCrystal",
  "titanium",
  "unicorns",
  "unobtainium",
  "uranium",
  "void",
  "wrappingPaper",
  "zebras",
] as const;
export type Resource = (typeof Resources)[number];

export const TabIds = [
  "Bonfire",
  "Religion",
  "Science",
  "Space",
  "Time",
  "Trade",
  "Village",
  "Workshop",
] as const;
export type TabId = (typeof TabIds)[number];

export const Jobs = [
  "any",
  "engineer",
  "farmer",
  "geologist",
  "hunter",
  "miner",
  "priest",
  "scholar",
  "woodcutter",
] as const;
export type Job = (typeof Jobs)[number];

export const Traits = [
  "chemist",
  "engineer",
  "manager",
  "metallurgist",
  "merchant",
  "none",
  "scientist",
  "wise",
] as const;
export type Trait = (typeof Traits)[number];

export type AllBuildings =
  | Building
  | ChronoForgeUpgrade
  | ReligionUpgrade
  | SpaceBuilding
  | TranscendenceUpgrade
  | VoidSpaceUpgrade
  | ZiggurathUpgrade;

/**
 * A combination of a resource and an amount.
 */
export type Price = { name: Resource; val: number };

export type Panel = {
  children: Array<BuildButton>;
  visible: boolean;
};

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type Control = {
  /* intentionally left blank. exists for clarity */
};

export type Button<
  TModel extends ButtonModel = ButtonModel,
  TController extends ButtonController = ButtonController,
> = Control & {
  model: TModel | null;
  controller: TController;
  game: Game;

  domNode: HTMLDivElement;
  container: unknown;

  tab: string | null;

  buttonTitle: string | null;
  new (opts: unknown, game: Game): Button;
  setOpts: (opts: unknown) => void;

  init: () => void;
  updateVisible: () => void;
  updateEnabled: () => void;
  update: () => void;

  render: (btnContainer: unknown) => void;
  animate: () => void;
  onClick: (event: MouseEvent) => void;
  onKeyPress: (event: KeyboardEvent) => void;
  afterRender: () => void;

  addLink: (linkModel: unknown) => void;
  addLinkList: (links: Array<unknown>) => void;
};

/**
 * Not necessarily a button, but a KG UI element.
 */
export type BuildButton<
  T = string,
  TModel extends ButtonModel = ButtonModel,
  TController extends ButtonController =
    | BuildingBtnController
    | BuildingNotStackableBtnController
    | BuildingStackableBtnController
    | ButtonController
    | ButtonModernController
    | EmbassyButtonController
    | FixCryochamberBtnController
    | PolicyBtnController
    | RefineTearsBtnController
    | ShatterTCBtnController
    | TechButtonController
    | TransformBtnController,
> = Button<TModel, TController> & {
  children: Array<BuildButton>;
  controller: TController;
  domNode: HTMLDivElement;
  id: T;
  model: TModel | null;
  onClick: () => void;
  render: () => void;
};

export type GameTab = {
  buttons: Array<BuildButton>;
  children: Array<BuildButton>;
  render: () => void;
  tabId: TabId;
  visible: boolean;
};

export type Kitten = {
  age: number;
  color: number;
  engineerSpeciality: ResourceCraftable | null;
  exp: number;
  isAdopted: boolean;
  isLeader: boolean;
  isSenator: boolean;
  job: Job;
  name: string;
  rank: number;
  rarity: number;
  skills: {
    priest: number;
  };
  surname: string;
  trait: {
    name: Trait;
    title: string;
  };
  variety: number;
};

export type Challenge =
  | "1000Years"
  | "anarchy"
  | "atheism"
  | "energy"
  | "ironWill"
  | "pacifism"
  | "postApocalypse"
  | "winterIsComing";

export type ButtonControllerOptions = Record<string, unknown>;
export type ButtonModelDefaults = {
  name: string;
  description: string;
  visible: boolean;
  enabled: boolean;
  handler: null;
  prices: Array<Price> | null;
  priceRatio: null;
  twoRow: null;
  refundPercentage: number;
  highlightUnavailable: boolean;
  resourceIsLimited: string;
  multiplyEffects: boolean;
};
export type ButtonModel = { options: ButtonControllerOptions } & ButtonModelDefaults;

export type ButtonController = {
  new (game: Game, controllerOpts?: ButtonControllerOptions): ButtonController;
  fetchModel: (options: ButtonControllerOptions) => ButtonModel;
  fetchExtendedModel: (model: ButtonModel) => void;
  initModel: (options: ButtonControllerOptions) => ButtonModel;
  defaults: () => ButtonModelDefaults;
  createPriceLineModel: (model: ButtonModel, price: unknown) => unknown;
  hasResources: (model: ButtonModel, prices?: Array<unknown>) => boolean;
  /**
   * Updates the `enabled` field in the model of the button.
   * @param model The button this controller is associated with.
   */
  updateEnabled: (model: ButtonModel) => void;
  /**
   * Does nothing by default. Can invoke custom handler.
   * @param model The button this controller is associated with.
   */
  updateVisible: (model: ButtonModel) => void;
  getPrices: (model: ButtonModel) => Array<Price>;
  getName: (model: ButtonModel) => string;
  getDescription: (model: ButtonModel) => string;
  /** @deprecated */
  adjustPrice: (model: ButtonModel, ratio: number) => void;
  /** @deprecated */
  rejustPrice: (model: ButtonModel, ratio: number) => void;
  payPrice: (model: ButtonModel) => void;
  clickHandler: (model: ButtonModel, event: Event) => void;
  buyItem: (
    model: ButtonModel | null,
    event: Event | null,
    callback: (success: boolean) => void,
  ) => void;
  refund: (model: ButtonModel) => void;
};

export type ButtonModernModel = {
  metadata:
    | BuildingMeta
    | TechInfo
    | TranscendenceUpgradeInfo
    | UpgradeInfo
    | VoidSpaceUpgradeInfo
    | ZiggurathUpgradeInfo;
} & ButtonModel;
export type ButtonModernController = ButtonController & {
  new (game: Game): ButtonModernController;
  initModel: (options: ButtonControllerOptions) => ButtonModernModel;
  fetchModel: (options: ButtonControllerOptions) => ButtonModernModel;
  getMetadata: (model: ButtonModernModel) => BuildingMeta | null;
  getEffects: (model: ButtonModernModel) => unknown;
  getTotalEffects: (model: ButtonModernModel) => unknown;
  getNextEffectValue: (model: ButtonModernModel, effectName: string) => unknown;
  getFlavor: (model: ButtonModernModel) => string;
  hasSellLink: (model: ButtonModernModel) => boolean;
  metadataHasChanged: (model: ButtonModernModel) => void;
  off: (model: ButtonModernModel, amt: number) => void;
  offAll: (model: ButtonModernModel) => void;
  on: (model: ButtonModernModel, amt: number) => void;
  onAll: (model: ButtonModernModel) => void;
  sell: (event: Event, model: ButtonModernModel) => void;
  sellInternal: (model: ButtonModernModel, end: number) => void;
  decrementValue: (model: ButtonModernModel) => void;
  updateVisible: (model: ButtonModernModel) => void;
  handleTogglableOnOffClick: (model: ButtonModernModel) => void;
  handleToggleAutomationLinkClick: (model: ButtonModernModel) => void;
};

export type BuildingBtnController = ButtonModernController & {
  new (game: Game): BuildingBtnController;
};

export type BuildingNotStackableBtnController = BuildingBtnController & {
  new (game: Game): BuildingNotStackableBtnController;
};

export type BuildingStackableBtnController = BuildingBtnController & {
  new (game: Game): BuildingStackableBtnController;
  _buyItem_step2: (model: ButtonModel, event: Event, callback: (success: boolean) => void) => void;
  build: (model: ButtonModel, maxBld: number) => void;
  incrementValue: (model: ButtonModel) => void;
};

export type EmbassyButtonController = BuildingStackableBtnController & {
  new (game: Game): EmbassyButtonController;
};

export type FixCryochamberBtnController = ButtonModernController & {
  new (game: Game): EmbassyButtonController;
  doFixCryochamber: (model: ButtonModernModel) => boolean;
};

export type GatherCatnipButtonController = ButtonModernController & {
  new (game: Game): GatherCatnipButtonController;
};

export type PolicyBtnController = BuildingNotStackableBtnController & {
  new (game: Game): PolicyBtnController;
  shouldBeBough: (model: ButtonModel, game: Game) => boolean;
};

export type RefineTearsBtnController = ButtonModernController & {
  new (game: Game): ButtonModernController;
  _newLink: (model: ButtonModel, divider: number) => Link;
  buyItem: (
    model: ButtonModel | null,
    event: Event | null,
    callback: (success: boolean) => void,
    count: number,
  ) => void;
  refine: () => void;
};

export type ShatterTCBtnController = ButtonModernController & {
  new (game: Game): ButtonModernController;
  doShatterAmt: (model: ButtonModel, amt: number) => void;
};

export type TechButtonController = BuildingNotStackableBtnController & {
  new (game: Game): TechButtonController;
};

export type Link = {
  visible: boolean;
  title: string;
  tooltip: string;
  getDisplayValueExt: () => string;
  handler: (event: Event, callback: (success: boolean) => void) => void;
};

export type TransformBtnController<TOptions = Record<string, unknown>> = ButtonModernController & {
  new (game: Game, options: TOptions): TransformBtnController<TOptions>;
  _transform: (model: ButtonModel, amt: number) => boolean;
  _newLink: (model: ButtonModel, divider: number) => Link;
  controllerOpts: TOptions;
};

export type ClassList = {
  diplomacy: {
    ui: {
      EmbassyButtonController: EmbassyButtonController;
    };
  };
  game: {
    ui: {
      GatherCatnipButtonController: GatherCatnipButtonController;
    };
  };
  ui: {
    BuildingBtnController: BuildingBtnController;
    ButtonController: ButtonController;
    ButtonModernController: ButtonModernController;
    BuildingStackableBtnController: BuildingStackableBtnController;
    PolicyBtnController: PolicyBtnController;
    religion: {
      RefineTearsBtnController: RefineTearsBtnController;
      TransformBtnController: TransformBtnController;
    };
    time: {
      FixCryochamberBtnController: FixCryochamberBtnController;
      ShatterTCBtnController: ShatterTCBtnController;
    };
  };
};

export type ComInterface = {
  nuclearunicorn: {
    game: {
      ui: {
        TechButtonController: TechButtonController;
      };
    };
  };
};

export type I18nEngine = (key: string, args?: Array<number | string>) => string;

declare global {
  const classes: ClassList;
  const com: ComInterface;
  const game: Game;
  let unsafeWindow: Window | undefined;
  interface Window {
    $: JQuery;
    $I?: Maybe<I18nEngine>;
    dojo: {
      clone: <T>(subject: T) => T;
      subscribe: <TEvent extends string>(
        event: TEvent,
        // biome-ignore lint/suspicious/noExplicitAny: Not our type.
        handler: (...args: Array<any>) => void,
      ) => [TEvent, number];
      unsubscribe: (handle: [string, number]) => void;
    };
    game?: Maybe<Game>;
    gamePage?: Maybe<Game>;
    kittenScientists?: KittenScientists;
    LZString: {
      compressToBase64: (input: string) => string;
      compressToUTF16: (input: string) => string;
      decompressFromBase64: (input: string) => string;
      decompressFromUTF16: (input: string) => string;
    };
  }
}

export * from "./buildings.js";
export * from "./game.js";
export * from "./releases.js";
export * from "./religion.js";
export * from "./save.js";
export * from "./science.js";
export * from "./space.js";
export * from "./time.js";
export * from "./trade.js";
export * from "./workshop.js";
