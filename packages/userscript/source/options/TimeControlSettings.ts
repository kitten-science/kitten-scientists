import { objectEntries } from "../tools/Entries";
import { isNil, mustExist } from "../tools/Maybe";
import { SpaceBuildings, TimeItemVariant, UnicornItemVariant } from "../types";
import { BonfireItem } from "./BonfireSettings";
import { FaithItem, UnicornItem } from "./ReligionSettings";
import { Setting, SettingTrigger } from "./Settings";
import { SettingsSection } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";
import { TimeItem } from "./TimeSettings";

export type CycleIndices = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type TimeControlItem = "accelerateTime" | "reset" | "timeSkip";

export class TimeControlResourcesSettingsItem extends Setting {
  stock = 0;
  $stock?: JQuery<HTMLElement>;

  constructor(enabled: boolean, stock: number) {
    super(enabled);
    this.stock = stock;
  }
}

export class TimeControlResourceSettings {
  alloy = new TimeControlResourcesSettingsItem(false, 0);
  antimatter = new TimeControlResourcesSettingsItem(false, 0);
  beam = new TimeControlResourcesSettingsItem(false, 0);
  blackcoin = new TimeControlResourcesSettingsItem(false, 0);
  bloodstone = new TimeControlResourcesSettingsItem(false, 0);
  blueprint = new TimeControlResourcesSettingsItem(false, 0);
  catnip = new TimeControlResourcesSettingsItem(false, 0);
  coal = new TimeControlResourcesSettingsItem(false, 0);
  compedium = new TimeControlResourcesSettingsItem(false, 0);
  concrate = new TimeControlResourcesSettingsItem(false, 0);
  culture = new TimeControlResourcesSettingsItem(false, 0);
  eludium = new TimeControlResourcesSettingsItem(false, 0);
  faith = new TimeControlResourcesSettingsItem(false, 0);
  furs = new TimeControlResourcesSettingsItem(false, 0);
  gear = new TimeControlResourcesSettingsItem(false, 0);
  gold = new TimeControlResourcesSettingsItem(false, 0);
  iron = new TimeControlResourcesSettingsItem(false, 0);
  ivory = new TimeControlResourcesSettingsItem(false, 0);
  karma = new TimeControlResourcesSettingsItem(false, 0);
  kerosene = new TimeControlResourcesSettingsItem(false, 0);
  manpower = new TimeControlResourcesSettingsItem(false, 0);
  manuscript = new TimeControlResourcesSettingsItem(false, 0);
  megalith = new TimeControlResourcesSettingsItem(false, 0);
  minerals = new TimeControlResourcesSettingsItem(false, 0);
  necrocorn = new TimeControlResourcesSettingsItem(false, 0);
  oil = new TimeControlResourcesSettingsItem(false, 0);
  paragon = new TimeControlResourcesSettingsItem(false, 0);
  parchment = new TimeControlResourcesSettingsItem(false, 0);
  plate = new TimeControlResourcesSettingsItem(false, 0);
  relic = new TimeControlResourcesSettingsItem(false, 0);
  scaffold = new TimeControlResourcesSettingsItem(false, 0);
  science = new TimeControlResourcesSettingsItem(false, 0);
  ship = new TimeControlResourcesSettingsItem(false, 0);
  slab = new TimeControlResourcesSettingsItem(false, 0);
  spice = new TimeControlResourcesSettingsItem(false, 0);
  steel = new TimeControlResourcesSettingsItem(false, 0);
  tanker = new TimeControlResourcesSettingsItem(false, 0);
  tears = new TimeControlResourcesSettingsItem(false, 0);
  temporalFlux = new TimeControlResourcesSettingsItem(false, 0);
  thorium = new TimeControlResourcesSettingsItem(false, 0);
  timeCrystal = new TimeControlResourcesSettingsItem(false, 0);
  titanium = new TimeControlResourcesSettingsItem(false, 0);
  unicorns = new TimeControlResourcesSettingsItem(false, 0);
  unobtainium = new TimeControlResourcesSettingsItem(false, 0);
  uranium = new TimeControlResourcesSettingsItem(false, 0);
  void = new TimeControlResourcesSettingsItem(false, 0);
  wood = new TimeControlResourcesSettingsItem(false, 0);
  zebras = new TimeControlResourcesSettingsItem(false, 0);
}

export class TimeControlReligionSettingsItem extends SettingTrigger {
  variant: UnicornItemVariant;

  constructor(variant: UnicornItemVariant, enabled = false, trigger = 1) {
    super(enabled, trigger);
    this.variant = variant;
  }
}

export class TimeControlTimeSettingsItem extends SettingTrigger {
  variant: TimeItemVariant;

  constructor(variant: TimeItemVariant, enabled = false, trigger = 1) {
    super(enabled, trigger);
    this.variant = variant;
  }
}

export class TimeControlTimeSkipSettings extends SettingTrigger {
  maximum = 50;
  $maximum?: JQuery<HTMLElement>;

  spring = true;
  $spring?: JQuery<HTMLElement>;
  summer = false;
  $summer?: JQuery<HTMLElement>;
  autumn = false;
  $autumn?: JQuery<HTMLElement>;
  winter = false;
  $winter?: JQuery<HTMLElement>;

  0 = false;
  1 = false;
  2 = false;
  3 = false;
  4 = false;
  5 = false;
  6 = false;
  7 = false;
  8 = false;
  9 = false;
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

  constructor() {
    super(false, 5);
  }
}

export type TimeControlBuildSettingItems = {
  // unicornPasture is handled in the Religion section.
  [item in Exclude<BonfireItem, "unicornPasture">]: SettingTrigger;
};
export type TimeControlReligionSettingItems = {
  [item in FaithItem | UnicornItem]: TimeControlReligionSettingsItem;
};
export type TimeControlSpaceSettingItems = {
  [item in SpaceBuildings]: SettingTrigger;
};
export type TimeControlTimeSettingItems = {
  [item in TimeItem]: TimeControlTimeSettingsItem;
};

export class TimeControlSettings extends SettingsSection {
  buildItems: TimeControlBuildSettingItems = {
    hut: new SettingTrigger(true, -1),
    logHouse: new SettingTrigger(true, -1),
    mansion: new SettingTrigger(true, -1),

    workshop: new SettingTrigger(true, -1),
    factory: new SettingTrigger(true, -1),

    field: new SettingTrigger(true, -1),
    pasture: new SettingTrigger(true, -1),
    solarFarm: new SettingTrigger(true, -1),
    mine: new SettingTrigger(true, -1),
    lumberMill: new SettingTrigger(true, -1),
    aqueduct: new SettingTrigger(true, -1),
    hydroPlant: new SettingTrigger(true, -1),
    oilWell: new SettingTrigger(true, -1),
    quarry: new SettingTrigger(true, -1),

    smelter: new SettingTrigger(true, -1),
    biolab: new SettingTrigger(true, -1),
    calciner: new SettingTrigger(true, -1),
    reactor: new SettingTrigger(true, -1),
    accelerator: new SettingTrigger(true, -1),
    steamworks: new SettingTrigger(true, -1),
    magneto: new SettingTrigger(true, -1),

    library: new SettingTrigger(true, -1),
    dataCenter: new SettingTrigger(true, -1),
    academy: new SettingTrigger(true, -1),
    observatory: new SettingTrigger(true, -1),

    amphitheatre: new SettingTrigger(true, -1),
    broadcastTower: new SettingTrigger(true, -1),
    tradepost: new SettingTrigger(true, -1),
    chapel: new SettingTrigger(true, -1),
    temple: new SettingTrigger(true, -1),
    mint: new SettingTrigger(true, -1),
    ziggurat: new SettingTrigger(true, -1),
    chronosphere: new SettingTrigger(true, -1),
    aiCore: new SettingTrigger(true, -1),
    brewery: new SettingTrigger(true, -1),

    barn: new SettingTrigger(true, -1),
    harbor: new SettingTrigger(true, -1),
    warehouse: new SettingTrigger(true, -1),

    zebraOutpost: new SettingTrigger(true, -1),
    zebraWorkshop: new SettingTrigger(true, -1),
    zebraForge: new SettingTrigger(true, -1),
  };

  religionItems: TimeControlReligionSettingItems = {
    unicornPasture: new TimeControlReligionSettingsItem(
      UnicornItemVariant.UnicornPasture,
      true,
      -1
    ),
    unicornTomb: new TimeControlReligionSettingsItem(UnicornItemVariant.Ziggurat, true, -1),
    ivoryTower: new TimeControlReligionSettingsItem(UnicornItemVariant.Ziggurat, true, -1),
    ivoryCitadel: new TimeControlReligionSettingsItem(UnicornItemVariant.Ziggurat, true, -1),
    skyPalace: new TimeControlReligionSettingsItem(UnicornItemVariant.Ziggurat, true, -1),
    unicornUtopia: new TimeControlReligionSettingsItem(UnicornItemVariant.Ziggurat, true, -1),
    sunspire: new TimeControlReligionSettingsItem(UnicornItemVariant.Ziggurat, true, -1),

    marker: new TimeControlReligionSettingsItem(UnicornItemVariant.Ziggurat, true, -1),
    unicornGraveyard: new TimeControlReligionSettingsItem(UnicornItemVariant.Ziggurat, true, -1),
    unicornNecropolis: new TimeControlReligionSettingsItem(UnicornItemVariant.Ziggurat, true, -1),
    blackPyramid: new TimeControlReligionSettingsItem(UnicornItemVariant.Ziggurat, true, -1),

    solarchant: new TimeControlReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1),
    scholasticism: new TimeControlReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1),
    goldenSpire: new TimeControlReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1),
    sunAltar: new TimeControlReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1),
    stainedGlass: new TimeControlReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1),
    solarRevolution: new TimeControlReligionSettingsItem(
      UnicornItemVariant.OrderOfTheSun,
      true,
      -1
    ),
    basilica: new TimeControlReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1),
    templars: new TimeControlReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1),
    apocripha: new TimeControlReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1),
    transcendence: new TimeControlReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1),

    blackObelisk: new TimeControlReligionSettingsItem(UnicornItemVariant.Cryptotheology, true, -1),
    blackNexus: new TimeControlReligionSettingsItem(UnicornItemVariant.Cryptotheology, true, -1),
    blackCore: new TimeControlReligionSettingsItem(UnicornItemVariant.Cryptotheology, true, -1),
    singularity: new TimeControlReligionSettingsItem(UnicornItemVariant.Cryptotheology, true, -1),
    blackLibrary: new TimeControlReligionSettingsItem(UnicornItemVariant.Cryptotheology, true, -1),
    blackRadiance: new TimeControlReligionSettingsItem(UnicornItemVariant.Cryptotheology, true, -1),
    blazar: new TimeControlReligionSettingsItem(UnicornItemVariant.Cryptotheology, true, -1),
    darkNova: new TimeControlReligionSettingsItem(UnicornItemVariant.Cryptotheology, true, -1),
    holyGenocide: new TimeControlReligionSettingsItem(UnicornItemVariant.Cryptotheology, true, -1),
  };

  spaceItems: TimeControlSpaceSettingItems = {
    // Cath
    spaceElevator: new SettingTrigger(true, -1),
    sattelite: new SettingTrigger(true, -1),
    spaceStation: new SettingTrigger(true, -1),

    // Moon
    moonOutpost: new SettingTrigger(true, -1),
    moonBase: new SettingTrigger(true, -1),

    // Dune
    planetCracker: new SettingTrigger(true, -1),
    hydrofracturer: new SettingTrigger(true, -1),
    spiceRefinery: new SettingTrigger(true, -1),

    // Piscine
    researchVessel: new SettingTrigger(true, -1),
    orbitalArray: new SettingTrigger(true, -1),

    // Helios
    sunlifter: new SettingTrigger(true, -1),
    containmentChamber: new SettingTrigger(true, -1),
    heatsink: new SettingTrigger(true, -1),
    sunforge: new SettingTrigger(true, -1),

    // T-Minus
    cryostation: new SettingTrigger(true, -1),

    // Kairo
    spaceBeacon: new SettingTrigger(true, -1),

    // Yarn
    terraformingStation: new SettingTrigger(true, -1),
    hydroponics: new SettingTrigger(true, -1),

    // Umbra
    hrHarvester: new SettingTrigger(true, -1),

    // Charon
    entangler: new SettingTrigger(true, -1),

    // Centaurus
    tectonic: new SettingTrigger(true, -1),
    moltenCore: new SettingTrigger(true, -1),
  };

  timeItems: TimeControlTimeSettingItems = {
    temporalBattery: new TimeControlTimeSettingsItem(TimeItemVariant.Chronoforge, true, -1),
    blastFurnace: new TimeControlTimeSettingsItem(TimeItemVariant.Chronoforge, true, -1),
    timeBoiler: new TimeControlTimeSettingsItem(TimeItemVariant.Chronoforge, true, -1),
    temporalAccelerator: new TimeControlTimeSettingsItem(TimeItemVariant.Chronoforge, true, -1),
    temporalImpedance: new TimeControlTimeSettingsItem(TimeItemVariant.Chronoforge, true, -1),
    ressourceRetrieval: new TimeControlTimeSettingsItem(TimeItemVariant.Chronoforge, true, -1),

    cryochambers: new TimeControlTimeSettingsItem(TimeItemVariant.VoidSpace, true, -1),
    voidHoover: new TimeControlTimeSettingsItem(TimeItemVariant.VoidSpace, true, -1),
    voidRift: new TimeControlTimeSettingsItem(TimeItemVariant.VoidSpace, true, -1),
    chronocontrol: new TimeControlTimeSettingsItem(TimeItemVariant.VoidSpace, true, -1),
    voidResonator: new TimeControlTimeSettingsItem(TimeItemVariant.VoidSpace, true, -1),
  };

  resources: TimeControlResourceSettings;

  accelerateTime: SettingTrigger;
  timeSkip: TimeControlTimeSkipSettings;
  reset: Setting;

  constructor(
    enabled = false,
    buildItems = {
      hut: new SettingTrigger(true, -1),
      logHouse: new SettingTrigger(true, -1),
      mansion: new SettingTrigger(true, -1),

      workshop: new SettingTrigger(true, -1),
      factory: new SettingTrigger(true, -1),

      field: new SettingTrigger(true, -1),
      pasture: new SettingTrigger(true, -1),
      solarFarm: new SettingTrigger(true, -1),
      mine: new SettingTrigger(true, -1),
      lumberMill: new SettingTrigger(true, -1),
      aqueduct: new SettingTrigger(true, -1),
      hydroPlant: new SettingTrigger(true, -1),
      oilWell: new SettingTrigger(true, -1),
      quarry: new SettingTrigger(true, -1),

      smelter: new SettingTrigger(true, -1),
      biolab: new SettingTrigger(true, -1),
      calciner: new SettingTrigger(true, -1),
      reactor: new SettingTrigger(true, -1),
      accelerator: new SettingTrigger(true, -1),
      steamworks: new SettingTrigger(true, -1),
      magneto: new SettingTrigger(true, -1),

      library: new SettingTrigger(true, -1),
      dataCenter: new SettingTrigger(true, -1),
      academy: new SettingTrigger(true, -1),
      observatory: new SettingTrigger(true, -1),

      amphitheatre: new SettingTrigger(true, -1),
      broadcastTower: new SettingTrigger(true, -1),
      tradepost: new SettingTrigger(true, -1),
      chapel: new SettingTrigger(true, -1),
      temple: new SettingTrigger(true, -1),
      mint: new SettingTrigger(true, -1),
      ziggurat: new SettingTrigger(true, -1),
      chronosphere: new SettingTrigger(true, -1),
      aiCore: new SettingTrigger(true, -1),
      brewery: new SettingTrigger(true, -1),

      barn: new SettingTrigger(true, -1),
      harbor: new SettingTrigger(true, -1),
      warehouse: new SettingTrigger(true, -1),

      zebraOutpost: new SettingTrigger(true, -1),
      zebraWorkshop: new SettingTrigger(true, -1),
      zebraForge: new SettingTrigger(true, -1),
    },
    religionItems = {
      unicornPasture: new TimeControlReligionSettingsItem(
        UnicornItemVariant.UnicornPasture,
        true,
        -1
      ),
      unicornTomb: new TimeControlReligionSettingsItem(UnicornItemVariant.Ziggurat, true, -1),
      ivoryTower: new TimeControlReligionSettingsItem(UnicornItemVariant.Ziggurat, true, -1),
      ivoryCitadel: new TimeControlReligionSettingsItem(UnicornItemVariant.Ziggurat, true, -1),
      skyPalace: new TimeControlReligionSettingsItem(UnicornItemVariant.Ziggurat, true, -1),
      unicornUtopia: new TimeControlReligionSettingsItem(UnicornItemVariant.Ziggurat, true, -1),
      sunspire: new TimeControlReligionSettingsItem(UnicornItemVariant.Ziggurat, true, -1),

      marker: new TimeControlReligionSettingsItem(UnicornItemVariant.Ziggurat, true, -1),
      unicornGraveyard: new TimeControlReligionSettingsItem(UnicornItemVariant.Ziggurat, true, -1),
      unicornNecropolis: new TimeControlReligionSettingsItem(UnicornItemVariant.Ziggurat, true, -1),
      blackPyramid: new TimeControlReligionSettingsItem(UnicornItemVariant.Ziggurat, true, -1),

      solarchant: new TimeControlReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1),
      scholasticism: new TimeControlReligionSettingsItem(
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      goldenSpire: new TimeControlReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1),
      sunAltar: new TimeControlReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1),
      stainedGlass: new TimeControlReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1),
      solarRevolution: new TimeControlReligionSettingsItem(
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      basilica: new TimeControlReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1),
      templars: new TimeControlReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1),
      apocripha: new TimeControlReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1),
      transcendence: new TimeControlReligionSettingsItem(
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),

      blackObelisk: new TimeControlReligionSettingsItem(
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      blackNexus: new TimeControlReligionSettingsItem(UnicornItemVariant.Cryptotheology, true, -1),
      blackCore: new TimeControlReligionSettingsItem(UnicornItemVariant.Cryptotheology, true, -1),
      singularity: new TimeControlReligionSettingsItem(UnicornItemVariant.Cryptotheology, true, -1),
      blackLibrary: new TimeControlReligionSettingsItem(
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      blackRadiance: new TimeControlReligionSettingsItem(
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      blazar: new TimeControlReligionSettingsItem(UnicornItemVariant.Cryptotheology, true, -1),
      darkNova: new TimeControlReligionSettingsItem(UnicornItemVariant.Cryptotheology, true, -1),
      holyGenocide: new TimeControlReligionSettingsItem(
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
    },
    spaceItems = {
      // Cath
      spaceElevator: new SettingTrigger(true, -1),
      sattelite: new SettingTrigger(true, -1),
      spaceStation: new SettingTrigger(true, -1),

      // Moon
      moonOutpost: new SettingTrigger(true, -1),
      moonBase: new SettingTrigger(true, -1),

      // Dune
      planetCracker: new SettingTrigger(true, -1),
      hydrofracturer: new SettingTrigger(true, -1),
      spiceRefinery: new SettingTrigger(true, -1),

      // Piscine
      researchVessel: new SettingTrigger(true, -1),
      orbitalArray: new SettingTrigger(true, -1),

      // Helios
      sunlifter: new SettingTrigger(true, -1),
      containmentChamber: new SettingTrigger(true, -1),
      heatsink: new SettingTrigger(true, -1),
      sunforge: new SettingTrigger(true, -1),

      // T-Minus
      cryostation: new SettingTrigger(true, -1),

      // Kairo
      spaceBeacon: new SettingTrigger(true, -1),

      // Yarn
      terraformingStation: new SettingTrigger(true, -1),
      hydroponics: new SettingTrigger(true, -1),

      // Umbra
      hrHarvester: new SettingTrigger(true, -1),

      // Charon
      entangler: new SettingTrigger(true, -1),

      // Centaurus
      tectonic: new SettingTrigger(true, -1),
      moltenCore: new SettingTrigger(true, -1),
    },
    timeItems = {
      temporalBattery: new TimeControlTimeSettingsItem(TimeItemVariant.Chronoforge, true, -1),
      blastFurnace: new TimeControlTimeSettingsItem(TimeItemVariant.Chronoforge, true, -1),
      timeBoiler: new TimeControlTimeSettingsItem(TimeItemVariant.Chronoforge, true, -1),
      temporalAccelerator: new TimeControlTimeSettingsItem(TimeItemVariant.Chronoforge, true, -1),
      temporalImpedance: new TimeControlTimeSettingsItem(TimeItemVariant.Chronoforge, true, -1),
      ressourceRetrieval: new TimeControlTimeSettingsItem(TimeItemVariant.Chronoforge, true, -1),

      cryochambers: new TimeControlTimeSettingsItem(TimeItemVariant.VoidSpace, true, -1),
      voidHoover: new TimeControlTimeSettingsItem(TimeItemVariant.VoidSpace, true, -1),
      voidRift: new TimeControlTimeSettingsItem(TimeItemVariant.VoidSpace, true, -1),
      chronocontrol: new TimeControlTimeSettingsItem(TimeItemVariant.VoidSpace, true, -1),
      voidResonator: new TimeControlTimeSettingsItem(TimeItemVariant.VoidSpace, true, -1),
    },
    resources = new TimeControlResourceSettings(),
    accelerateTime = new SettingTrigger(true, 1),
    timeSkip = new TimeControlTimeSkipSettings(),
    reset = new Setting(false)
  ) {
    super(enabled);
    this.buildItems = buildItems;
    this.religionItems = religionItems;
    this.spaceItems = spaceItems;
    this.timeItems = timeItems;
    this.resources = resources;
    this.accelerateTime = accelerateTime;
    this.timeSkip = timeSkip;
    this.reset = reset;
  }

  load(settings: TimeControlSettings) {
    this.enabled = settings.enabled;

    this.accelerateTime.enabled = settings.accelerateTime.enabled;
    this.timeSkip.enabled = settings.timeSkip.enabled;
    this.reset.enabled = settings.reset.enabled;

    this.accelerateTime.trigger = settings.accelerateTime.trigger;

    this.timeSkip.trigger = settings.timeSkip.trigger;
    this.timeSkip.autumn = settings.timeSkip.autumn;
    this.timeSkip.spring = settings.timeSkip.spring;
    this.timeSkip.summer = settings.timeSkip.summer;
    this.timeSkip.winter = settings.timeSkip.winter;

    for (let cycleIndex = 0; cycleIndex < 10; ++cycleIndex) {
      this.timeSkip[cycleIndex as CycleIndices] = settings.timeSkip[cycleIndex as CycleIndices];
    }

    for (const [name, item] of objectEntries(this.buildItems)) {
      item.enabled = settings.buildItems[name].enabled;
      item.trigger = settings.buildItems[name].trigger;
    }
    for (const [name, item] of objectEntries(this.religionItems)) {
      item.enabled = settings.religionItems[name].enabled;
      item.trigger = settings.religionItems[name].trigger;
    }
    for (const [name, item] of objectEntries(this.spaceItems)) {
      item.enabled = settings.spaceItems[name].enabled;
      item.trigger = settings.spaceItems[name].trigger;
    }
    for (const [name, item] of objectEntries(this.timeItems)) {
      item.enabled = settings.timeItems[name].enabled;
      item.trigger = settings.timeItems[name].trigger;
    }

    for (const [name, item] of objectEntries(settings.resources)) {
      this.resources[name].enabled = item.enabled;
      this.resources[name].stock = item.stock;
    }
  }

  static toLegacyOptions(settings: TimeControlSettings, subject: KittenStorageType) {
    subject.toggles.timeCtrl = settings.enabled;

    subject.items["toggle-accelerateTime"] = settings.accelerateTime.enabled;
    subject.items["set-accelerateTime-trigger"] = settings.accelerateTime.trigger;

    subject.items["toggle-reset"] = settings.reset.enabled;

    subject.items["toggle-timeSkip"] = settings.timeSkip.enabled;
    subject.items["set-timeSkip-trigger"] = settings.timeSkip.trigger;
    subject.items["toggle-timeSkip-autumn"] = settings.timeSkip.autumn;
    subject.items["toggle-timeSkip-spring"] = settings.timeSkip.spring;
    subject.items["toggle-timeSkip-summer"] = settings.timeSkip.summer;
    subject.items["toggle-timeSkip-winter"] = settings.timeSkip.winter;

    for (let cycleIndex = 0; cycleIndex < 10; ++cycleIndex) {
      subject.items[`toggle-timeSkip-${cycleIndex as CycleIndices}` as const] =
        settings.timeSkip[cycleIndex as CycleIndices];
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
      if (isNil(subject.resources[name])) {
        subject.resources[name] = {
          checkForReset: item.enabled,
          stockForReset: item.stock,
          consume: 0,
          enabled: false,
          stock: 0,
        };
        continue;
      }

      mustExist(subject.resources[name]).checkForReset = item.enabled;
      mustExist(subject.resources[name]).stockForReset = item.stock;
    }
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new TimeControlSettings();
    options.enabled = subject.toggles.timeCtrl;

    options.accelerateTime.enabled =
      subject.items["toggle-accelerateTime"] ?? options.accelerateTime.enabled;
    options.timeSkip.enabled = subject.items["toggle-timeSkip"] ?? options.timeSkip.enabled;
    options.reset.enabled = subject.items["toggle-reset"] ?? options.reset.enabled;

    options.accelerateTime.trigger =
      subject.items["set-accelerateTime-trigger"] ?? options.accelerateTime.trigger;

    options.timeSkip.trigger = subject.items["set-timeSkip-trigger"] ?? options.timeSkip.trigger;
    options.timeSkip.autumn = subject.items["toggle-timeSkip-autumn"] ?? options.timeSkip.autumn;
    options.timeSkip.spring = subject.items["toggle-timeSkip-spring"] ?? options.timeSkip.spring;
    options.timeSkip.summer = subject.items["toggle-timeSkip-summer"] ?? options.timeSkip.summer;
    options.timeSkip.winter = subject.items["toggle-timeSkip-winter"] ?? options.timeSkip.winter;

    for (let cycleIndex = 0; cycleIndex < 10; ++cycleIndex) {
      options.timeSkip[cycleIndex as CycleIndices] =
        subject.items[`toggle-timeSkip-${cycleIndex as CycleIndices}` as const] ??
        options.timeSkip[cycleIndex as CycleIndices];
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

    for (const [name, item] of objectEntries(subject.resources)) {
      if (!item.checkForReset) {
        continue;
      }
      options.resources[name].enabled = item.enabled;
      options.resources[name].stock = item.stock;
    }

    return options;
  }
}
