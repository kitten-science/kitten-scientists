import { Building, BuildingMeta } from "./buildings.js";
import { Game } from "./game.js";
import {
  ReligionUpgrades,
  TranscendenceUpgradeInfo,
  TranscendenceUpgrades,
  ZiggurathUpgradeInfo,
  ZiggurathUpgrades,
} from "./religion.js";
import { TechInfo } from "./science.js";
import { SpaceBuildings } from "./space.js";
import { ChronoForgeUpgrades, VoidSpaceUpgradeInfo, VoidSpaceUpgrades } from "./time.js";
import { UpgradeInfo } from "./workshop.js";

export const SeasonArray = ["autumn", "spring", "summer", "winter"] as const;
export type Season = (typeof SeasonArray)[number];

export const CycleArray = [
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
export type Cycle = (typeof CycleArray)[number];

export const ResourceCraftableArray = [
  "alloy",
  "beam",
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
  "thorium",
  "wood",
] as const;
export type ResourceCraftable = (typeof ResourceCraftableArray)[number];

export const ResourceArray = [
  ...ResourceCraftableArray,
  "alicorn",
  "antimatter",
  "blackcoin",
  "bloodstone",
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
  "tMythril",
  "unicorns",
  "unobtainium",
  "uranium",
  "void",
  "wrappingPaper",
  "zebras",
] as const;
export type Resource = (typeof ResourceArray)[number];

export const TabIdArray = [
  "Bonfire",
  "Religion",
  "Science",
  "Space",
  "Time",
  "Trade",
  "Village",
  "Workshop",
] as const;
export type TabId = (typeof TabIdArray)[number];

export const JobArray = [
  "engineer",
  "farmer",
  "geologist",
  "hunter",
  "miner",
  "priest",
  "scholar",
  "woodcutter",
] as const;
export type Job = (typeof JobArray)[number];

export const TraitArray = [
  "chemist",
  "engineer",
  "manager",
  "metallurgist",
  "merchant",
  "none",
  "scientist",
  "wise",
] as const;
export type Trait = (typeof TraitArray)[number];

export type AllBuildings =
  | Building
  | ChronoForgeUpgrades
  | ReligionUpgrades
  | SpaceBuildings
  | TranscendenceUpgrades
  | VoidSpaceUpgrades
  | ZiggurathUpgrades;

/**
 * A combination of a resource and an amount.
 */
export type Price = { name: Resource; val: number };

export type Panel = {
  children: Array<BuildButton>;
  visible: boolean;
};

/**
 * Not necessarily a button, but a KG UI element.
 */
export type BuildButton<
  T = string,
  TModel extends ButtonModel = ButtonModel,
  TController =
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
> = {
  children: Array<BuildButton>;
  controller: TController;
  domNode: HTMLDivElement;
  id: T;
  model: TModel;
  onClick: () => void;
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
  | "pacifism"
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
  updateEnabled: (model: ButtonModel) => void;
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

declare global {
  const classes: ClassList;
  const com: ComInterface;
  const game: Game;
}

export * from "./buildings.js";
export * from "./game.js";
export * from "./religion.js";
export * from "./science.js";
export * from "./space.js";
export * from "./time.js";
export * from "./trade.js";
export * from "./workshop.js";
