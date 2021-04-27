import { Resource } from "../types";
import { BuildItem, FaithItem, SpaceItem, TimeItem, UnicornItem } from "./Options";
import { SettingsSection } from "./SettingsSection";

export type TimeControlBuildSettingsItem = {
  enabled: boolean;
  $enabled?: JQuery<HTMLElement>;

  triggerForReset: number;
  $triggerForReset?: JQuery<HTMLElement>;
};
export type TimeControlResourcesSettingsItem = {
  enabled: boolean;
  $enabled?: JQuery<HTMLElement>;

  stockForReset: number;
  $stockForReset?: JQuery<HTMLElement>;
};
export class TimeControlSettings extends SettingsSection {
  buildItems: {
    // unicornPasture is handled in the Religion section.
    [item in Exclude<BuildItem, "unicornPasture">]: TimeControlBuildSettingsItem;
  } = {
    hut: { triggerForReset: -1 },
    logHouse: { triggerForReset: -1 },
    mansion: { triggerForReset: -1 },

    workshop: { triggerForReset: -1 },
    factory: { triggerForReset: -1 },

    field: { triggerForReset: -1 },
    pasture: { triggerForReset: -1 },
    solarFarm: { triggerForReset: -1 },
    mine: { triggerForReset: -1 },
    lumberMill: { triggerForReset: -1 },
    aqueduct: { triggerForReset: -1 },
    hydroPlant: { triggerForReset: -1 },
    oilWell: { triggerForReset: -1 },
    quarry: { triggerForReset: -1 },

    smelter: { triggerForReset: -1 },
    biolab: { triggerForReset: -1 },
    calciner: { triggerForReset: -1 },
    reactor: { triggerForReset: -1 },
    accelerator: { triggerForReset: -1 },
    steamworks: { triggerForReset: -1 },
    magneto: { triggerForReset: -1 },

    library: { triggerForReset: -1 },
    dataCenter: { triggerForReset: -1 },
    academy: { triggerForReset: -1 },
    observatory: { triggerForReset: -1 },

    amphitheatre: { triggerForReset: -1 },
    broadcastTower: { triggerForReset: -1 },
    tradepost: { triggerForReset: -1 },
    chapel: { triggerForReset: -1 },
    temple: { triggerForReset: -1 },
    mint: { triggerForReset: -1 },
    ziggurat: { triggerForReset: -1 },
    chronosphere: { triggerForReset: -1 },
    aiCore: { triggerForReset: -1 },
    brewery: { triggerForReset: -1 },

    barn: { triggerForReset: -1 },
    harbor: { triggerForReset: -1 },
    warehouse: { triggerForReset: -1 },

    zebraOutpost: { triggerForReset: -1 },
    zebraWorkshop: { triggerForReset: -1 },
    zebraForge: { triggerForReset: -1 },
  };

  religionItems: {
    [item in FaithItem | UnicornItem]: TimeControlBuildSettingsItem;
  } = {
    unicornPasture: { triggerForReset: -1 },
    unicornTomb: { triggerForReset: -1 },
    ivoryTower: { triggerForReset: -1 },
    ivoryCitadel: { triggerForReset: -1 },
    skyPalace: { triggerForReset: -1 },
    unicornUtopia: { triggerForReset: -1 },
    sunspire: { triggerForReset: -1 },

    marker: { triggerForReset: -1 },
    unicornGraveyard: { triggerForReset: -1 },
    unicornNecropolis: { triggerForReset: -1 },
    blackPyramid: { triggerForReset: -1 },

    solarchant: { triggerForReset: -1 },
    scholasticism: { triggerForReset: -1 },
    goldenSpire: { triggerForReset: -1 },
    sunAltar: { triggerForReset: -1 },
    stainedGlass: { triggerForReset: -1 },
    solarRevolution: { triggerForReset: -1 },
    basilica: { triggerForReset: -1 },
    templars: { triggerForReset: -1 },
    apocripha: { triggerForReset: -1 },
    transcendence: { triggerForReset: -1 },

    blackObelisk: { triggerForReset: -1 },
    blackNexus: { triggerForReset: -1 },
    blackCore: { triggerForReset: -1 },
    singularity: { triggerForReset: -1 },
    blackLibrary: { triggerForReset: -1 },
    blackRadiance: { triggerForReset: -1 },
    blazar: { triggerForReset: -1 },
    darkNova: { triggerForReset: -1 },
    holyGenocide: { triggerForReset: -1 },
  };

  spaceItems: {
    [item in SpaceItem]: TimeControlBuildSettingsItem;
  } = {
    // Cath
    spaceElevator: { triggerForReset: -1 },
    sattelite: { triggerForReset: -1 },
    spaceStation: { triggerForReset: -1 },

    // Moon
    moonOutpost: { triggerForReset: -1 },
    moonBase: { triggerForReset: -1 },

    // Dune
    planetCracker: { triggerForReset: -1 },
    hydrofracturer: { triggerForReset: -1 },
    spiceRefinery: { triggerForReset: -1 },

    // Piscine
    researchVessel: { triggerForReset: -1 },
    orbitalArray: { triggerForReset: -1 },

    // Helios
    sunlifter: { triggerForReset: -1 },
    containmentChamber: { triggerForReset: -1 },
    heatsink: { triggerForReset: -1 },
    sunforge: { triggerForReset: -1 },

    // T-Minus
    cryostation: { triggerForReset: -1 },

    // Kairo
    spaceBeacon: { triggerForReset: -1 },

    // Yarn
    terraformingStation: { triggerForReset: -1 },
    hydroponics: { triggerForReset: -1 },

    // Umbra
    hrHarvester: { triggerForReset: -1 },

    // Charon
    entangler: { triggerForReset: -1 },

    // Centaurus
    tectonic: { triggerForReset: -1 },
    moltenCore: { triggerForReset: -1 },
  };

  timeItems: {
    [item in TimeItem]: TimeControlBuildSettingsItem;
  } = {
    temporalBattery: { triggerForReset: -1 },
    blastFurnace: { triggerForReset: -1 },
    timeBoiler: { triggerForReset: -1 },
    temporalAccelerator: { triggerForReset: -1 },
    temporalImpedance: { triggerForReset: -1 },
    ressourceRetrieval: { triggerForReset: -1 },

    cryochambers: { triggerForReset: -1 },
    voidHoover: { triggerForReset: -1 },
    voidRift: { triggerForReset: -1 },
    chronocontrol: { triggerForReset: -1 },
    voidResonator: { triggerForReset: -1 },
  };

  resources: {
    [item in Resource]?: TimeControlResourcesSettingsItem;
  } = {};

  items: {
    accelerateTime: {
      enabled: boolean;
      $enabled?: JQuery<HTMLElement>;

      subTrigger: number;
      $subTrigger?: JQuery<HTMLElement>;
    };
    timeSkip: {
      enabled: boolean;
      $enabled?: JQuery<HTMLElement>;

      subTrigger: number;
      $subTrigger?: JQuery<HTMLElement>;

      maximum: number;
      $maximum?: JQuery<HTMLElement>;

      spring: boolean;
      $spring?: JQuery<HTMLElement>;
      summer: boolean;
      $summer?: JQuery<HTMLElement>;
      autumn: boolean;
      $autumn?: JQuery<HTMLElement>;
      winter: boolean;
      $winter?: JQuery<HTMLElement>;

      0: boolean;
      1: boolean;
      2: boolean;
      3: boolean;
      4: boolean;
      5: boolean;
      6: boolean;
      7: boolean;
      8: boolean;
      9: boolean;
      $0?: boolean;
      $1?: boolean;
      $2?: boolean;
      $3?: boolean;
      $4?: boolean;
      $5?: boolean;
      $6?: boolean;
      $7?: boolean;
      $8?: boolean;
      $9?: boolean;
    };
    reset: {
      enabled: boolean;
      $enabled?: JQuery<HTMLElement>;
    };
  } = {
    accelerateTime: { enabled: true, subTrigger: 1 },
    timeSkip: {
      enabled: false,
      subTrigger: 5,
      maximum: 50,

      autumn: false,
      summer: false,
      spring: true,
      winter: false,

      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
    },
    reset: {
      enabled: false,
    },
  };
}
