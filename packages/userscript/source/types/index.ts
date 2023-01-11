import { Building, BuildingMeta } from "./buildings";
import { GamePage } from "./gamePage";
import {
  ReligionUpgrades,
  TranscendenceUpgradeInfo,
  TranscendenceUpgrades,
  ZiggurathUpgradeInfo,
  ZiggurathUpgrades,
} from "./religion";
import { TechInfo } from "./science";
import { SpaceBuildings } from "./space";
import { ChronoForgeUpgrades, VoidSpaceUpgradeInfo, VoidSpaceUpgrades } from "./time";
import { UpgradeInfo } from "./workshop";

export type Season = "autumn" | "spring" | "summer" | "winter";
export type Cycle =
  | "charon"
  | "umbra"
  | "yarn"
  | "helios"
  | "cath"
  | "redmoon"
  | "dune"
  | "piscine"
  | "terminus"
  | "kairo";

export type ResourceCraftable =
  | "alloy"
  | "beam"
  | "blueprint"
  | "compedium"
  | "concrate"
  | "eludium"
  | "gear"
  | "kerosene"
  | "manuscript"
  | "megalith"
  | "parchment"
  | "plate"
  | "scaffold"
  | "ship"
  | "slab"
  | "steel"
  | "tanker"
  | "thorium"
  | "wood";

export type Resource =
  | ResourceCraftable
  | "alicorn"
  | "antimatter"
  | "blackcoin"
  | "bloodstone"
  | "catnip"
  | "coal"
  | "culture"
  | "faith"
  | "furs"
  | "gold"
  | "iron"
  | "ivory"
  | "karma"
  | "kittens"
  | "manpower"
  | "minerals"
  | "necrocorn"
  | "oil"
  | "paragon"
  | "relic"
  | "science"
  | "slab"
  | "sorrow"
  | "spice"
  | "starchart"
  | "tears"
  | "temporalFlux"
  | "timeCrystal"
  | "titanium"
  | "unicorns"
  | "unobtainium"
  | "uranium"
  | "void"
  | "zebras";

export type TabId =
  | "Bonfire"
  | "Religion"
  | "Science"
  | "Space"
  | "Time"
  | "Trade"
  | "Village"
  | "Workshop";

export type Job =
  | "engineer"
  | "farmer"
  | "geologist"
  | "hunter"
  | "miner"
  | "priest"
  | "scholar"
  | "woodcutter";

export type Trait =
  | "chemist"
  | "engineer"
  | "manager"
  | "metallurgist"
  | "merchant"
  | "none"
  | "scientist"
  | "wise";

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
    | TransformBtnController
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
  new (game: GamePage, controllerOpts?: ButtonControllerOptions): ButtonController;
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
  buyItem: (model: ButtonModel, event: Event, callback: (success: boolean) => void) => void;
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
  new (game: GamePage): ButtonModernController;
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
  new (game: GamePage): BuildingBtnController;
};

export type BuildingNotStackableBtnController = BuildingBtnController & {
  new (game: GamePage): BuildingNotStackableBtnController;
};

export type BuildingStackableBtnController = BuildingBtnController & {
  new (game: GamePage): BuildingStackableBtnController;
  _buyItem_step2: (model: ButtonModel, event: Event, callback: (success: boolean) => void) => void;
  build: (model: ButtonModel, maxBld: number) => void;
  incrementValue: (model: ButtonModel) => void;
};

export type EmbassyButtonController = BuildingStackableBtnController & {
  new (game: GamePage): EmbassyButtonController;
};

export type FixCryochamberBtnController = ButtonModernController & {
  new (game: GamePage): EmbassyButtonController;
  doFixCryochamber: (model: ButtonModernModel) => boolean;
};

export type PolicyBtnController = BuildingNotStackableBtnController & {
  new (game: GamePage): PolicyBtnController;
  shouldBeBough: (model: ButtonModel, game: GamePage) => boolean;
};

export type RefineTearsBtnController = ButtonModernController & {
  new (game: GamePage): ButtonModernController;
  refine: () => void;
};

export type ShatterTCBtnController = ButtonModernController & {
  new (game: GamePage): ButtonModernController;
  doShatterAmt: (model: ButtonModel, amt: number) => void;
};

export type TechButtonController = BuildingNotStackableBtnController & {
  new (game: GamePage): TechButtonController;
};

export type TransformBtnController = ButtonModernController & {
  new (game: GamePage): TransformBtnController;
  _transform: (model: ButtonModel, amt: number) => boolean;
};

export type ClassList = {
  diplomacy: {
    ui: {
      EmbassyButtonController: EmbassyButtonController;
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
  const game: GamePage;
}

export * from "./buildings";
export * from "./gamePage";
export * from "./religion";
export * from "./science";
export * from "./space";
export * from "./time";
export * from "./trade";
export * from "./workshop";
