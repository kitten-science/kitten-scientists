import { Resource, UnicornItemVariant } from "../types";
import {
  BuildItem,
  FaithItem,
  SpaceItem,
  TimeItem,
  TimeItemVariant,
  UnicornItem,
} from "./OptionsLegacy";
import { SettingsSection } from "./SettingsSection";

export type CycleIndices = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type TimeControlItem = "accelerateTime" | "reset" | "timeSkip";
export type TimeControlBuildSettingsItem = {
  checkForReset: boolean;
  $checkForReset?: JQuery<HTMLElement>;

  triggerForReset: number;
  $triggerForReset?: JQuery<HTMLElement>;
};
export type TimeControlResourcesSettingsItem = {
  checkForReset: boolean;
  $checkForReset?: JQuery<HTMLElement>;

  stockForReset: number;
  $stockForReset?: JQuery<HTMLElement>;
};
export class TimeControlSettings extends SettingsSection {
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
    [item in FaithItem | UnicornItem]: TimeControlBuildSettingsItem & {
      variant: UnicornItemVariant;
    };
  } = {
    unicornPasture: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.Unknown_zp,
    },
    unicornTomb: { checkForReset: true, triggerForReset: -1, variant: UnicornItemVariant.Ziggurat },
    ivoryTower: { checkForReset: true, triggerForReset: -1, variant: UnicornItemVariant.Ziggurat },
    ivoryCitadel: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.Ziggurat,
    },
    skyPalace: { checkForReset: true, triggerForReset: -1, variant: UnicornItemVariant.Ziggurat },
    unicornUtopia: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.Ziggurat,
    },
    sunspire: { checkForReset: true, triggerForReset: -1, variant: UnicornItemVariant.Ziggurat },

    marker: { checkForReset: true, triggerForReset: -1, variant: UnicornItemVariant.Ziggurat },
    unicornGraveyard: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.Ziggurat,
    },
    unicornNecropolis: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.Ziggurat,
    },
    blackPyramid: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.Ziggurat,
    },

    solarchant: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.OrderOfTheSun,
    },
    scholasticism: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.OrderOfTheSun,
    },
    goldenSpire: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.OrderOfTheSun,
    },
    sunAltar: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.OrderOfTheSun,
    },
    stainedGlass: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.OrderOfTheSun,
    },
    solarRevolution: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.OrderOfTheSun,
    },
    basilica: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.OrderOfTheSun,
    },
    templars: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.OrderOfTheSun,
    },
    apocripha: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.OrderOfTheSun,
    },
    transcendence: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.OrderOfTheSun,
    },

    blackObelisk: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.Cryptotheology,
    },
    blackNexus: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.Cryptotheology,
    },
    blackCore: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.Cryptotheology,
    },
    singularity: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.Cryptotheology,
    },
    blackLibrary: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.Cryptotheology,
    },
    blackRadiance: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.Cryptotheology,
    },
    blazar: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.Cryptotheology,
    },
    darkNova: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.Cryptotheology,
    },
    holyGenocide: {
      checkForReset: true,
      triggerForReset: -1,
      variant: UnicornItemVariant.Cryptotheology,
    },
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
    [item in TimeItem]: TimeControlBuildSettingsItem & { variant: TimeItemVariant };
  } = {
    temporalBattery: {
      checkForReset: true,
      triggerForReset: -1,
      variant: TimeItemVariant.Unknown_chrono,
    },
    blastFurnace: {
      checkForReset: true,
      triggerForReset: -1,
      variant: TimeItemVariant.Unknown_chrono,
    },
    timeBoiler: {
      checkForReset: true,
      triggerForReset: -1,
      variant: TimeItemVariant.Unknown_chrono,
    },
    temporalAccelerator: {
      checkForReset: true,
      triggerForReset: -1,
      variant: TimeItemVariant.Unknown_chrono,
    },
    temporalImpedance: {
      checkForReset: true,
      triggerForReset: -1,
      variant: TimeItemVariant.Unknown_chrono,
    },
    ressourceRetrieval: {
      checkForReset: true,
      triggerForReset: -1,
      variant: TimeItemVariant.Unknown_chrono,
    },

    cryochambers: { checkForReset: true, triggerForReset: -1, variant: TimeItemVariant.VoidSpace },
    voidHoover: { checkForReset: true, triggerForReset: -1, variant: TimeItemVariant.VoidSpace },
    voidRift: { checkForReset: true, triggerForReset: -1, variant: TimeItemVariant.VoidSpace },
    chronocontrol: { checkForReset: true, triggerForReset: -1, variant: TimeItemVariant.VoidSpace },
    voidResonator: { checkForReset: true, triggerForReset: -1, variant: TimeItemVariant.VoidSpace },
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
      $0?: JQuery<HTMLElement>;
      $1?: JQuery<HTMLElement>;
      $2?: JQuery<HTMLElement>;
      $3?: JQuery<HTMLElement>;
      $4?: JQuery<HTMLElement>;
      $5?: JQuery<HTMLElement>;
      $6?: JQuery<HTMLElement>;
      $7?: JQuery<HTMLElement>;
      $8?: JQuery<HTMLElement>;
      $9?: JQuery<HTMLElement>;
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
