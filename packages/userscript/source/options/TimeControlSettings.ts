import { objectEntries } from "../tools/Entries";
import { Resource, TimeItemVariant, UnicornItemVariant } from "../types";
import { BonfireItem } from "./BonfireSettings";
import { FaithItem, UnicornItem } from "./ReligionSettings";
import { SettingsSection, SettingToggle, SettingTrigger } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";
import { SpaceItem } from "./SpaceSettings";
import { TimeItem } from "./TimeSettings";

export type CycleIndices = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type TimeControlItem = "accelerateTime" | "reset" | "timeSkip";
export type TimeControlBuildSettingsItem = {
  enabled: boolean;
  $enabled?: JQuery<HTMLElement>;

  trigger: number;
  $trigger?: JQuery<HTMLElement>;
};
export type TimeControlResourcesSettingsItem = {
  enabled: boolean;
  $enabled?: JQuery<HTMLElement>;

  stock: number;
  $stock?: JQuery<HTMLElement>;
};
export class TimeControlSettings extends SettingsSection {
  buildItems: {
    // unicornPasture is handled in the Religion section.
    [item in Exclude<BonfireItem, "unicornPasture">]: TimeControlBuildSettingsItem;
  } = {
    hut: { enabled: true, trigger: -1 },
    logHouse: { enabled: true, trigger: -1 },
    mansion: { enabled: true, trigger: -1 },

    workshop: { enabled: true, trigger: -1 },
    factory: { enabled: true, trigger: -1 },

    field: { enabled: true, trigger: -1 },
    pasture: { enabled: true, trigger: -1 },
    solarFarm: { enabled: true, trigger: -1 },
    mine: { enabled: true, trigger: -1 },
    lumberMill: { enabled: true, trigger: -1 },
    aqueduct: { enabled: true, trigger: -1 },
    hydroPlant: { enabled: true, trigger: -1 },
    oilWell: { enabled: true, trigger: -1 },
    quarry: { enabled: true, trigger: -1 },

    smelter: { enabled: true, trigger: -1 },
    biolab: { enabled: true, trigger: -1 },
    calciner: { enabled: true, trigger: -1 },
    reactor: { enabled: true, trigger: -1 },
    accelerator: { enabled: true, trigger: -1 },
    steamworks: { enabled: true, trigger: -1 },
    magneto: { enabled: true, trigger: -1 },

    library: { enabled: true, trigger: -1 },
    dataCenter: { enabled: true, trigger: -1 },
    academy: { enabled: true, trigger: -1 },
    observatory: { enabled: true, trigger: -1 },

    amphitheatre: { enabled: true, trigger: -1 },
    broadcastTower: { enabled: true, trigger: -1 },
    tradepost: { enabled: true, trigger: -1 },
    chapel: { enabled: true, trigger: -1 },
    temple: { enabled: true, trigger: -1 },
    mint: { enabled: true, trigger: -1 },
    ziggurat: { enabled: true, trigger: -1 },
    chronosphere: { enabled: true, trigger: -1 },
    aiCore: { enabled: true, trigger: -1 },
    brewery: { enabled: true, trigger: -1 },

    barn: { enabled: true, trigger: -1 },
    harbor: { enabled: true, trigger: -1 },
    warehouse: { enabled: true, trigger: -1 },

    zebraOutpost: { enabled: true, trigger: -1 },
    zebraWorkshop: { enabled: true, trigger: -1 },
    zebraForge: { enabled: true, trigger: -1 },
  };

  religionItems: {
    [item in FaithItem | UnicornItem]: TimeControlBuildSettingsItem & {
      variant: UnicornItemVariant;
    };
  } = {
    unicornPasture: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.UnicornPasture,
    },
    unicornTomb: { enabled: true, trigger: -1, variant: UnicornItemVariant.Ziggurat },
    ivoryTower: { enabled: true, trigger: -1, variant: UnicornItemVariant.Ziggurat },
    ivoryCitadel: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.Ziggurat,
    },
    skyPalace: { enabled: true, trigger: -1, variant: UnicornItemVariant.Ziggurat },
    unicornUtopia: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.Ziggurat,
    },
    sunspire: { enabled: true, trigger: -1, variant: UnicornItemVariant.Ziggurat },

    marker: { enabled: true, trigger: -1, variant: UnicornItemVariant.Ziggurat },
    unicornGraveyard: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.Ziggurat,
    },
    unicornNecropolis: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.Ziggurat,
    },
    blackPyramid: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.Ziggurat,
    },

    solarchant: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.OrderOfTheSun,
    },
    scholasticism: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.OrderOfTheSun,
    },
    goldenSpire: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.OrderOfTheSun,
    },
    sunAltar: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.OrderOfTheSun,
    },
    stainedGlass: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.OrderOfTheSun,
    },
    solarRevolution: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.OrderOfTheSun,
    },
    basilica: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.OrderOfTheSun,
    },
    templars: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.OrderOfTheSun,
    },
    apocripha: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.OrderOfTheSun,
    },
    transcendence: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.OrderOfTheSun,
    },

    blackObelisk: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.Cryptotheology,
    },
    blackNexus: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.Cryptotheology,
    },
    blackCore: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.Cryptotheology,
    },
    singularity: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.Cryptotheology,
    },
    blackLibrary: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.Cryptotheology,
    },
    blackRadiance: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.Cryptotheology,
    },
    blazar: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.Cryptotheology,
    },
    darkNova: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.Cryptotheology,
    },
    holyGenocide: {
      enabled: true,
      trigger: -1,
      variant: UnicornItemVariant.Cryptotheology,
    },
  };

  spaceItems: {
    [item in SpaceItem]: TimeControlBuildSettingsItem;
  } = {
    // Cath
    spaceElevator: { enabled: true, trigger: -1 },
    sattelite: { enabled: true, trigger: -1 },
    spaceStation: { enabled: true, trigger: -1 },

    // Moon
    moonOutpost: { enabled: true, trigger: -1 },
    moonBase: { enabled: true, trigger: -1 },

    // Dune
    planetCracker: { enabled: true, trigger: -1 },
    hydrofracturer: { enabled: true, trigger: -1 },
    spiceRefinery: { enabled: true, trigger: -1 },

    // Piscine
    researchVessel: { enabled: true, trigger: -1 },
    orbitalArray: { enabled: true, trigger: -1 },

    // Helios
    sunlifter: { enabled: true, trigger: -1 },
    containmentChamber: { enabled: true, trigger: -1 },
    heatsink: { enabled: true, trigger: -1 },
    sunforge: { enabled: true, trigger: -1 },

    // T-Minus
    cryostation: { enabled: true, trigger: -1 },

    // Kairo
    spaceBeacon: { enabled: true, trigger: -1 },

    // Yarn
    terraformingStation: { enabled: true, trigger: -1 },
    hydroponics: { enabled: true, trigger: -1 },

    // Umbra
    hrHarvester: { enabled: true, trigger: -1 },

    // Charon
    entangler: { enabled: true, trigger: -1 },

    // Centaurus
    tectonic: { enabled: true, trigger: -1 },
    moltenCore: { enabled: true, trigger: -1 },
  };

  timeItems: {
    [item in TimeItem]: TimeControlBuildSettingsItem & { variant: TimeItemVariant };
  } = {
    temporalBattery: {
      enabled: true,
      trigger: -1,
      variant: TimeItemVariant.Chronoforge,
    },
    blastFurnace: {
      enabled: true,
      trigger: -1,
      variant: TimeItemVariant.Chronoforge,
    },
    timeBoiler: {
      enabled: true,
      trigger: -1,
      variant: TimeItemVariant.Chronoforge,
    },
    temporalAccelerator: {
      enabled: true,
      trigger: -1,
      variant: TimeItemVariant.Chronoforge,
    },
    temporalImpedance: {
      enabled: true,
      trigger: -1,
      variant: TimeItemVariant.Chronoforge,
    },
    ressourceRetrieval: {
      enabled: true,
      trigger: -1,
      variant: TimeItemVariant.Chronoforge,
    },

    cryochambers: { enabled: true, trigger: -1, variant: TimeItemVariant.VoidSpace },
    voidHoover: { enabled: true, trigger: -1, variant: TimeItemVariant.VoidSpace },
    voidRift: { enabled: true, trigger: -1, variant: TimeItemVariant.VoidSpace },
    chronocontrol: { enabled: true, trigger: -1, variant: TimeItemVariant.VoidSpace },
    voidResonator: { enabled: true, trigger: -1, variant: TimeItemVariant.VoidSpace },
  };

  resources: {
    [item in Resource]?: TimeControlResourcesSettingsItem;
  } = {};

  items: {
    accelerateTime: SettingToggle & SettingTrigger;
    timeSkip: SettingToggle &
      SettingTrigger & {
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
    reset: SettingToggle;
  } = {
    accelerateTime: { enabled: true, trigger: 1 },
    timeSkip: {
      enabled: false,
      trigger: 5,
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

  static toLegacyOptions(settings: TimeControlSettings, subject: KittenStorageType) {
    subject.toggles.timeCtrl = settings.enabled;

    subject.items["toggle-accelerateTime"] = settings.items.accelerateTime.enabled;
    subject.items["set-accelerateTime-trigger"] = settings.items.accelerateTime.trigger;

    subject.items["toggle-reset"] = settings.items.reset.enabled;

    subject.items["toggle-timeSkip"] = settings.items.timeSkip.enabled;
    subject.items["set-timeSkip-trigger"] = settings.items.timeSkip.trigger;
    subject.items["toggle-timeSkip-autumn"] = settings.items.timeSkip.autumn;
    subject.items["toggle-timeSkip-spring"] = settings.items.timeSkip.spring;
    subject.items["toggle-timeSkip-summer"] = settings.items.timeSkip.summer;
    subject.items["toggle-timeSkip-winter"] = settings.items.timeSkip.winter;

    for (let cycleIndex = 0; cycleIndex < 10; ++cycleIndex) {
      subject.items[`toggle-timeSkip-${cycleIndex as CycleIndices}` as const] =
        settings.items.timeSkip[cycleIndex as CycleIndices];
    }

    for (const [name, item] of objectEntries(settings.buildItems)) {
      subject.items[`toggle-reset-build-${name}` as const] = item.enabled;
      subject.items[`set-reset-build-${name}-min` as const] = item.trigger;
    }
    for (const [name, item] of objectEntries(settings.religionItems)) {
      subject.items[`toggle-reset-faith-${name}` as const] = item.enabled;
      subject.items[`set-reset-faith-${name}-min` as const] = item.trigger;
    }
    for (const [name, item] of objectEntries(settings.spaceItems)) {
      subject.items[`toggle-reset-space-${name}` as const] = item.enabled;
      subject.items[`set-reset-space-${name}-min` as const] = item.trigger;
    }
    for (const [name, item] of objectEntries(settings.timeItems)) {
      subject.items[`toggle-reset-time-${name}` as const] = item.enabled;
      subject.items[`set-reset-time-${name}-min` as const] = item.trigger;
    }

    for (const [name, item] of objectEntries(settings.resources)) {
      subject.resources[name] = {
        checkForReset: item.enabled,
        stockForReset: item.stock,
        consume: 0,
        enabled: false,
        stock: 0,
      };
    }
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new TimeControlSettings();
    options.enabled = subject.toggles.timeCtrl;
    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
    }

    options.items.accelerateTime.enabled =
      subject.items["toggle-accelerateTime"] ?? options.items.accelerateTime.enabled;
    options.items.accelerateTime.trigger =
      subject.items["set-accelerateTime-trigger"] ?? options.items.accelerateTime.trigger;

    options.items.reset.enabled = subject.items["toggle-reset"] ?? options.items.reset.enabled;

    options.items.timeSkip.enabled =
      subject.items["toggle-timeSkip"] ?? options.items.timeSkip.enabled;
    options.items.timeSkip.trigger =
      subject.items["set-timeSkip-trigger"] ?? options.items.timeSkip.trigger;
    options.items.timeSkip.autumn =
      subject.items["toggle-timeSkip-autumn"] ?? options.items.timeSkip.autumn;
    options.items.timeSkip.spring =
      subject.items["toggle-timeSkip-spring"] ?? options.items.timeSkip.spring;
    options.items.timeSkip.summer =
      subject.items["toggle-timeSkip-summer"] ?? options.items.timeSkip.summer;
    options.items.timeSkip.winter =
      subject.items["toggle-timeSkip-winter"] ?? options.items.timeSkip.winter;

    for (let cycleIndex = 0; cycleIndex < 10; ++cycleIndex) {
      options.items.timeSkip[cycleIndex as CycleIndices] =
        subject.items[`toggle-timeSkip-${cycleIndex as CycleIndices}` as const] ??
        options.items.timeSkip[cycleIndex as CycleIndices];
    }

    for (const [name, item] of objectEntries(options.buildItems)) {
      item.enabled = subject.items[`toggle-reset-build-${name}` as const] ?? item.enabled;
      item.trigger = subject.items[`set-reset-build-${name}-min` as const] ?? item.trigger;
    }
    for (const [name, item] of objectEntries(options.religionItems)) {
      item.enabled = subject.items[`toggle-reset-faith-${name}` as const] ?? item.enabled;
      item.trigger = subject.items[`set-reset-faith-${name}-min` as const] ?? item.trigger;
    }
    for (const [name, item] of objectEntries(options.spaceItems)) {
      item.enabled = subject.items[`toggle-reset-space-${name}` as const] ?? item.enabled;
      item.trigger = subject.items[`set-reset-space-${name}-min` as const] ?? item.trigger;
    }
    for (const [name, item] of objectEntries(options.timeItems)) {
      item.enabled = subject.items[`toggle-reset-time-${name}` as const] ?? item.enabled;
      item.trigger = subject.items[`set-reset-time-${name}-min` as const] ?? item.trigger;
    }

    options.resources = {};
    for (const [name, item] of objectEntries(subject.resources)) {
      if (!item.checkForReset) {
        continue;
      }
      options.resources[name] = {
        enabled: item.checkForReset,
        stock: item.stockForReset,
      };
    }

    return options;
  }
}
