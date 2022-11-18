import { difference } from "../tools/Array";
import { consumeEntriesPedantic, objectEntries } from "../tools/Entries";
import { cwarn } from "../tools/Log";
import { isNil, Maybe } from "../tools/Maybe";
import { GamePage, Upgrade } from "../types";
import { Setting } from "./Settings";
import { LegacyStorage } from "./SettingsStorage";

export class UpgradeSetting extends Setting {
  readonly upgrade: Upgrade;

  constructor(upgrade: Upgrade, enabled = false) {
    super(enabled);
    this.upgrade = upgrade;
  }
}

export type UpgradeUpgradeSettings = Record<Upgrade, UpgradeSetting>;

export class UpgradeSettings extends Setting {
  upgrades: UpgradeUpgradeSettings;

  constructor(
    enabled = false,
    upgrades: UpgradeUpgradeSettings = {
      advancedAutomation: new UpgradeSetting("advancedAutomation", true),
      advancedRefinement: new UpgradeSetting("advancedRefinement", true),
      aiBases: new UpgradeSetting("aiBases", true),
      aiEngineers: new UpgradeSetting("aiEngineers", true),
      alloyArmor: new UpgradeSetting("alloyArmor", true),
      alloyAxe: new UpgradeSetting("alloyAxe", true),
      alloyBarns: new UpgradeSetting("alloyBarns", true),
      alloySaw: new UpgradeSetting("alloySaw", true),
      alloyWarehouses: new UpgradeSetting("alloyWarehouses", true),
      amBases: new UpgradeSetting("amBases", true),
      amDrive: new UpgradeSetting("amDrive", true),
      amFission: new UpgradeSetting("amFission", true),
      amReactors: new UpgradeSetting("amReactors", true),
      amReactorsMK2: new UpgradeSetting("amReactorsMK2", true),
      assistance: new UpgradeSetting("assistance", true),
      astrolabe: new UpgradeSetting("astrolabe", true),
      astrophysicists: new UpgradeSetting("astrophysicists", true),
      augumentation: new UpgradeSetting("augumentation", true),
      automatedPlants: new UpgradeSetting("automatedPlants", true),
      barges: new UpgradeSetting("barges", true),
      biofuel: new UpgradeSetting("biofuel", true),
      bolas: new UpgradeSetting("bolas", true),
      cadSystems: new UpgradeSetting("cadSystems", true),
      caravanserai: new UpgradeSetting("caravanserai", true),
      carbonSequestration: new UpgradeSetting("carbonSequestration", true),
      cargoShips: new UpgradeSetting("cargoShips", true),
      celestialMechanics: new UpgradeSetting("celestialMechanics", true),
      chronoEngineers: new UpgradeSetting("chronoEngineers", true),
      chronoforge: new UpgradeSetting("chronoforge", true),
      coalFurnace: new UpgradeSetting("coalFurnace", true),
      coldFusion: new UpgradeSetting("coldFusion", true),
      combustionEngine: new UpgradeSetting("combustionEngine", true),
      compositeBow: new UpgradeSetting("compositeBow", true),
      concreteBarns: new UpgradeSetting("concreteBarns", true),
      concreteHuts: new UpgradeSetting("concreteHuts", true),
      concreteWarehouses: new UpgradeSetting("concreteWarehouses", true),
      crossbow: new UpgradeSetting("crossbow", true),
      cryocomputing: new UpgradeSetting("cryocomputing", true),
      darkEnergy: new UpgradeSetting("darkEnergy", true),
      deepMining: new UpgradeSetting("deepMining", true),
      distorsion: new UpgradeSetting("distorsion", true),
      electrolyticSmelting: new UpgradeSetting("electrolyticSmelting", true),
      eludiumCracker: new UpgradeSetting("eludiumCracker", true),
      eludiumHuts: new UpgradeSetting("eludiumHuts", true),
      eludiumReflectors: new UpgradeSetting("eludiumReflectors", true),
      energyRifts: new UpgradeSetting("energyRifts", true),
      enrichedThorium: new UpgradeSetting("enrichedThorium", true),
      enrichedUranium: new UpgradeSetting("enrichedUranium", true),
      factoryAutomation: new UpgradeSetting("factoryAutomation", true),
      factoryLogistics: new UpgradeSetting("factoryLogistics", true),
      factoryOptimization: new UpgradeSetting("factoryOptimization", true),
      factoryProcessing: new UpgradeSetting("factoryProcessing", true),
      factoryRobotics: new UpgradeSetting("factoryRobotics", true),
      fluidizedReactors: new UpgradeSetting("fluidizedReactors", true),
      fluxCondensator: new UpgradeSetting("fluxCondensator", true),
      fuelInjectors: new UpgradeSetting("fuelInjectors", true),
      geodesy: new UpgradeSetting("geodesy", true),
      gmo: new UpgradeSetting("gmo", true),
      goldOre: new UpgradeSetting("goldOre", true),
      hubbleTelescope: new UpgradeSetting("hubbleTelescope", true),
      huntingArmor: new UpgradeSetting("huntingArmor", true),
      hydroPlantTurbines: new UpgradeSetting("hydroPlantTurbines", true),
      internet: new UpgradeSetting("internet", true),
      invisibleBlackHand: new UpgradeSetting("invisibleBlackHand", true),
      ironAxes: new UpgradeSetting("ironAxes", true),
      ironHoes: new UpgradeSetting("ironHoes", true),
      ironwood: new UpgradeSetting("ironwood", true),
      lhc: new UpgradeSetting("lhc", true),
      logistics: new UpgradeSetting("logistics", true),
      longRangeSpaceships: new UpgradeSetting("longRangeSpaceships", true),
      machineLearning: new UpgradeSetting("machineLearning", true),
      mineralAxes: new UpgradeSetting("mineralAxes", true),
      mineralHoes: new UpgradeSetting("mineralHoes", true),
      miningDrill: new UpgradeSetting("miningDrill", true),
      mWReactor: new UpgradeSetting("mWReactor", true),
      nanosuits: new UpgradeSetting("nanosuits", true),
      neuralNetworks: new UpgradeSetting("neuralNetworks", true),
      nuclearPlants: new UpgradeSetting("nuclearPlants", true),
      nuclearSmelters: new UpgradeSetting("nuclearSmelters", true),
      offsetPress: new UpgradeSetting("offsetPress", true),
      oilDistillation: new UpgradeSetting("oilDistillation", true),
      oilRefinery: new UpgradeSetting("oilRefinery", true),
      orbitalGeodesy: new UpgradeSetting("orbitalGeodesy", true),
      oxidation: new UpgradeSetting("oxidation", true),
      photolithography: new UpgradeSetting("photolithography", true),
      photovoltaic: new UpgradeSetting("photovoltaic", true),
      pneumaticPress: new UpgradeSetting("pneumaticPress", true),
      printingPress: new UpgradeSetting("printingPress", true),
      pumpjack: new UpgradeSetting("pumpjack", true),
      pyrolysis: new UpgradeSetting("pyrolysis", true),
      qdot: new UpgradeSetting("qdot", true),
      railgun: new UpgradeSetting("railgun", true),
      reactorVessel: new UpgradeSetting("reactorVessel", true),
      refrigeration: new UpgradeSetting("refrigeration", true),
      register: new UpgradeSetting("register", true),
      reinforcedBarns: new UpgradeSetting("reinforcedBarns", true),
      reinforcedSaw: new UpgradeSetting("reinforcedSaw", true),
      reinforcedWarehouses: new UpgradeSetting("reinforcedWarehouses", true),
      relicStation: new UpgradeSetting("relicStation", true),
      rotaryKiln: new UpgradeSetting("rotaryKiln", true),
      satelliteRadio: new UpgradeSetting("satelliteRadio", true),
      satnav: new UpgradeSetting("satnav", true),
      seti: new UpgradeSetting("seti", true),
      silos: new UpgradeSetting("silos", true),
      solarSatellites: new UpgradeSetting("solarSatellites", true),
      spaceEngineers: new UpgradeSetting("spaceEngineers", true),
      spaceManufacturing: new UpgradeSetting("spaceManufacturing", true),
      spiceNavigation: new UpgradeSetting("spiceNavigation", true),
      starlink: new UpgradeSetting("starlink", true),
      stasisChambers: new UpgradeSetting("stasisChambers", true),
      steelArmor: new UpgradeSetting("steelArmor", true),
      steelAxe: new UpgradeSetting("steelAxe", true),
      steelPlants: new UpgradeSetting("steelPlants", true),
      steelSaw: new UpgradeSetting("steelSaw", true),
      stoneBarns: new UpgradeSetting("stoneBarns", true),
      storageBunkers: new UpgradeSetting("storageBunkers", true),
      strenghtenBuild: new UpgradeSetting("strenghtenBuild", true),
      tachyonAccelerators: new UpgradeSetting("tachyonAccelerators", true),
      thinFilm: new UpgradeSetting("thinFilm", true),
      thoriumEngine: new UpgradeSetting("thoriumEngine", true),
      thoriumReactors: new UpgradeSetting("thoriumReactors", true),
      titaniumAxe: new UpgradeSetting("titaniumAxe", true),
      titaniumBarns: new UpgradeSetting("titaniumBarns", true),
      titaniumMirrors: new UpgradeSetting("titaniumMirrors", true),
      titaniumSaw: new UpgradeSetting("titaniumSaw", true),
      titaniumWarehouses: new UpgradeSetting("titaniumWarehouses", true),
      turnSmoothly: new UpgradeSetting("turnSmoothly", true),
      unicornSelection: new UpgradeSetting("unicornSelection", true),
      unobtainiumAxe: new UpgradeSetting("unobtainiumAxe", true),
      unobtainiumDrill: new UpgradeSetting("unobtainiumDrill", true),
      unobtainiumHuts: new UpgradeSetting("unobtainiumHuts", true),
      unobtainiumReflectors: new UpgradeSetting("unobtainiumReflectors", true),
      unobtainiumSaw: new UpgradeSetting("unobtainiumSaw", true),
      uplink: new UpgradeSetting("uplink", true),
      voidAspiration: new UpgradeSetting("voidAspiration", true),
      voidEnergy: new UpgradeSetting("voidEnergy", true),
      voidReactors: new UpgradeSetting("voidReactors", true),
    }
  ) {
    super(enabled);
    this.upgrades = upgrades;
  }

  static validateGame(game: GamePage, settings: UpgradeSettings) {
    const inSettings = Object.keys(settings.upgrades);
    const inGame = game.workshop.upgrades.map(upgrade => upgrade.name);

    const missingInSettings = difference(inGame, inSettings);
    const redundantInSettings = difference(inSettings, inGame);

    for (const upgrade of missingInSettings) {
      cwarn(`The workshop upgrade '${upgrade}' is not tracked in Kitten Scientists!`);
    }
    for (const upgrade of redundantInSettings) {
      cwarn(`The workshop upgrade '${upgrade}' is not an upgrade in Kittens Game!`);
    }
  }

  load(settings: Maybe<Partial<UpgradeSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.upgrades, settings.upgrades, (upgrade, item) => {
      upgrade.enabled = item?.enabled ?? upgrade.enabled;
    });
  }

  static toLegacyOptions(settings: UpgradeSettings, subject: LegacyStorage) {
    subject.items["toggle-upgrades"] = settings.enabled;

    for (const [name, item] of objectEntries(settings.upgrades)) {
      subject.items[`toggle-upgrade-${name}` as const] = item.enabled;
    }
  }

  static fromLegacyOptions(subject: LegacyStorage) {
    const options = new UpgradeSettings();
    options.enabled = subject.items["toggle-upgrades"] ?? options.enabled;

    for (const [name, item] of objectEntries(options.upgrades)) {
      item.enabled = subject.items[`toggle-upgrade-${name}` as const] ?? item.enabled;
    }

    return options;
  }
}
