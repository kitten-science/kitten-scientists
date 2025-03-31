import type {
  BuildingStackableBtn,
  BuildingStackableBtnController,
  Panel,
  Tab,
  TabManager,
  UnsafeBuildingBtnModel,
  UnsafeBuildingStackableBtnModel,
} from "./core.js";
import type { GamePage } from "./game.js";
import type {
  BuildingEffect,
  Mission,
  Planet,
  Price,
  SpaceBuilding,
  Technology,
  Unlocks,
  UnsafeBuyItemResult,
  UnsafeMeta,
} from "./index.js";
import type { RorshachWgt } from "./void.js";

export type SpaceManager = TabManager<
  UnsafeMeta<UnsafeSpaceProgram> | UnsafeMeta<UnsafeSpaceBuilding>
> & {
  game: GamePage;
  hideResearched: boolean;
  spaceBuildingsMap: Array<unknown>;
  programs: Array<UnsafeSpaceProgram>;
  planets: Array<UnsafePlanet>;
  metaCache: Record<SpaceBuilding, Required<UnsafeSpaceBuilding>>;
  new (game: GamePage): SpaceManager;
  resetState: () => void;
  save: (saveData: unknown) => void;
  load: (saveData: unknown) => void;
  update: () => void;
  fastforward: (daysOffset: number) => void;
  getProgram: (name: Mission) => UnsafeSpaceProgram;
  getBuilding: <TSpaceBuilding extends SpaceBuilding>(
    name: TSpaceBuilding,
  ) => SpaceManager["metaCache"][TSpaceBuilding];
  getPlanet: (name: Planet) => UnsafePlanet;
  getAutoProductionRatio: (useTransferBonus: boolean) => number;
  unlockAll: () => void;
  getEffect: (effectName: BuildingEffect) => number;
};

export type SpaceProgramBtnController<TModel extends UnsafeBuildingBtnModel> =
  BuildingStackableBtnController<TModel> & {
    getMetadata: (model: TModel) => UnsafeSpaceProgram;
    getPrices: (model: TModel) => Array<Price>;
    updateVisible: (model: TModel) => void;
    updateEnabled: (model: TModel) => void;
    getName: (model: TModel) => string;
    buyItem: (model: TModel, event: unknown) => UnsafeBuyItemResult;
    build: (model: TModel, maxBld: unknown) => number;
  };

export type PlanetBuildingBtnController<
  TModel extends UnsafeBuildingStackableBtnModel | unknown = unknown,
> = BuildingStackableBtnController<TModel> & {
  getMetadata: (model: TModel) => UnsafePlanet;
  hasSellLink: (model: unknown) => boolean;
  getPrices: (model: TModel) => Array<Price>;
};

export type PlanetPanel = Panel<
  BuildingStackableBtn<{
    id: SpaceBuilding;
    planet: UnsafePlanet;
    controller: PlanetBuildingBtnController<
      UnsafeBuildingStackableBtnModel<UnsafeSpaceProgramButtonOptions>
    >;
  }>
> & {
  planet: UnsafePlanet;
  render: () => ReturnType<Panel["render"]>;
  update: () => void;
};

export type FurthestRingPanel = PlanetPanel & {
  new (title: unknown, manager: unknown, game: GamePage): FurthestRingPanel;
  game: GamePage;
  render: (container?: HTMLElement) => ReturnType<PlanetPanel["render"]>;
};

export type SpaceTab = Tab<Panel<RorshachWgt>> & {
  GCPanel: Panel<BuildingStackableBtn<UnsafeSpaceProgramButtonOptions>> | null;
  planetPanels: Array<PlanetPanel | FurthestRingPanel> | null;
  aPanel: PlanetPanel;
  render: (container?: HTMLElement) => void;
  container?: HTMLElement;
  update: () => void;
};

export type UnsafeSpaceProgram = {
  name: Mission;
  label: string;
  description: string;
  prices: Array<Price>;
  unlocks: Partial<Unlocks>;

  unlocked?: boolean;
  val?: number;
  on?: number;
  noStackable?: boolean;
  isAutomationEnabled?: boolean | null;
  lackResConvert?: boolean;
  toggleable?: boolean;
};

export type UnsafePlanet = {
  name: Planet;
  label: string;
  routeDays: number;
  routeDaysDefault: number;
  buildings: Array<UnsafeSpaceBuilding>;
  calculateEffects: (self: unknown, game: GamePage) => void;

  unlocked?: boolean;
  reached?: boolean;

  val?: number;
  on?: number;
  noStackable?: boolean;
  isAutomationEnabled?: boolean | null;
  lackResConvert?: boolean;
  toggleable?: boolean;
};

export type UnsafeSpaceBuilding = {
  name: SpaceBuilding;
  /**
   * An internationalized label for this space building.
   */
  label: string;
  description: string;
  unlocked: boolean;
  priceRatio: number;
  prices: Array<Price>;
  requiredTech: Array<Technology>;
  effects: Partial<Record<BuildingEffect, number>>;
  calculateEffects: (self: UnsafeSpaceBuilding, game: GamePage) => void;
  unlockScheme?: { name: "arctic" | "dune" | "fluid" | "space" | "vessel"; threshold: number };
  breakIronWill?: boolean;
  action?: (self: UnsafeSpaceBuilding, game: GamePage) => number | undefined;
  unlocks?: Partial<Unlocks>;

  val?: number;
  on?: number;
  noStackable?: boolean;
  isAutomationEnabled?: boolean | null;
  lackResConvert?: boolean;
  toggleable?: boolean;
};

export type UnsafePlanetBuildingButtonOptions = {
  id: SpaceBuilding;
  planet: UnsafePlanet;
  controller: PlanetBuildingBtnController<UnsafeBuildingStackableBtnModel>;
};

export type UnsafeSpaceProgramButtonOptions = {
  id: Mission;
  controller: SpaceProgramBtnController<UnsafeBuildingStackableBtnModel>;
};
