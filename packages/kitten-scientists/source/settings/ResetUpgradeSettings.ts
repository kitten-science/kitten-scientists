import { consumeEntriesPedantic } from "../tools/Entries";
import { isNil, Maybe } from "../tools/Maybe";
import { Upgrade } from "../types";
import { Setting } from "./Settings";

export class ResetUpgradeSetting extends Setting {
  readonly #upgrade: Upgrade;

  get upgrade() {
    return this.#upgrade;
  }

  constructor(upgrade: Upgrade, enabled = false) {
    super(enabled);
    this.#upgrade = upgrade;
  }
}

export class ResetUpgradeSettings extends Setting {
  readonly upgrades: Record<Upgrade, ResetUpgradeSetting>;

  constructor(
    enabled = false,
    upgrades: Record<Upgrade, ResetUpgradeSetting> = {
      advancedAutomation: new ResetUpgradeSetting("advancedAutomation", false),
      advancedRefinement: new ResetUpgradeSetting("advancedRefinement", false),
      aiBases: new ResetUpgradeSetting("aiBases", false),
      aiEngineers: new ResetUpgradeSetting("aiEngineers", false),
      alloyArmor: new ResetUpgradeSetting("alloyArmor", false),
      alloyAxe: new ResetUpgradeSetting("alloyAxe", false),
      alloyBarns: new ResetUpgradeSetting("alloyBarns", false),
      alloySaw: new ResetUpgradeSetting("alloySaw", false),
      alloyWarehouses: new ResetUpgradeSetting("alloyWarehouses", false),
      amBases: new ResetUpgradeSetting("amBases", false),
      amDrive: new ResetUpgradeSetting("amDrive", false),
      amFission: new ResetUpgradeSetting("amFission", false),
      amReactors: new ResetUpgradeSetting("amReactors", false),
      amReactorsMK2: new ResetUpgradeSetting("amReactorsMK2", false),
      assistance: new ResetUpgradeSetting("assistance", false),
      astrolabe: new ResetUpgradeSetting("astrolabe", false),
      astrophysicists: new ResetUpgradeSetting("astrophysicists", false),
      augumentation: new ResetUpgradeSetting("augumentation", false),
      automatedPlants: new ResetUpgradeSetting("automatedPlants", false),
      barges: new ResetUpgradeSetting("barges", false),
      biofuel: new ResetUpgradeSetting("biofuel", false),
      bolas: new ResetUpgradeSetting("bolas", false),
      cadSystems: new ResetUpgradeSetting("cadSystems", false),
      caravanserai: new ResetUpgradeSetting("caravanserai", false),
      carbonSequestration: new ResetUpgradeSetting("carbonSequestration", false),
      cargoShips: new ResetUpgradeSetting("cargoShips", false),
      celestialMechanics: new ResetUpgradeSetting("celestialMechanics", false),
      chronoEngineers: new ResetUpgradeSetting("chronoEngineers", false),
      chronoforge: new ResetUpgradeSetting("chronoforge", false),
      coalFurnace: new ResetUpgradeSetting("coalFurnace", false),
      coldFusion: new ResetUpgradeSetting("coldFusion", false),
      combustionEngine: new ResetUpgradeSetting("combustionEngine", false),
      compositeBow: new ResetUpgradeSetting("compositeBow", false),
      concreteBarns: new ResetUpgradeSetting("concreteBarns", false),
      concreteHuts: new ResetUpgradeSetting("concreteHuts", false),
      concreteWarehouses: new ResetUpgradeSetting("concreteWarehouses", false),
      crossbow: new ResetUpgradeSetting("crossbow", false),
      cryocomputing: new ResetUpgradeSetting("cryocomputing", false),
      darkEnergy: new ResetUpgradeSetting("darkEnergy", false),
      deepMining: new ResetUpgradeSetting("deepMining", false),
      distorsion: new ResetUpgradeSetting("distorsion", false),
      electrolyticSmelting: new ResetUpgradeSetting("electrolyticSmelting", false),
      eludiumCracker: new ResetUpgradeSetting("eludiumCracker", false),
      eludiumHuts: new ResetUpgradeSetting("eludiumHuts", false),
      eludiumReflectors: new ResetUpgradeSetting("eludiumReflectors", false),
      energyRifts: new ResetUpgradeSetting("energyRifts", false),
      enrichedThorium: new ResetUpgradeSetting("enrichedThorium", false),
      enrichedUranium: new ResetUpgradeSetting("enrichedUranium", false),
      factoryAutomation: new ResetUpgradeSetting("factoryAutomation", false),
      factoryLogistics: new ResetUpgradeSetting("factoryLogistics", false),
      factoryOptimization: new ResetUpgradeSetting("factoryOptimization", false),
      factoryProcessing: new ResetUpgradeSetting("factoryProcessing", false),
      factoryRobotics: new ResetUpgradeSetting("factoryRobotics", false),
      fluidizedReactors: new ResetUpgradeSetting("fluidizedReactors", false),
      fluxCondensator: new ResetUpgradeSetting("fluxCondensator", false),
      fuelInjectors: new ResetUpgradeSetting("fuelInjectors", false),
      geodesy: new ResetUpgradeSetting("geodesy", false),
      gmo: new ResetUpgradeSetting("gmo", false),
      goldOre: new ResetUpgradeSetting("goldOre", false),
      hubbleTelescope: new ResetUpgradeSetting("hubbleTelescope", false),
      huntingArmor: new ResetUpgradeSetting("huntingArmor", false),
      hydroPlantTurbines: new ResetUpgradeSetting("hydroPlantTurbines", false),
      internet: new ResetUpgradeSetting("internet", false),
      invisibleBlackHand: new ResetUpgradeSetting("invisibleBlackHand", false),
      ironAxes: new ResetUpgradeSetting("ironAxes", false),
      ironHoes: new ResetUpgradeSetting("ironHoes", false),
      ironwood: new ResetUpgradeSetting("ironwood", false),
      lhc: new ResetUpgradeSetting("lhc", false),
      logistics: new ResetUpgradeSetting("logistics", false),
      longRangeSpaceships: new ResetUpgradeSetting("longRangeSpaceships", false),
      machineLearning: new ResetUpgradeSetting("machineLearning", false),
      mineralAxes: new ResetUpgradeSetting("mineralAxes", false),
      mineralHoes: new ResetUpgradeSetting("mineralHoes", false),
      miningDrill: new ResetUpgradeSetting("miningDrill", false),
      mWReactor: new ResetUpgradeSetting("mWReactor", false),
      nanosuits: new ResetUpgradeSetting("nanosuits", false),
      neuralNetworks: new ResetUpgradeSetting("neuralNetworks", false),
      nuclearPlants: new ResetUpgradeSetting("nuclearPlants", false),
      nuclearSmelters: new ResetUpgradeSetting("nuclearSmelters", false),
      offsetPress: new ResetUpgradeSetting("offsetPress", false),
      oilDistillation: new ResetUpgradeSetting("oilDistillation", false),
      oilRefinery: new ResetUpgradeSetting("oilRefinery", false),
      orbitalGeodesy: new ResetUpgradeSetting("orbitalGeodesy", false),
      oxidation: new ResetUpgradeSetting("oxidation", false),
      photolithography: new ResetUpgradeSetting("photolithography", false),
      photovoltaic: new ResetUpgradeSetting("photovoltaic", false),
      pneumaticPress: new ResetUpgradeSetting("pneumaticPress", false),
      printingPress: new ResetUpgradeSetting("printingPress", false),
      pumpjack: new ResetUpgradeSetting("pumpjack", false),
      pyrolysis: new ResetUpgradeSetting("pyrolysis", false),
      qdot: new ResetUpgradeSetting("qdot", false),
      railgun: new ResetUpgradeSetting("railgun", false),
      reactorVessel: new ResetUpgradeSetting("reactorVessel", false),
      refrigeration: new ResetUpgradeSetting("refrigeration", false),
      register: new ResetUpgradeSetting("register", false),
      reinforcedBarns: new ResetUpgradeSetting("reinforcedBarns", false),
      reinforcedSaw: new ResetUpgradeSetting("reinforcedSaw", false),
      reinforcedWarehouses: new ResetUpgradeSetting("reinforcedWarehouses", false),
      relicStation: new ResetUpgradeSetting("relicStation", false),
      rotaryKiln: new ResetUpgradeSetting("rotaryKiln", false),
      satelliteRadio: new ResetUpgradeSetting("satelliteRadio", false),
      satnav: new ResetUpgradeSetting("satnav", false),
      seti: new ResetUpgradeSetting("seti", false),
      silos: new ResetUpgradeSetting("silos", false),
      solarSatellites: new ResetUpgradeSetting("solarSatellites", false),
      spaceEngineers: new ResetUpgradeSetting("spaceEngineers", false),
      spaceManufacturing: new ResetUpgradeSetting("spaceManufacturing", false),
      spiceNavigation: new ResetUpgradeSetting("spiceNavigation", false),
      starlink: new ResetUpgradeSetting("starlink", false),
      stasisChambers: new ResetUpgradeSetting("stasisChambers", false),
      steelArmor: new ResetUpgradeSetting("steelArmor", false),
      steelAxe: new ResetUpgradeSetting("steelAxe", false),
      steelPlants: new ResetUpgradeSetting("steelPlants", false),
      steelSaw: new ResetUpgradeSetting("steelSaw", false),
      stoneBarns: new ResetUpgradeSetting("stoneBarns", false),
      storageBunkers: new ResetUpgradeSetting("storageBunkers", false),
      strenghtenBuild: new ResetUpgradeSetting("strenghtenBuild", false),
      tachyonAccelerators: new ResetUpgradeSetting("tachyonAccelerators", false),
      thinFilm: new ResetUpgradeSetting("thinFilm", false),
      thoriumEngine: new ResetUpgradeSetting("thoriumEngine", false),
      thoriumReactors: new ResetUpgradeSetting("thoriumReactors", false),
      titaniumAxe: new ResetUpgradeSetting("titaniumAxe", false),
      titaniumBarns: new ResetUpgradeSetting("titaniumBarns", false),
      titaniumMirrors: new ResetUpgradeSetting("titaniumMirrors", false),
      titaniumSaw: new ResetUpgradeSetting("titaniumSaw", false),
      titaniumWarehouses: new ResetUpgradeSetting("titaniumWarehouses", false),
      turnSmoothly: new ResetUpgradeSetting("turnSmoothly", false),
      unicornSelection: new ResetUpgradeSetting("unicornSelection", false),
      unobtainiumAxe: new ResetUpgradeSetting("unobtainiumAxe", false),
      unobtainiumDrill: new ResetUpgradeSetting("unobtainiumDrill", false),
      unobtainiumHuts: new ResetUpgradeSetting("unobtainiumHuts", false),
      unobtainiumReflectors: new ResetUpgradeSetting("unobtainiumReflectors", false),
      unobtainiumSaw: new ResetUpgradeSetting("unobtainiumSaw", false),
      uplink: new ResetUpgradeSetting("uplink", false),
      voidAspiration: new ResetUpgradeSetting("voidAspiration", false),
      voidEnergy: new ResetUpgradeSetting("voidEnergy", false),
      voidReactors: new ResetUpgradeSetting("voidReactors", false),
    }
  ) {
    super(enabled);
    this.upgrades = upgrades;
  }

  load(settings: Maybe<Partial<ResetUpgradeSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.upgrades, settings.upgrades, (upgrade, item) => {
      upgrade.enabled = item?.enabled ?? upgrade.enabled;
    });
  }
}
