import { difference } from "../tools/Array";
import { objectEntries } from "../tools/Entries";
import { cwarn } from "../tools/Log";
import { GamePage, Upgrade } from "../types";
import { Setting } from "./Settings";
import { SettingsSection } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

export class UpgradeSettings extends SettingsSection {
  items: {
    [item in Upgrade]: Setting;
  };

  constructor(
    id = "upgrades",
    enabled = false,
    items = {
      advancedAutomation: new Setting("advancedAutomation", true),
      advancedRefinement: new Setting("advancedRefinement", true),
      aiBases: new Setting("aiBases", true),
      aiEngineers: new Setting("aiEngineers", true),
      alloyArmor: new Setting("alloyArmor", true),
      alloyAxe: new Setting("alloyAxe", true),
      alloyBarns: new Setting("alloyBarns", true),
      alloySaw: new Setting("alloySaw", true),
      alloyWarehouses: new Setting("alloyWarehouses", true),
      amBases: new Setting("amBases", true),
      amDrive: new Setting("amDrive", true),
      amFission: new Setting("amFission", true),
      amReactors: new Setting("amReactors", true),
      amReactorsMK2: new Setting("amReactorsMK2", true),
      assistance: new Setting("assistance", true),
      astrolabe: new Setting("astrolabe", true),
      astrophysicists: new Setting("astrophysicists", true),
      augumentation: new Setting("augumentation", true),
      automatedPlants: new Setting("automatedPlants", true),
      barges: new Setting("barges", true),
      biofuel: new Setting("biofuel", true),
      bolas: new Setting("bolas", true),
      cadSystems: new Setting("cadSystems", true),
      caravanserai: new Setting("caravanserai", true),
      carbonSequestration: new Setting("carbonSequestration", true),
      cargoShips: new Setting("cargoShips", true),
      celestialMechanics: new Setting("celestialMechanics", true),
      chronoEngineers: new Setting("chronoEngineers", true),
      chronoforge: new Setting("chronoforge", true),
      coalFurnace: new Setting("coalFurnace", true),
      coldFusion: new Setting("coldFusion", true),
      combustionEngine: new Setting("combustionEngine", true),
      compositeBow: new Setting("compositeBow", true),
      concreteBarns: new Setting("concreteBarns", true),
      concreteHuts: new Setting("concreteHuts", true),
      concreteWarehouses: new Setting("concreteWarehouses", true),
      crossbow: new Setting("crossbow", true),
      cryocomputing: new Setting("cryocomputing", true),
      darkEnergy: new Setting("darkEnergy", true),
      deepMining: new Setting("deepMining", true),
      distorsion: new Setting("distorsion", true),
      electrolyticSmelting: new Setting("electrolyticSmelting", true),
      eludiumCracker: new Setting("eludiumCracker", true),
      eludiumHuts: new Setting("eludiumHuts", true),
      eludiumReflectors: new Setting("eludiumReflectors", true),
      energyRifts: new Setting("energyRifts", true),
      enrichedThorium: new Setting("enrichedThorium", true),
      enrichedUranium: new Setting("enrichedUranium", true),
      factoryAutomation: new Setting("factoryAutomation", true),
      factoryLogistics: new Setting("factoryLogistics", true),
      factoryOptimization: new Setting("factoryOptimization", true),
      factoryProcessing: new Setting("factoryProcessing", true),
      factoryRobotics: new Setting("factoryRobotics", true),
      fluidizedReactors: new Setting("fluidizedReactors", true),
      fluxCondensator: new Setting("fluxCondensator", true),
      fuelInjectors: new Setting("fuelInjectors", true),
      geodesy: new Setting("geodesy", true),
      gmo: new Setting("gmo", true),
      goldOre: new Setting("goldOre", true),
      hubbleTelescope: new Setting("hubbleTelescope", true),
      huntingArmor: new Setting("huntingArmor", true),
      hydroPlantTurbines: new Setting("hydroPlantTurbines", true),
      internet: new Setting("internet", true),
      invisibleBlackHand: new Setting("invisibleBlackHand", true),
      ironAxes: new Setting("ironAxes", true),
      ironHoes: new Setting("ironHoes", true),
      ironwood: new Setting("ironwood", true),
      lhc: new Setting("lhc", true),
      logistics: new Setting("logistics", true),
      longRangeSpaceships: new Setting("longRangeSpaceships", true),
      machineLearning: new Setting("machineLearning", true),
      mineralAxes: new Setting("mineralAxes", true),
      mineralHoes: new Setting("mineralHoes", true),
      miningDrill: new Setting("miningDrill", true),
      mWReactor: new Setting("mWReactor", true),
      nanosuits: new Setting("nanosuits", true),
      neuralNetworks: new Setting("neuralNetworks", true),
      nuclearPlants: new Setting("nuclearPlants", true),
      nuclearSmelters: new Setting("nuclearSmelters", true),
      offsetPress: new Setting("offsetPress", true),
      oilDistillation: new Setting("oilDistillation", true),
      oilRefinery: new Setting("oilRefinery", true),
      orbitalGeodesy: new Setting("orbitalGeodesy", true),
      oxidation: new Setting("oxidation", true),
      photolithography: new Setting("photolithography", true),
      photovoltaic: new Setting("photovoltaic", true),
      pneumaticPress: new Setting("pneumaticPress", true),
      printingPress: new Setting("printingPress", true),
      pumpjack: new Setting("pumpjack", true),
      pyrolysis: new Setting("pyrolysis", true),
      qdot: new Setting("qdot", true),
      railgun: new Setting("railgun", true),
      reactorVessel: new Setting("reactorVessel", true),
      refrigeration: new Setting("refrigeration", true),
      register: new Setting("register", true),
      reinforcedBarns: new Setting("reinforcedBarns", true),
      reinforcedSaw: new Setting("reinforcedSaw", true),
      reinforcedWarehouses: new Setting("reinforcedWarehouses", true),
      relicStation: new Setting("relicStation", true),
      rotaryKiln: new Setting("rotaryKiln", true),
      satelliteRadio: new Setting("satelliteRadio", true),
      satnav: new Setting("satnav", true),
      seti: new Setting("seti", true),
      silos: new Setting("silos", true),
      solarSatellites: new Setting("solarSatellites", true),
      spaceEngineers: new Setting("spaceEngineers", true),
      spaceManufacturing: new Setting("spaceManufacturing", true),
      spiceNavigation: new Setting("spiceNavigation", true),
      starlink: new Setting("starlink", true),
      stasisChambers: new Setting("stasisChambers", true),
      steelArmor: new Setting("steelArmor", true),
      steelAxe: new Setting("steelAxe", true),
      steelPlants: new Setting("steelPlants", true),
      steelSaw: new Setting("steelSaw", true),
      stoneBarns: new Setting("stoneBarns", true),
      storageBunkers: new Setting("storageBunkers", true),
      strenghtenBuild: new Setting("strenghtenBuild", true),
      tachyonAccelerators: new Setting("tachyonAccelerators", true),
      thinFilm: new Setting("thinFilm", true),
      thoriumEngine: new Setting("thoriumEngine", true),
      thoriumReactors: new Setting("thoriumReactors", true),
      titaniumAxe: new Setting("titaniumAxe", true),
      titaniumBarns: new Setting("titaniumBarns", true),
      titaniumMirrors: new Setting("titaniumMirrors", true),
      titaniumSaw: new Setting("titaniumSaw", true),
      titaniumWarehouses: new Setting("titaniumWarehouses", true),
      turnSmoothly: new Setting("turnSmoothly", true),
      unicornSelection: new Setting("unicornSelection", true),
      unobtainiumAxe: new Setting("unobtainiumAxe", true),
      unobtainiumDrill: new Setting("unobtainiumDrill", true),
      unobtainiumHuts: new Setting("unobtainiumHuts", true),
      unobtainiumReflectors: new Setting("unobtainiumReflectors", true),
      unobtainiumSaw: new Setting("unobtainiumSaw", true),
      uplink: new Setting("uplink", true),
      voidAspiration: new Setting("voidAspiration", true),
      voidEnergy: new Setting("voidEnergy", true),
      voidReactors: new Setting("voidReactors", true),
    }
  ) {
    super(id, enabled);
    this.items = items;
  }

  static validateGame(game: GamePage, settings: UpgradeSettings) {
    const inSettings = Object.keys(settings.items);
    const inGame = game.workshop.upgrades.map(upgrade => upgrade.name);

    const missingInSettings = difference(inGame, inSettings);
    const redundantInSettings = difference(inSettings, inGame);

    for (const upgrade of missingInSettings) {
      cwarn(`The workshop upgrade '${upgrade}' is not tracked in Kitten Scientists!`);
    }
    for (const upgrade of redundantInSettings) {
      cwarn(`The workshop upgrade '${upgrade}' is not an upgrade in Kitten Game!`);
    }
  }

  load(settings: UpgradeSettings) {
    this.enabled = settings.enabled;

    for (const [name, item] of objectEntries(settings.items)) {
      this.items[name].enabled = item.enabled;
    }
  }

  static toLegacyOptions(settings: UpgradeSettings, subject: KittenStorageType) {
    subject.items["toggle-upgrades"] = settings.enabled;

    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-upgrade-${name}` as const] = item.enabled;
    }
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new UpgradeSettings();
    options.enabled = subject.items["toggle-upgrades"] ?? options.enabled;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-upgrade-${name}` as const] ?? item.enabled;
    }

    return options;
  }
}
