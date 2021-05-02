import { cwarn } from "../tools/Log";
import {
  Building,
  ChronoForgeUpgrades,
  Jobs,
  Resource,
  SpaceUpgrades,
  UnicornItemVariant,
  VoidSpaceUpgrades,
} from "../types";

export type Requirement = Resource | false;

export type FaithItem =
  | "apocripha"
  | "basilica"
  | "blackCore"
  | "blackLibrary"
  | "blackNexus"
  | "blackObelisk"
  | "blackPyramid"
  | "blackRadiance"
  | "blazar"
  | "darkNova"
  | "goldenSpire"
  | "holyGenocide"
  | "marker"
  | "scholasticism"
  | "singularity"
  | "solarchant"
  | "solarRevolution"
  | "stainedGlass"
  | "sunAltar"
  | "templars"
  | "transcendence"
  | "unicornGraveyard"
  | "unicornNecropolis";

export type UnicornItem =
  | "ivoryCitadel"
  | "ivoryTower"
  | "skyPalace"
  | "sunspire"
  | "unicornPasture"
  | "unicornTomb"
  | "unicornUtopia";

export type UnicornFaithItemOptions = {
  require: Requirement;
  enabled: boolean;
  variant: UnicornItemVariant;
  label?: string;
  checkForReset: boolean;
  triggerForReset: number;
};

/**
 * One of the building options in the KG menu.
 * These are not identical to `Building`!
 */
export type BuildItem =
  | "academy"
  | "accelerator"
  | "aiCore"
  | "amphitheatre"
  | "aqueduct"
  | "barn"
  | "biolab"
  | "brewery"
  | "broadcastTower"
  | "calciner"
  | "chapel"
  | "chronosphere"
  | "dataCenter"
  | "factory"
  | "field"
  | "harbor"
  | "hut"
  | "hydroPlant"
  | "library"
  | "logHouse"
  | "lumberMill"
  | "magneto"
  | "mansion"
  | "mine"
  | "mint"
  | "observatory"
  | "oilWell"
  | "pasture"
  | "quarry"
  | "reactor"
  | "smelter"
  | "solarFarm"
  | "steamworks"
  | "temple"
  | "tradepost"
  | "unicornPasture"
  | "warehouse"
  | "workshop"
  | "zebraForge"
  | "zebraOutpost"
  | "zebraWorkshop"
  | "ziggurat";

export type BuildItemOptions = {
  checkForReset: boolean;
  enabled: boolean;
  label: string;
  max: number;
  name: Building;
  require: Requirement;
  stage?: number;
  triggerForReset: number;
};

export type SpaceItem = SpaceUpgrades;

export enum TimeItemVariant {
  Unknown_chrono = "chrono",
  VoidSpace = "void",
}
export type TimeItemOptions = {
  require: Requirement;
  enabled: boolean;
  variant: TimeItemVariant;
  checkForReset: boolean;
  triggerForReset: number;
};

export type CraftItemOptions = {
  require: Requirement;
  max: number;
  label?: string;
  limited: boolean;
  limRat: number;
  enabled: boolean;
};

export type DistributeItems = Jobs;

export type TradeItemOptions = {
  enabled: boolean;
  require: Requirement;
  allowcapped: boolean;
  limited: boolean;
  summer: boolean;
  autumn: boolean;
  winter: boolean;
  spring: boolean;
};

/**
 * The upgrades on the Time tab that we have options for.
 */
export type TimeItem = Exclude<ChronoForgeUpgrades | VoidSpaceUpgrades, "usedCryochambers">;
/**
 * Options for an automation of the Time tab.
 */
export type OptionsItemOptions = {
  enabled: boolean;
  misc: boolean;
  label: string;
};
export type OptionsItemOptionsWithSubtrigger = OptionsItemOptions & {
  subTrigger: number;
};

export type DistributeItemOptions = {
  enabled: boolean;
  max: number;
  limited: boolean;
};

export enum FilterItemVariant {
  Build = "ks-activity type_ks-build",
  Craft = "ks-activity type_ks-craft",
  Upgrade = "ks-activity type_ks-upgrade",
  Research = "ks-activity type_ks-research",
  Trade = "ks-activity type_ks-trade",
  Hunt = "ks-activity type_ks-hunt",
  Praise = "ks-activity type_ks-praise",
  Adore = "ks-activity type_ks-adore",
  Transcend = "ks-activity type_ks-transcend",
  Faith = "ks-activity type_ks-faith",
  Accelerate = "ks-activity type_ks-accelerate",
  TimeSkip = "ks-activity type_ks-timeSkip",
  Festival = "ks-activity type_ks-festival",
  Star = "ks-activity type_ks-star",
  Distribute = "ks-activity type_ks-distribute",
  Promote = "ks-activity type_ks-promote",
  Misc = "ks-activity",
}
export type FilterItemOptions = {
  enabled: boolean;
  filter: boolean;
  label: string;
  variant: FilterItemVariant;
};

export type OptionsLegacy = {
  /**
   * When debug is enabled, messages that go to the game log are also logged using window.console.
   */
  debug: boolean;

  /**
   * The interval at which the internal processing loop is run, inmilliseconds.
   */
  interval: number;

  /**
   * The default color for KS messages in the game log (like enabling and disabling items).
   */
  msgcolor: string;

  /**
   * The color for activity summaries.
   */
  summarycolor: string;

  /**
   * The color for log messages that are about activities (like festivals and star observations).
   */
  activitycolor: string;

  /**
   * The color for resources with stock counts higher than current resource max.
   */
  stockwarncolor: string;

  /**
   * The default consume rate.
   */
  consume: number;

  /**
   * Settings relating to automation of the game.
   */
  auto: {
    /**
     * Settings related to KS itself.
     */
    engine: {
      /**
       * Should any automation run at all?
       */
      enabled: boolean;
    };
    unicorn: {
      items: {
        [item in UnicornItem]: UnicornFaithItemOptions;
      };
    };
    faith: {
      /**
       * Should religion building be automated?
       */
      enabled: boolean;

      /**
       * At what percentage of the storage capacity should KS build faith buildings?
       */
      trigger: number;

      /**
       * Additional options.
       */
      addition: {
        bestUnicornBuilding: {
          enabled: boolean;
          misc: boolean;
          label: string;
        };
        autoPraise: {
          enabled: boolean;
          misc: boolean;
          label: string;
          subTrigger: number;
        };
        adore: {
          enabled: boolean;
          misc: boolean;
          label: string;
          subTrigger: number;
        };
        transcend: {
          enabled: boolean;
          misc: boolean;
          label: string;
        };
      };
      items: {
        [item in FaithItem]: UnicornFaithItemOptions;
      };
    };
    build: {
      /**
       * Should buildings be built automatically?
       */
      enabled: boolean;

      /**
       * When a building requires a certain resource (this is what their *require* property refers to), then
       * this is the percentage of the storage capacity of that resource, that has to be met for the building
       * to be built.
       */
      trigger: number;

      /**
       * The items that be automatically built.
       * Every item can define a required resource. This resource has to be available at a certain capacity for
       * the building to be built. The capacity requirement is defined by the trigger value set for the section.
       * Additionally, for upgradeable buildings, the item can define which upgrade stage it refers to.
       * For upgraded buildings, the ID (or internal name) of the building can be controlled through the *name*
       * property. For other buildings, the key of the item itself is used.
       */
      items: {
        // unicornPasture is handled in the Religion section.
        [item in Exclude<BuildItem, "unicornPasture">]: BuildItemOptions;
      };
    };
    space: {
      /**
       * Should space buildings be built automatically?
       */
      enabled: boolean;

      /**
       * The functionality of the space section is identical to the build section. It just needs to be treated
       * seperately, because the game internals are slightly different.
       */
      trigger: number;

      items: {
        [item in SpaceItem]: BuildItemOptions;
      };
    };
    time: {
      /**
       * Should time upgrades be built automatically?
       */
      enabled: boolean;

      trigger: number;

      items: {
        [item in TimeItem]: TimeItemOptions;
      };
    };
    timeCtrl: {
      enabled: boolean;
      items: {
        accelerateTime: {
          enabled: boolean;
          subTrigger: number;
          misc: boolean;
          label: string;
        };
        timeSkip: {
          enabled: boolean;
          subTrigger: number;
          misc: boolean;
          label: string;
          maximum: number;
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
          spring: boolean;
          summer: boolean;
          autumn: boolean;
          winter: boolean;
        };
        reset: {
          enabled: boolean;
          subTrigger: number;
          misc: boolean;
          label: string;
        };
      };
    };
    craft: {
      /**
       * Should resources be crafted automatically?
       */
      enabled: boolean;

      /**
       * Every item can define a required resource with the *require* property.
       * At what percentage of the storage capacity of that required resource should the listed resource be crafted?
       */
      trigger: number;

      /**
       * The items that can be crafted.
       * In addition to the *require* property, which is explained above, items can also define a *max*. If they
       * do, no more than that resource will be automatically produced. This feature can not be controlled through
       * the UI and is not used for any resource by default.
       * The *limited* property tells KS to craft resources whenever the ratio of the component cost of the stored resources
       * to the number of stored components is greater than the limit ratio "limRat".
       * This means that if limRat is 0.5, then if you have 1000 beams and 500 beams worth of scaffolds, 250 of the beams
       * will be crafted into scaffolds. If instead limRat is 0.75, 625 of the beams will be crafted into scaffolds for a final result
       * of 1125 beams-worth of scaffolds and 375 remaining beams.
       * Currently, limRat is not modifiable through the UI, though if there is demand, perhaps this will be added in the future.
       * Limited has a few other effects like balancing plates and steel while minimizing iron waste
       *
       * TLDR: The purpose of the limited property is to proportionally distribute raw materials
       * across all crafted resources without wasting raw materials.
       */
      items: {
        [item in Resource]: CraftItemOptions;
      };
    };
    trade: {
      /**
       * Should KS automatically trade?
       */
      enabled: boolean;

      /**
       * Every trade can define a required resource with the *require* property.
       * At what percentage of the storage capacity of that required resource should the trade happen?
       */
      trigger: number;

      /**
       * Trades can be limited to only happen during specific seasons. This is because trades with certain races
       * are more effective during specific seasons.
       * The *allowcapped* property allows us to trade even if the sold resources are at their cap.
       */
      items: {
        dragons: TradeItemOptions;
        zebras: TradeItemOptions;
        lizards: TradeItemOptions;
        sharks: TradeItemOptions;
        griffins: TradeItemOptions;
        nagas: TradeItemOptions;
        spiders: TradeItemOptions;
        leviathans: TradeItemOptions;
      };
    };
    upgrade: {
      /**
       * Should KS automatically upgrade?
       */
      enabled: boolean;

      items: {
        upgrades: {
          enabled: boolean;
        };
        techs: {
          enabled: boolean;
        };
        races: {
          enabled: boolean;
        };
        missions: {
          enabled: boolean;
        };
        buildings: {
          enabled: boolean;
        };
      };
    };
    options: {
      enabled: boolean;
      items: {
        observe: OptionsItemOptions;
        festival: OptionsItemOptions;
        shipOverride: OptionsItemOptions;
        autofeed: OptionsItemOptions;
        hunt: OptionsItemOptionsWithSubtrigger;
        promote: OptionsItemOptions;
        crypto: OptionsItemOptionsWithSubtrigger;
        fixCry: OptionsItemOptions;
        buildEmbassies: OptionsItemOptionsWithSubtrigger;
        style: OptionsItemOptions;
        explore: OptionsItemOptions;
        _steamworks: OptionsItemOptions;
      };
    };
    distribute: {
      /**
       * Should KS automatically distribute free kittens
       */
      enabled: boolean;

      /**
       * dynamic priority. distribute to the job which have lowest (job.val / job.max) value.
       * if all jobs reach the max, then distribute kittens to unlimited job.
       */
      items: {
        [item in DistributeItems]: DistributeItemOptions;
      };
    };
    filter: {
      enabled: boolean;

      /**
       * What log messages should be filtered?
       */
      items: {
        buildFilter: FilterItemOptions;
        craftFilter: FilterItemOptions;
        upgradeFilter: FilterItemOptions;
        researchFilter: FilterItemOptions;
        tradeFilter: FilterItemOptions;
        huntFilter: FilterItemOptions;
        praiseFilter: FilterItemOptions;
        adoreFilter: FilterItemOptions;
        transcendFilter: FilterItemOptions;
        faithFilter: FilterItemOptions;
        accelerateFilter: FilterItemOptions;
        timeSkipFilter: FilterItemOptions;
        festivalFilter: FilterItemOptions;
        starFilter: FilterItemOptions;
        distributeFilter: FilterItemOptions;
        promoteFilter: FilterItemOptions;
        miscFilter: FilterItemOptions;
      };
    };
    resources: Partial<
      Record<
        Resource,
        {
          enabled: boolean;
          stock: number;
          checkForReset: boolean;
          stockForReset: number;
          consume?: number;
        }
      >
    >;
    cache: {
      cache: Array<{ materials: Record<Resource, number>; timeStamp: number }>;
      cacheSum: Record<Resource, number>;
    };
  };
};

const i18n = (key: string) => {
  cwarn(`DEPRECATED i18n usage in Options.ts`);
  return key;
};

export const DefaultOptions: OptionsLegacy = {
  debug: false,

  interval: 2000,

  msgcolor: "#aa50fe", // dark purple
  summarycolor: "#009933", // light green
  activitycolor: "#E65C00", // orange
  stockwarncolor: "#DD1E00",

  consume: 0.6,

  auto: {
    engine: {
      enabled: false,
    },
    unicorn: {
      items: {
        unicornPasture: {
          require: false,
          enabled: true,
          variant: UnicornItemVariant.Unknown_zp,
          label: i18n("$buildings.unicornPasture.label"),
          checkForReset: true,
          triggerForReset: -1,
        },
        unicornTomb: {
          require: false,
          enabled: false,
          variant: UnicornItemVariant.Ziggurat,
          label: i18n("$religion.zu.unicornTomb.label"),
          checkForReset: true,
          triggerForReset: -1,
        },
        ivoryTower: {
          require: false,
          enabled: false,
          variant: UnicornItemVariant.Ziggurat,
          label: i18n("$religion.zu.ivoryTower.label"),
          checkForReset: true,
          triggerForReset: -1,
        },
        ivoryCitadel: {
          require: false,
          enabled: false,
          variant: UnicornItemVariant.Ziggurat,
          label: i18n("$religion.zu.ivoryCitadel.label"),
          checkForReset: true,
          triggerForReset: -1,
        },
        skyPalace: {
          require: false,
          enabled: false,
          variant: UnicornItemVariant.Ziggurat,
          label: i18n("$religion.zu.skyPalace.label"),
          checkForReset: true,
          triggerForReset: -1,
        },
        unicornUtopia: {
          require: "gold",
          enabled: false,
          variant: UnicornItemVariant.Ziggurat,
          label: i18n("$religion.zu.unicornUtopia.label"),
          checkForReset: true,
          triggerForReset: -1,
        },
        sunspire: {
          require: "gold",
          enabled: false,
          variant: UnicornItemVariant.Ziggurat,
          label: i18n("$religion.zu.sunspire.label"),
          checkForReset: true,
          triggerForReset: -1,
        },
      },
    },
    faith: {
      enabled: true,
      trigger: 0,
      addition: {
        bestUnicornBuilding: {
          enabled: true,
          misc: true,
          label: i18n("option.faith.best.unicorn"),
        },
        autoPraise: { enabled: true, misc: true, label: i18n("option.praise"), subTrigger: 0.98 },
        // Former [Faith Reset]
        adore: { enabled: false, misc: true, label: i18n("option.faith.adore"), subTrigger: 0.75 },
        transcend: { enabled: false, misc: true, label: i18n("option.faith.transcend") },
      },

      items: {
        marker: {
          require: "unobtainium",
          enabled: false,
          variant: UnicornItemVariant.Ziggurat,
          checkForReset: true,
          triggerForReset: -1,
        },
        unicornGraveyard: {
          require: false,
          enabled: false,
          variant: UnicornItemVariant.Ziggurat,
          checkForReset: true,
          triggerForReset: -1,
        },
        unicornNecropolis: {
          require: false,
          enabled: false,
          variant: UnicornItemVariant.Ziggurat,
          checkForReset: true,
          triggerForReset: -1,
        },
        blackPyramid: {
          require: "unobtainium",
          enabled: false,
          variant: UnicornItemVariant.Ziggurat,
          checkForReset: true,
          triggerForReset: -1,
        },
        solarchant: {
          require: "faith",
          enabled: true,
          variant: UnicornItemVariant.OrderOfTheSun,
          checkForReset: true,
          triggerForReset: -1,
        },
        scholasticism: {
          require: "faith",
          enabled: true,
          variant: UnicornItemVariant.OrderOfTheSun,
          checkForReset: true,
          triggerForReset: -1,
        },
        goldenSpire: {
          require: "faith",
          enabled: true,
          variant: UnicornItemVariant.OrderOfTheSun,
          checkForReset: true,
          triggerForReset: -1,
        },
        sunAltar: {
          require: "faith",
          enabled: true,
          variant: UnicornItemVariant.OrderOfTheSun,
          checkForReset: true,
          triggerForReset: -1,
        },
        stainedGlass: {
          require: "faith",
          enabled: true,
          variant: UnicornItemVariant.OrderOfTheSun,
          checkForReset: true,
          triggerForReset: -1,
        },
        solarRevolution: {
          require: "faith",
          enabled: true,
          variant: UnicornItemVariant.OrderOfTheSun,
          checkForReset: true,
          triggerForReset: -1,
        },
        basilica: {
          require: "faith",
          enabled: true,
          variant: UnicornItemVariant.OrderOfTheSun,
          checkForReset: true,
          triggerForReset: -1,
        },
        templars: {
          require: "faith",
          enabled: true,
          variant: UnicornItemVariant.OrderOfTheSun,
          checkForReset: true,
          triggerForReset: -1,
        },
        apocripha: {
          require: "faith",
          enabled: false,
          variant: UnicornItemVariant.OrderOfTheSun,
          checkForReset: true,
          triggerForReset: -1,
        },
        transcendence: {
          require: "faith",
          enabled: true,
          variant: UnicornItemVariant.OrderOfTheSun,
          checkForReset: true,
          triggerForReset: -1,
        },
        blackObelisk: {
          require: false,
          enabled: false,
          variant: UnicornItemVariant.Cryptotheology,
          checkForReset: true,
          triggerForReset: -1,
        },
        blackNexus: {
          require: false,
          enabled: false,
          variant: UnicornItemVariant.Cryptotheology,
          checkForReset: true,
          triggerForReset: -1,
        },
        blackCore: {
          require: false,
          enabled: false,
          variant: UnicornItemVariant.Cryptotheology,
          checkForReset: true,
          triggerForReset: -1,
        },
        singularity: {
          require: false,
          enabled: false,
          variant: UnicornItemVariant.Cryptotheology,
          checkForReset: true,
          triggerForReset: -1,
        },
        blackLibrary: {
          require: false,
          enabled: false,
          variant: UnicornItemVariant.Cryptotheology,
          checkForReset: true,
          triggerForReset: -1,
        },
        blackRadiance: {
          require: false,
          enabled: false,
          variant: UnicornItemVariant.Cryptotheology,
          checkForReset: true,
          triggerForReset: -1,
        },
        blazar: {
          require: false,
          enabled: false,
          variant: UnicornItemVariant.Cryptotheology,
          checkForReset: true,
          triggerForReset: -1,
        },
        darkNova: {
          require: false,
          enabled: false,
          variant: UnicornItemVariant.Cryptotheology,
          checkForReset: true,
          triggerForReset: -1,
        },
        holyGenocide: {
          require: false,
          enabled: false,
          variant: UnicornItemVariant.Cryptotheology,
          checkForReset: true,
          triggerForReset: -1,
        },
      },
    },
    build: {
      enabled: true,
      trigger: 0,
      // The items that be automatically built.
      // Every item can define a required resource. This resource has to be available at a certain capacity for
      // the building to be built. The capacity requirement is defined by the trigger value set for the section.
      //
      // Additionally, for upgradeable buildings, the item can define which upgrade stage it refers to.
      // For upgraded buildings, the ID (or internal name) of the building can be controlled through the *name*
      // property. For other buildings, the key of the item itself is used.
      items: {
        // Housing
        hut: {
          name: "hut",
          require: "wood",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        logHouse: {
          name: "logHouse",
          require: "minerals",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        mansion: {
          name: "mansion",
          require: "titanium",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },

        // Craft bonuses
        workshop: {
          name: "workshop",
          require: "minerals",
          enabled: true,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        factory: {
          name: "factory",
          require: "titanium",
          enabled: true,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },

        // Production
        field: {
          name: "field",
          require: "catnip",
          enabled: true,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        pasture: {
          name: "pasture",
          require: "catnip",
          enabled: true,
          max: -1,
          stage: 0,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        solarFarm: {
          name: "solarFarm",
          require: "titanium",
          enabled: true,
          max: -1,
          stage: 1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        mine: {
          name: "mine",
          require: "wood",
          enabled: true,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        lumberMill: {
          name: "lumberMill",
          require: "minerals",
          enabled: true,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        aqueduct: {
          name: "aqueduct",
          require: "minerals",
          enabled: true,
          max: -1,
          stage: 0,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        hydroPlant: {
          name: "aqueduct",
          require: "titanium",
          enabled: true,
          max: -1,
          stage: 1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        oilWell: {
          name: "oilWell",
          require: "coal",
          enabled: true,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        quarry: {
          name: "quarry",
          require: "coal",
          enabled: true,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },

        // Conversion
        smelter: {
          name: "smelter",
          require: "minerals",
          enabled: true,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        biolab: {
          name: "biolab",
          require: "science",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        calciner: {
          name: "calciner",
          require: "titanium",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        reactor: {
          name: "reactor",
          require: "titanium",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        accelerator: {
          name: "accelerator",
          require: "titanium",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        steamworks: {
          name: "steamworks",
          require: false,
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        magneto: {
          name: "magneto",
          require: false,
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },

        // Science
        library: {
          name: "library",
          require: "wood",
          enabled: true,
          max: -1,
          stage: 0,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        dataCenter: {
          name: "library",
          require: false,
          enabled: true,
          max: -1,
          stage: 1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        academy: {
          name: "academy",
          require: "wood",
          enabled: true,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        observatory: {
          name: "observatory",
          require: "iron",
          enabled: true,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },

        // Other
        amphitheatre: {
          name: "amphitheatre",
          require: "minerals",
          enabled: true,
          max: -1,
          stage: 0,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        broadcastTower: {
          name: "amphitheatre",
          require: "titanium",
          enabled: true,
          max: -1,
          stage: 1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        tradepost: {
          name: "tradepost",
          require: "gold",
          enabled: true,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        chapel: {
          name: "tradepost",
          require: "minerals",
          enabled: true,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        temple: {
          name: "temple",
          require: "gold",
          enabled: true,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        mint: {
          name: "mint",
          require: false,
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        // unicornPasture: {require: false,         enabled: true},
        ziggurat: {
          name: "ziggurat",
          require: false,
          enabled: true,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        chronosphere: {
          name: "chronosphere",
          require: "unobtainium",
          enabled: true,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        aiCore: {
          name: "aiCore",
          require: false,
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        brewery: {
          name: "brewery",
          require: false,
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },

        // Storage
        barn: {
          name: "barn",
          require: "wood",
          enabled: true,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        harbor: {
          name: "harbor",
          require: false,
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        warehouse: {
          name: "warehouse",
          require: false,
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },

        // Zebras
        zebraOutpost: {
          name: "zebraOutpost",
          require: "bloodstone",
          enabled: true,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        zebraWorkshop: {
          name: "zebraWorkshop",
          require: "bloodstone",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        zebraForge: {
          name: "zebraForge",
          require: "bloodstone",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
      },
    },
    space: {
      enabled: false,
      trigger: 0,
      items: {
        // Cath
        spaceElevator: {
          name: "spaceElevator",
          require: "unobtainium",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        sattelite: {
          name: "sattelite",
          require: "titanium",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        spaceStation: {
          name: "spaceStation",
          require: "oil",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },

        // Moon
        moonOutpost: {
          name: "moonOutpost",
          require: "uranium",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        moonBase: {
          name: "moonBase",
          require: "unobtainium",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },

        // Dune
        planetCracker: {
          name: "planetCracker",
          require: "science",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        hydrofracturer: {
          name: "hydrofracturer",
          require: "science",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        spiceRefinery: {
          name: "spiceRefinery",
          require: "science",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },

        // Piscine
        researchVessel: {
          name: "researchVessel",
          require: "titanium",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        orbitalArray: {
          name: "orbitalArray",
          require: "eludium",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },

        // Helios
        sunlifter: {
          name: "sunlifter",
          require: "eludium",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        containmentChamber: {
          name: "containmentChamber",
          require: "science",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        heatsink: {
          name: "heatsink",
          require: "thorium",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        sunforge: {
          name: "sunforge",
          require: false,
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },

        // T-Minus
        cryostation: {
          name: "cryostation",
          require: "eludium",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },

        // Kairo
        spaceBeacon: {
          name: "spaceBeacon",
          require: "antimatter",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },

        // Yarn
        terraformingStation: {
          name: "terraformingStation",
          require: "antimatter",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        hydroponics: {
          name: "hydroponics",
          require: "kerosene",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },

        // Umbra
        hrHarvester: {
          name: "hrHarvester",
          require: "antimatter",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },

        // Charon
        entangler: {
          name: "entangler",
          require: "antimatter",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },

        // Centaurus
        tectonic: {
          name: "tectonic",
          require: "antimatter",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
        moltenCore: {
          name: "moltenCore",
          require: "uranium",
          enabled: false,
          max: -1,
          checkForReset: true,
          triggerForReset: -1,
          label: "",
        },
      },
    },
    time: {
      // Should time upgrades be built automatically?
      enabled: false,
      trigger: 0,
      items: {
        // Variants denote whether these buildings fall within the Chronoforge or Void categories.
        // Chronoforge has variant chrono.
        temporalBattery: {
          require: false,
          enabled: false,
          variant: TimeItemVariant.Unknown_chrono,
          checkForReset: true,
          triggerForReset: -1,
        },
        blastFurnace: {
          require: false,
          enabled: false,
          variant: TimeItemVariant.Unknown_chrono,
          checkForReset: true,
          triggerForReset: -1,
        },
        timeBoiler: {
          require: false,
          enabled: false,
          variant: TimeItemVariant.Unknown_chrono,
          checkForReset: true,
          triggerForReset: -1,
        },
        temporalAccelerator: {
          require: false,
          enabled: false,
          variant: TimeItemVariant.Unknown_chrono,
          checkForReset: true,
          triggerForReset: -1,
        },
        temporalImpedance: {
          require: false,
          enabled: false,
          variant: TimeItemVariant.Unknown_chrono,
          checkForReset: true,
          triggerForReset: -1,
        },
        ressourceRetrieval: {
          require: false,
          enabled: false,
          variant: TimeItemVariant.Unknown_chrono,
          checkForReset: true,
          triggerForReset: -1,
        },

        // Void Space has variant void.
        cryochambers: {
          require: false,
          enabled: false,
          variant: TimeItemVariant.VoidSpace,
          checkForReset: true,
          triggerForReset: -1,
        },
        voidHoover: {
          require: "antimatter",
          enabled: false,
          variant: TimeItemVariant.VoidSpace,
          checkForReset: true,
          triggerForReset: -1,
        },
        voidRift: {
          require: false,
          enabled: false,
          variant: TimeItemVariant.VoidSpace,
          checkForReset: true,
          triggerForReset: -1,
        },
        chronocontrol: {
          require: "temporalFlux",
          enabled: false,
          variant: TimeItemVariant.VoidSpace,
          checkForReset: true,
          triggerForReset: -1,
        },
        voidResonator: {
          require: false,
          enabled: false,
          variant: TimeItemVariant.VoidSpace,
          checkForReset: true,
          triggerForReset: -1,
        },
      },
    },
    timeCtrl: {
      enabled: true,
      items: {
        accelerateTime: {
          enabled: true,
          subTrigger: 1,
          misc: true,
          label: i18n("option.accelerate"),
        },
        timeSkip: {
          enabled: false,
          subTrigger: 5,
          misc: true,
          label: i18n("option.time.skip"),
          maximum: 50,
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
          spring: true,
          summer: false,
          autumn: false,
          winter: false,
        },
        reset: { enabled: false, subTrigger: 99999, misc: true, label: i18n("option.time.reset") },
      },
    },
    craft: {
      enabled: true,
      trigger: 0.95,
      items: {
        wood: { require: "catnip", max: 0, limited: true, limRat: 0.5, enabled: true },
        beam: { require: "wood", max: 0, limited: true, limRat: 0.5, enabled: true },
        slab: { require: "minerals", max: 0, limited: true, limRat: 0.5, enabled: true },
        steel: { require: "coal", max: 0, limited: true, limRat: 0.5, enabled: true },
        plate: { require: "iron", max: 0, limited: true, limRat: 0.5, enabled: true },
        alloy: { require: "titanium", max: 0, limited: true, limRat: 0.5, enabled: true },
        concrate: { require: false, max: 0, limited: true, limRat: 0.5, enabled: true },
        gear: { require: false, max: 0, limited: true, limRat: 0.5, enabled: true },
        scaffold: { require: false, max: 0, limited: true, limRat: 0.5, enabled: true },
        ship: { require: false, max: 0, limited: true, limRat: 0.5, enabled: true },
        tanker: { require: false, max: 0, limited: true, limRat: 0.5, enabled: true },
        parchment: { require: false, max: 0, limited: false, limRat: 0.5, enabled: true },
        manuscript: { require: "culture", max: 0, limited: true, limRat: 0.5, enabled: true },
        compedium: { require: "science", max: 0, limited: true, limRat: 0.5, enabled: true },
        blueprint: { require: "science", max: 0, limited: true, limRat: 0.5, enabled: true },
        kerosene: { require: "oil", max: 0, limited: true, limRat: 0.5, enabled: true },
        megalith: { require: false, max: 0, limited: true, limRat: 0.5, enabled: true },
        eludium: { require: "unobtainium", max: 0, limited: true, limRat: 0.5, enabled: true },
        thorium: { require: "uranium", max: 0, limited: true, limRat: 0.5, enabled: true },
      },
    },
    trade: {
      enabled: true,
      trigger: 0.98,
      items: {
        dragons: {
          enabled: true,
          require: "titanium",
          allowcapped: false,
          limited: true,
          summer: true,
          autumn: true,
          winter: true,
          spring: true,
        },

        zebras: {
          enabled: true,
          require: false,
          allowcapped: false,
          limited: true,
          summer: true,
          autumn: true,
          winter: true,
          spring: true,
        },

        lizards: {
          enabled: true,
          require: "minerals",
          allowcapped: false,
          limited: true,
          summer: true,
          autumn: false,
          winter: false,
          spring: false,
        },

        sharks: {
          enabled: true,
          require: "iron",
          allowcapped: false,
          limited: true,
          summer: false,
          autumn: false,
          winter: true,
          spring: false,
        },

        griffins: {
          enabled: true,
          require: "wood",
          allowcapped: false,
          limited: true,
          summer: false,
          autumn: true,
          winter: false,
          spring: false,
        },

        nagas: {
          enabled: true,
          require: false,
          allowcapped: false,
          limited: true,
          summer: false,
          autumn: false,
          winter: false,
          spring: true,
        },

        spiders: {
          enabled: true,
          require: false,
          allowcapped: false,
          limited: true,
          summer: false,
          autumn: true,
          winter: false,
          spring: false,
        },

        leviathans: {
          enabled: true,
          require: "unobtainium",
          allowcapped: true,
          limited: true,
          summer: true,
          autumn: true,
          winter: true,
          spring: true,
        },
      },
    },
    upgrade: {
      enabled: false,
      items: {
        upgrades: { enabled: true },
        techs: { enabled: true },
        races: { enabled: true },
        missions: { enabled: true },
        buildings: { enabled: true },
      },
    },
    options: {
      //Which misc options should be enabled?
      enabled: true,
      items: {
        observe: { enabled: true, misc: true, label: i18n("option.observe") },
        festival: { enabled: true, misc: true, label: i18n("option.festival") },
        shipOverride: { enabled: true, misc: true, label: i18n("option.shipOverride") },
        autofeed: { enabled: true, misc: true, label: i18n("option.autofeed") },
        hunt: { enabled: true, subTrigger: 0.98, misc: true, label: i18n("option.hunt") },
        promote: { enabled: true, misc: true, label: i18n("option.promote") },
        crypto: { enabled: true, subTrigger: 10000, misc: true, label: i18n("option.crypto") },
        fixCry: { enabled: false, misc: true, label: i18n("option.fix.cry") },
        buildEmbassies: {
          enabled: true,
          subTrigger: 0.9,
          misc: true,
          label: i18n("option.embassies"),
        },
        style: { enabled: true, misc: true, label: i18n("option.style") },
        explore: { enabled: false, misc: true, label: i18n("option.explore") },
        _steamworks: { enabled: false, misc: true, label: i18n("option.steamworks") },
      },
    },
    distribute: {
      enabled: false,
      items: {
        woodcutter: { enabled: true, max: 1, limited: false },
        farmer: { enabled: true, max: 1, limited: false },
        scholar: { enabled: true, max: 1, limited: false },
        hunter: { enabled: true, max: 1, limited: false },
        miner: { enabled: true, max: 1, limited: false },
        priest: { enabled: true, max: 1, limited: false },
        geologist: { enabled: true, max: 1, limited: false },
        engineer: { enabled: true, max: 1, limited: false },
      },
    },
    filter: {
      //
      enabled: false,
      items: {
        buildFilter: {
          enabled: false,
          filter: true,
          label: i18n("filter.build"),
          variant: FilterItemVariant.Build,
        },
        craftFilter: {
          enabled: false,
          filter: true,
          label: i18n("filter.craft"),
          variant: FilterItemVariant.Craft,
        },
        upgradeFilter: {
          enabled: false,
          filter: true,
          label: i18n("filter.upgrade"),
          variant: FilterItemVariant.Upgrade,
        },
        researchFilter: {
          enabled: false,
          filter: true,
          label: i18n("filter.research"),
          variant: FilterItemVariant.Research,
        },
        tradeFilter: {
          enabled: false,
          filter: true,
          label: i18n("filter.trade"),
          variant: FilterItemVariant.Trade,
        },
        huntFilter: {
          enabled: false,
          filter: true,
          label: i18n("filter.hunt"),
          variant: FilterItemVariant.Hunt,
        },
        praiseFilter: {
          enabled: false,
          filter: true,
          label: i18n("filter.praise"),
          variant: FilterItemVariant.Praise,
        },
        adoreFilter: {
          enabled: false,
          filter: true,
          label: i18n("filter.adore"),
          variant: FilterItemVariant.Adore,
        },
        transcendFilter: {
          enabled: false,
          filter: true,
          label: i18n("filter.transcend"),
          variant: FilterItemVariant.Transcend,
        },
        faithFilter: {
          enabled: false,
          filter: true,
          label: i18n("filter.faith"),
          variant: FilterItemVariant.Faith,
        },
        accelerateFilter: {
          enabled: false,
          filter: true,
          label: i18n("filter.accelerate"),
          variant: FilterItemVariant.Accelerate,
        },
        timeSkipFilter: {
          enabled: false,
          filter: true,
          label: i18n("filter.time.skip"),
          variant: FilterItemVariant.TimeSkip,
        },
        festivalFilter: {
          enabled: false,
          filter: true,
          label: i18n("filter.festival"),
          variant: FilterItemVariant.Festival,
        },
        starFilter: {
          enabled: false,
          filter: true,
          label: i18n("filter.star"),
          variant: FilterItemVariant.Star,
        },
        distributeFilter: {
          enabled: false,
          filter: true,
          label: i18n("filter.distribute"),
          variant: FilterItemVariant.Distribute,
        },
        promoteFilter: {
          enabled: false,
          filter: true,
          label: i18n("filter.promote"),
          variant: FilterItemVariant.Promote,
        },
        miscFilter: {
          enabled: false,
          filter: true,
          label: i18n("filter.misc"),
          variant: FilterItemVariant.Misc,
        },
      },
    },
    resources: {
      furs: { enabled: true, stock: 1000, checkForReset: false, stockForReset: Infinity },
      timeCrystal: { enabled: false, stock: 0, checkForReset: true, stockForReset: 500000 },
    },
    cache: {
      cache: [],
      cacheSum: {},
    },
  },
};
