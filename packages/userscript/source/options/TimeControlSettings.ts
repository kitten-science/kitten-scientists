import { Resource } from "../types";
import { BuildItem, FaithItem, SpaceItem, TimeItem, UnicornItem } from "./Options";

export type TimeControlBuildSettingsItem = {  triggerForReset: number };
export type TimeControlResourcesSettingsItem = {  stockForReset: number };
export class TimeControlSettings {
  enabled = false;

  buildItems: {
    // unicornPasture is handled in the Religion section.
    [item in Exclude<BuildItem, "unicornPasture">]: TimeControlBuildSettingsItem;
  } = {
    hut: { checkForReset: true, triggerForReset: -1 },
    logHouse: { checkForReset: true, triggerForReset: -1 },
    mansion: { checkForReset: true, triggerForReset: -1 },

    workshop: { checkForReset: true, triggerForReset: -1 },
    factory: { checkForReset: true, triggerForReset: -1 },

    field: { checkForReset: true, triggerForReset: -1 },
    pasture: { checkForReset: true, triggerForReset: -1 },
    solarFarm: { checkForReset: true, triggerForReset: -1 },
    mine: { checkForReset: true, triggerForReset: -1 },
    lumberMill: { checkForReset: true, triggerForReset: -1 },
    aqueduct: { checkForReset: true, triggerForReset: -1 },
    hydroPlant: { checkForReset: true, triggerForReset: -1 },
    oilWell: { checkForReset: true, triggerForReset: -1 },
    quarry: { checkForReset: true, triggerForReset: -1 },

    smelter: { checkForReset: true, triggerForReset: -1 },
    biolab: { checkForReset: true, triggerForReset: -1 },
    calciner: { checkForReset: true, triggerForReset: -1 },
    reactor: { checkForReset: true, triggerForReset: -1 },
    accelerator: { checkForReset: true, triggerForReset: -1 },
    steamworks: { checkForReset: true, triggerForReset: -1 },
    magneto: { checkForReset: true, triggerForReset: -1 },

    library: { checkForReset: true, triggerForReset: -1 },
    dataCenter: { checkForReset: true, triggerForReset: -1 },
    academy: { checkForReset: true, triggerForReset: -1 },
    observatory: { checkForReset: true, triggerForReset: -1 },

    amphitheatre: { checkForReset: true, triggerForReset: -1 },
    broadcastTower: { checkForReset: true, triggerForReset: -1 },
    tradepost: { checkForReset: true, triggerForReset: -1 },
    chapel: { checkForReset: true, triggerForReset: -1 },
    temple: { checkForReset: true, triggerForReset: -1 },
    mint: { checkForReset: true, triggerForReset: -1 },
    ziggurat: { checkForReset: true, triggerForReset: -1 },
    chronosphere: { checkForReset: true, triggerForReset: -1 },
    aiCore: { checkForReset: true, triggerForReset: -1 },
    brewery: { checkForReset: true, triggerForReset: -1 },

    barn: { checkForReset: true, triggerForReset: -1 },
    harbor: { checkForReset: true, triggerForReset: -1 },
    warehouse: { checkForReset: true, triggerForReset: -1 },

    zebraOutpost: { checkForReset: true, triggerForReset: -1 },
    zebraWorkshop: { checkForReset: true, triggerForReset: -1 },
    zebraForge: { checkForReset: true, triggerForReset: -1 },
  };

  religionItems: {
    [item in FaithItem | UnicornItem]: TimeControlBuildSettingsItem;
  } = {
    unicornPasture: { checkForReset: true, triggerForReset: -1 },
    unicornTomb: { checkForReset: true, triggerForReset: -1 },
    ivoryTower: { checkForReset: true, triggerForReset: -1 },
    ivoryCitadel: { checkForReset: true, triggerForReset: -1 },
    skyPalace: { checkForReset: true, triggerForReset: -1 },
    unicornUtopia: { checkForReset: true, triggerForReset: -1 },
    sunspire: { checkForReset: true, triggerForReset: -1 },

    marker: { checkForReset: true, triggerForReset: -1 },
    unicornGraveyard: { checkForReset: true, triggerForReset: -1 },
    unicornNecropolis: { checkForReset: true, triggerForReset: -1 },
    blackPyramid: { checkForReset: true, triggerForReset: -1 },

    solarchant: { checkForReset: true, triggerForReset: -1 },
    scholasticism: { checkForReset: true, triggerForReset: -1 },
    goldenSpire: { checkForReset: true, triggerForReset: -1 },
    sunAltar: { checkForReset: true, triggerForReset: -1 },
    stainedGlass: { checkForReset: true, triggerForReset: -1 },
    solarRevolution: { checkForReset: true, triggerForReset: -1 },
    basilica: { checkForReset: true, triggerForReset: -1 },
    templars: { checkForReset: true, triggerForReset: -1 },
    apocripha: { checkForReset: true, triggerForReset: -1 },
    transcendence: { checkForReset: true, triggerForReset: -1 },

    blackObelisk: { checkForReset: true, triggerForReset: -1 },
    blackNexus: { checkForReset: true, triggerForReset: -1 },
    blackCore: { checkForReset: true, triggerForReset: -1 },
    singularity: { checkForReset: true, triggerForReset: -1 },
    blackLibrary: { checkForReset: true, triggerForReset: -1 },
    blackRadiance: { checkForReset: true, triggerForReset: -1 },
    blazar: { checkForReset: true, triggerForReset: -1 },
    darkNova: { checkForReset: true, triggerForReset: -1 },
    holyGenocide: { checkForReset: true, triggerForReset: -1 },
  };

  spaceItems: {
    [item in SpaceItem]: TimeControlBuildSettingsItem;
  } = {
    // Cath
    spaceElevator: { checkForReset: true, triggerForReset: -1 },
    sattelite: { checkForReset: true, triggerForReset: -1 },
    spaceStation: { checkForReset: true, triggerForReset: -1 },

    // Moon
    moonOutpost: { checkForReset: true, triggerForReset: -1 },
    moonBase: { checkForReset: true, triggerForReset: -1 },

    // Dune
    planetCracker: { checkForReset: true, triggerForReset: -1 },
    hydrofracturer: { checkForReset: true, triggerForReset: -1 },
    spiceRefinery: { checkForReset: true, triggerForReset: -1 },

    // Piscine
    researchVessel: { checkForReset: true, triggerForReset: -1 },
    orbitalArray: { checkForReset: true, triggerForReset: -1 },

    // Helios
    sunlifter: { checkForReset: true, triggerForReset: -1 },
    containmentChamber: { checkForReset: true, triggerForReset: -1 },
    heatsink: { checkForReset: true, triggerForReset: -1 },
    sunforge: { checkForReset: true, triggerForReset: -1 },

    // T-Minus
    cryostation: { checkForReset: true, triggerForReset: -1 },

    // Kairo
    spaceBeacon: { checkForReset: true, triggerForReset: -1 },

    // Yarn
    terraformingStation: { checkForReset: true, triggerForReset: -1 },
    hydroponics: { checkForReset: true, triggerForReset: -1 },

    // Umbra
    hrHarvester: { checkForReset: true, triggerForReset: -1 },

    // Charon
    entangler: { checkForReset: true, triggerForReset: -1 },

    // Centaurus
    tectonic: { checkForReset: true, triggerForReset: -1 },
    moltenCore: { checkForReset: true, triggerForReset: -1 },
  };

  timeItems: {
    [item in TimeItem]: TimeControlBuildSettingsItem;
  } = {
    temporalBattery: { checkForReset: true, triggerForReset: -1 },
    blastFurnace: { checkForReset: true, triggerForReset: -1 },
    timeBoiler: { checkForReset: true, triggerForReset: -1 },
    temporalAccelerator: { checkForReset: true, triggerForReset: -1 },
    temporalImpedance: { checkForReset: true, triggerForReset: -1 },
    ressourceRetrieval: { checkForReset: true, triggerForReset: -1 },

    cryochambers: { checkForReset: true, triggerForReset: -1 },
    voidHoover: { checkForReset: true, triggerForReset: -1 },
    voidRift: { checkForReset: true, triggerForReset: -1 },
    chronocontrol: { checkForReset: true, triggerForReset: -1 },
    voidResonator: { checkForReset: true, triggerForReset: -1 },
  };

  resources: {
    [item in Resource]?: TimeControlResourcesSettingsItem;
  } = {};

  items: {
    accelerateTime: {
      enabled: boolean;
      subTrigger: number;
    };
    timeSkip: {
      enabled: boolean;
      subTrigger: number;
      maximum: number;
      spring: boolean;
      summer: boolean;
      autumn: boolean;
      winter: boolean;
    };
    reset: {
      enabled: boolean;
      subTrigger: number;
    };
  } = {
    accelerateTime: { enabled: true, subTrigger: 1 },
    timeSkip: {
      enabled: false,
      subTrigger: 5,
      autumn: false,
      summer: false,
      spring: true,
      maximum: 50,
      winter: false,
    },
    reset: {
      enabled: false,
      subTrigger: 99999,
    },
  };
}
