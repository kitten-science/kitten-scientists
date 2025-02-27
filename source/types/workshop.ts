import type { BuildingEffects, GameTab, Price, Unlocks } from "./index.js";

export const Upgrades = [
  "advancedAutomation",
  "advancedRefinement",
  "aiBases",
  "aiEngineers",
  "alloyArmor",
  "alloyAxe",
  "alloyBarns",
  "alloySaw",
  "alloyWarehouses",
  "amBases",
  "amDrive",
  "amFission",
  "amReactors",
  "amReactorsMK2",
  "assistance",
  "astrolabe",
  "astrophysicists",
  "augumentation",
  "automatedPlants",
  "barges",
  "biofuel",
  "bolas",
  "cadSystems",
  "caravanserai",
  "carbonSequestration",
  "cargoShips",
  "celestialMechanics",
  "chronoEngineers",
  "chronoforge",
  "coalFurnace",
  "coldFusion",
  "combustionEngine",
  "compositeBow",
  "concreteBarns",
  "concreteHuts",
  "concreteWarehouses",
  "crossbow",
  "cryocomputing",
  "darkEnergy",
  "deepMining",
  "distorsion",
  "electrolyticSmelting",
  "eludiumCracker",
  "eludiumHuts",
  "eludiumReflectors",
  "energyRifts",
  "enrichedThorium",
  "enrichedUranium",
  "factoryAutomation",
  "factoryLogistics",
  "factoryOptimization",
  "factoryProcessing",
  "factoryRobotics",
  "fluidizedReactors",
  "fluxCondensator",
  "fuelInjectors",
  "geodesy",
  "gmo",
  "goldOre",
  "hubbleTelescope",
  "huntingArmor",
  "hydroPlantTurbines",
  "internet",
  "invisibleBlackHand",
  "ironAxes",
  "ironHoes",
  "ironwood",
  "lhc",
  "logistics",
  "longRangeSpaceships",
  "machineLearning",
  "mineralAxes",
  "mineralHoes",
  "miningDrill",
  "mWReactor",
  "nanosuits",
  "neuralNetworks",
  "nuclearPlants",
  "nuclearSmelters",
  "offsetPress",
  "oilDistillation",
  "oilRefinery",
  "orbitalGeodesy",
  "oxidation",
  "photolithography",
  "photovoltaic",
  "pneumaticPress",
  "printingPress",
  "pumpjack",
  "pyrolysis",
  "qdot",
  "railgun",
  "reactorVessel",
  "refrigeration",
  "register",
  "reinforcedBarns",
  "reinforcedSaw",
  "reinforcedWarehouses",
  "relicStation",
  "rotaryKiln",
  "satelliteRadio",
  "satnav",
  "seti",
  "silos",
  "solarSatellites",
  "spaceEngineers",
  "spaceManufacturing",
  "spiceNavigation",
  "starlink",
  "stasisChambers",
  "steelArmor",
  "steelAxe",
  "steelPlants",
  "steelSaw",
  "stoneBarns",
  "storageBunkers",
  "strenghtenBuild",
  "tachyonAccelerators",
  "thinFilm",
  "thoriumEngine",
  "thoriumReactors",
  "titaniumAxe",
  "titaniumBarns",
  "titaniumMirrors",
  "titaniumSaw",
  "titaniumWarehouses",
  "turnSmoothly",
  "unicornSelection",
  "unobtainiumAxe",
  "unobtainiumDrill",
  "unobtainiumHuts",
  "unobtainiumReflectors",
  "unobtainiumSaw",
  "uplink",
  "voidAspiration",
  "voidEnergy",
  "voidReactors",
] as const;
export type Upgrade = (typeof Upgrades)[number];

export type UpgradeInfo = {
  description: string;
  effects?: Partial<BuildingEffects>;
  label: string;
  name: Upgrade;
  prices: Array<Price>;
  researched: boolean;
  unlocked: boolean;
  unlocks?: Partial<Unlocks>;
};

export type WorkshopTab = GameTab;
