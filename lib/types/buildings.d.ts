import type { Game, Price } from "./index.js";
export declare const Buildings: readonly [
  "academy",
  "accelerator",
  "aiCore",
  "amphitheatre",
  "aqueduct",
  "barn",
  "biolab",
  "brewery",
  "calciner",
  "chapel",
  "chronosphere",
  "factory",
  "field",
  "harbor",
  "hut",
  "library",
  "logHouse",
  "lumberMill",
  "magneto",
  "mansion",
  "mine",
  "mint",
  "observatory",
  "oilWell",
  "pasture",
  "quarry",
  "reactor",
  "smelter",
  "steamworks",
  "temple",
  "tradepost",
  "unicornPasture",
  "warehouse",
  "workshop",
  "zebraForge",
  "zebraOutpost",
  "zebraWorkshop",
  "ziggurat",
];
export type Building = (typeof Buildings)[number];
export declare const StagedBuildings: readonly [
  "broadcasttower",
  "dataCenter",
  "hydroplant",
  "solarfarm",
  "spaceport",
];
export type StagedBuilding = (typeof StagedBuildings)[number];
export type BuildingEffects = {
  academyMeteorBonus: number;
  aiLevel: number;
  alicornPerTickCon: number;
  bloodstoneRatio: number;
  cathPollutionPerTickCon: number;
  cathPollutionPerTickProd: number;
  catnipDemandRatio: number;
  catnipMax: number;
  catnipPerTickBase: number;
  catnipPerTickCon: number;
  catnipRatio: number;
  coalMax: number;
  coalPerTickAutoprod: number;
  coalPerTickBase: number;
  coalPerTickCon: number;
  coalRatioGlobal: number;
  craftRatio: number;
  cultureMax: number;
  cultureMaxRatio: number;
  culturePerTickBase: number;
  energyConsumption: number;
  energyProduction: number;
  faithMax: number;
  faithPerTickBase: number;
  festivalArrivalRatio: number;
  festivalRatio: number;
  fursDemandRatio: number;
  fursPerTickProd: number;
  gflopsPerTickBase: number;
  goldMax: number;
  goldPerTickAutoprod: number;
  goldPerTickCon: number;
  happiness: number;
  hunterRatio: number;
  ironMax: number;
  ironPerTickAutoprod: number;
  ironPerTickCon: number;
  ivoryDemandRatio: number;
  ivoryPerTickCon: number;
  ivoryPerTickProd: number;
  magnetoBoostRatio: number;
  magnetoRatio: number;
  manpowerMax: number;
  manpowerPerTickCon: number;
  manuscriptPerTickProd: number;
  maxKittens: number;
  mineralsMax: number;
  mineralsPerTickCon: number;
  mineralsPerTickProd: number;
  mineralsRatio: number;
  oilMax: number;
  oilPerTick: number;
  oilPerTickBase: number;
  oilPerTickCon: number;
  oilPerTickProd: number;
  productionRatio: number;
  refineRatio: number;
  resStasisRatio: number;
  scienceMax: number;
  scienceRatio: number;
  skillXP: number;
  spiceDemandRatio: number;
  spicePerTickCon: number;
  standingRatio: number;
  starAutoSuccessChance: number;
  starEventChance: number;
  steelPerTickProd: number;
  tMythrilCraftRatio: number;
  tMythrilPerTick: number;
  temporalFluxProduction: number;
  thoriumPerTick: number;
  titaniumMax: number;
  titaniumPerTickAutoprod: number;
  titaniumPerTickCon: number;
  tradeRatio: number;
  unhappinessRatio: number;
  unicornsPerTickBase: number;
  uraniumMax: number;
  uraniumPerTick: number;
  uraniumPerTickAutoprod: number;
  uraniumPerTickBase: number;
  woodMax: number;
  woodPerTickCon: number;
  woodRatio: number;
  zebraPreparations: number;
  activeHG: number;
  alicornChance: number;
  alicornPerTick: number;
  blackLibraryBonus: number;
  blsCorruptionRatio: number;
  blsLimit: number;
  compendiaTTBoostRatio: number;
  corruptionBoostRatio: number;
  corruptionRatio: number;
  cultureMaxRatioBonus: number;
  deficitRecoveryRatio: number;
  energyProductionRatio: number;
  faithRatioReligion: number;
  globalResourceRatio: number;
  goldMaxRatio: number;
  ivoryMeteorChance: number;
  ivoryMeteorRatio: number;
  maxKittensRatio: number;
  necrocornPerDay: number;
  pactBlackLibraryBoost: number;
  pactDeficitRecoveryRatio: number;
  pactFaithRatio: number;
  pactGlobalProductionRatio: number;
  pactGlobalResourceRatio: number;
  pactSpaceCompendiumRatio: number;
  pactsAvailable: number;
  pyramidFaithRatio: number;
  pyramidGlobalProductionRatio: number;
  pyramidGlobalResourceRatio: number;
  pyramidRecoveryRatio: number;
  pyramidSpaceCompendiumRatio: number;
  relicRefineRatio: number;
  riftChance: number;
  rrRatio: number;
  simScalingRatio: number;
  solarRevolutionLimit: number;
  solarRevolutionRatio: number;
  tcRefineRatio: number;
  timeRatio: number;
  unicornsRatioReligion: number;
  acceleratorRatio: number;
  barnRatio: number;
  beaconRelicsPerDay: number;
  biofuelRatio: number;
  broadcastTowerRatio: number;
  cadBlueprintCraftRatio: number;
  calcinerRatio: number;
  calcinerSteelCraftRatio: number;
  calcinerSteelRatio: number;
  calcinerSteelReactorBonus: number;
  catnipDemandWorkerRatioGlobal: number;
  catnipJobRatio: number;
  catnipMaxRatio: number;
  coalRatioGlobalReduction: number;
  coalSuperRatio: number;
  crackerRatio: number;
  dataCenterAIRatio: number;
  eludiumAutomationBonus: number;
  factoryRefineRatio: number;
  harborCoalRatio: number;
  harborRatio: number;
  hutPriceRatio: number;
  hydroPlantRatio: number;
  libraryRatio: number;
  lumberMillRatio: number;
  lunarOutpostRatio: number;
  manpowerJobRatio: number;
  oilWellRatio: number;
  queueCap: number;
  reactorEnergyRatio: number;
  reactorThoriumPerTick: number;
  routeSpeed: number;
  satnavRatio: number;
  shipLimit: number;
  skillMultiplier: number;
  smelterRatio: number;
  solarFarmRatio: number;
  solarFarmSeasonRatio: number;
  spaceScienceRatio: number;
  starchartGlobalRatio: number;
  t1CraftRatio: number;
  t2CraftRatio: number;
  t3CraftRatio: number;
  t4CraftRatio: number;
  t5CraftRatio: number;
  temporalFluxProductionChronosphere: number;
  temporalParadoxDayBonus: number;
  unicornsGlobalRatio: number;
  uplinkDCRatio: number;
  uplinkLabRatio: number;
  uraniumRatio: number;
  warehouseRatio: number;
  woodJobRatio: number;
  goldPriceRatio: number;
  happinessKittenProductionRatio: number;
  heatMax: number;
  heatPerTick: number;
  observatoryRatio: number;
  starchartPerTickBaseSpace: number;
  temporalFluxMax: number;
  unobtainiumPerTickSpace: number;
  uraniumPerTickCon: number;
};
export type BuildingMeta = {
  calculateEffects?: (model: unknown, game: Game) => void;
  description?: string;
  effects?: Partial<BuildingEffects>;
  flavor?: string;
  label?: string;
  name: Building;
  noStackable?: boolean;
  on: number;
  priceRatio?: number;
  prices?: Array<Price>;
  stage?: number;
  stages?: Array<{
    calculateEffects?: (model: unknown, game: Game) => void;
    calculateEnergyProduction?: (game: Game, season: unknown) => void;
    description: string;
    effects?: Partial<BuildingEffects>;
    flavor?: string;
    label: string;
    priceRatio: number;
    prices: Array<Price>;
    stageUnlocked: boolean;
  }>;
  unlockRatio?: number;
  unlockable?: boolean;
  unlocked: boolean;
  /**
   * How many of these do you have?
   */
  val: number;
};
export type BuildingExt = {
  meta: BuildingMeta;
};
//# sourceMappingURL=buildings.d.ts.map
