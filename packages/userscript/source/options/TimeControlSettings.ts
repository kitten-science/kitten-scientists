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

  constructor(id: string, enabled: boolean, stock: number) {
    super(id, enabled);
    this.stock = stock;
  }
}

export class TimeControlResourceSettings {
  alloy = new TimeControlResourcesSettingsItem("alloy", false, 0);
  antimatter = new TimeControlResourcesSettingsItem("antimatter", false, 0);
  beam = new TimeControlResourcesSettingsItem("beam", false, 0);
  blackcoin = new TimeControlResourcesSettingsItem("blackcoin", false, 0);
  bloodstone = new TimeControlResourcesSettingsItem("bloodstone", false, 0);
  blueprint = new TimeControlResourcesSettingsItem("blueprint", false, 0);
  catnip = new TimeControlResourcesSettingsItem("catnip", false, 0);
  coal = new TimeControlResourcesSettingsItem("coal", false, 0);
  compedium = new TimeControlResourcesSettingsItem("compedium", false, 0);
  concrate = new TimeControlResourcesSettingsItem("concrate", false, 0);
  culture = new TimeControlResourcesSettingsItem("culture", false, 0);
  eludium = new TimeControlResourcesSettingsItem("eludium", false, 0);
  faith = new TimeControlResourcesSettingsItem("faith", false, 0);
  furs = new TimeControlResourcesSettingsItem("furs", false, 0);
  gear = new TimeControlResourcesSettingsItem("gear", false, 0);
  gold = new TimeControlResourcesSettingsItem("gold", false, 0);
  iron = new TimeControlResourcesSettingsItem("iron", false, 0);
  ivory = new TimeControlResourcesSettingsItem("ivory", false, 0);
  karma = new TimeControlResourcesSettingsItem("karma", false, 0);
  kerosene = new TimeControlResourcesSettingsItem("kerosene", false, 0);
  manpower = new TimeControlResourcesSettingsItem("manpower", false, 0);
  manuscript = new TimeControlResourcesSettingsItem("manuscript", false, 0);
  megalith = new TimeControlResourcesSettingsItem("megalith", false, 0);
  minerals = new TimeControlResourcesSettingsItem("minerals", false, 0);
  necrocorn = new TimeControlResourcesSettingsItem("necrocorn", false, 0);
  oil = new TimeControlResourcesSettingsItem("oil", false, 0);
  paragon = new TimeControlResourcesSettingsItem("paragon", false, 0);
  parchment = new TimeControlResourcesSettingsItem("parchment", false, 0);
  plate = new TimeControlResourcesSettingsItem("plate", false, 0);
  relic = new TimeControlResourcesSettingsItem("relic", false, 0);
  scaffold = new TimeControlResourcesSettingsItem("scaffold", false, 0);
  science = new TimeControlResourcesSettingsItem("science", false, 0);
  ship = new TimeControlResourcesSettingsItem("ship", false, 0);
  slab = new TimeControlResourcesSettingsItem("slab", false, 0);
  spice = new TimeControlResourcesSettingsItem("spice", false, 0);
  steel = new TimeControlResourcesSettingsItem("steel", false, 0);
  tanker = new TimeControlResourcesSettingsItem("tanker", false, 0);
  tears = new TimeControlResourcesSettingsItem("tears", false, 0);
  temporalFlux = new TimeControlResourcesSettingsItem("temporalFlux", false, 0);
  thorium = new TimeControlResourcesSettingsItem("thorium", false, 0);
  timeCrystal = new TimeControlResourcesSettingsItem("timeCrystal", false, 0);
  titanium = new TimeControlResourcesSettingsItem("titanium", false, 0);
  unicorns = new TimeControlResourcesSettingsItem("unicorns", false, 0);
  unobtainium = new TimeControlResourcesSettingsItem("unobtainium", false, 0);
  uranium = new TimeControlResourcesSettingsItem("uranium", false, 0);
  void = new TimeControlResourcesSettingsItem("void", false, 0);
  wood = new TimeControlResourcesSettingsItem("wood", false, 0);
  zebras = new TimeControlResourcesSettingsItem("zebras", false, 0);
}

export class TimeControlReligionSettingsItem extends SettingTrigger {
  variant: UnicornItemVariant;

  constructor(id: string, variant: UnicornItemVariant, enabled = false, trigger = 1) {
    super(id, enabled, trigger);
    this.variant = variant;
  }
}

export class TimeControlTimeSettingsItem extends SettingTrigger {
  variant: TimeItemVariant;

  constructor(id: string, variant: TimeItemVariant, enabled = false, trigger = 1) {
    super(id, enabled, trigger);
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
    super("timeSkip", false, 5);
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
  buildItems: TimeControlBuildSettingItems;
  religionItems: TimeControlReligionSettingItems;
  spaceItems: TimeControlSpaceSettingItems;
  timeItems: TimeControlTimeSettingItems;

  resources: TimeControlResourceSettings;

  accelerateTime: SettingTrigger;
  timeSkip: TimeControlTimeSkipSettings;
  reset: Setting;

  constructor(
    enabled = false,
    buildItems = {
      academy: new SettingTrigger("academy", true, -1),
      accelerator: new SettingTrigger("accelerator", true, -1),
      aiCore: new SettingTrigger("aiCore", true, -1),
      amphitheatre: new SettingTrigger("amphitheatre", true, -1),
      aqueduct: new SettingTrigger("aqueduct", true, -1),
      barn: new SettingTrigger("barn", true, -1),
      biolab: new SettingTrigger("biolab", true, -1),
      brewery: new SettingTrigger("brewery", true, -1),
      broadcastTower: new SettingTrigger("broadcastTower", true, -1),
      calciner: new SettingTrigger("calciner", true, -1),
      chapel: new SettingTrigger("chapel", true, -1),
      chronosphere: new SettingTrigger("chronosphere", true, -1),
      dataCenter: new SettingTrigger("dataCenter", true, -1),
      factory: new SettingTrigger("factory", true, -1),
      field: new SettingTrigger("field", true, -1),
      harbor: new SettingTrigger("harbor", true, -1),
      hut: new SettingTrigger("hut", true, -1),
      hydroPlant: new SettingTrigger("hydroPlant", true, -1),
      library: new SettingTrigger("library", true, -1),
      logHouse: new SettingTrigger("logHouse", true, -1),
      lumberMill: new SettingTrigger("lumberMill", true, -1),
      magneto: new SettingTrigger("magneto", true, -1),
      mansion: new SettingTrigger("mansion", true, -1),
      mine: new SettingTrigger("mine", true, -1),
      mint: new SettingTrigger("mint", true, -1),
      observatory: new SettingTrigger("observatory", true, -1),
      oilWell: new SettingTrigger("oilWell", true, -1),
      pasture: new SettingTrigger("pasture", true, -1),
      quarry: new SettingTrigger("quarry", true, -1),
      reactor: new SettingTrigger("reactor", true, -1),
      smelter: new SettingTrigger("smelter", true, -1),
      solarFarm: new SettingTrigger("solarFarm", true, -1),
      steamworks: new SettingTrigger("steamworks", true, -1),
      temple: new SettingTrigger("temple", true, -1),
      tradepost: new SettingTrigger("tradepost", true, -1),
      warehouse: new SettingTrigger("warehouse", true, -1),
      workshop: new SettingTrigger("workshop", true, -1),
      zebraForge: new SettingTrigger("zebraForge", true, -1),
      zebraOutpost: new SettingTrigger("zebraOutpost", true, -1),
      zebraWorkshop: new SettingTrigger("zebraWorkshop", true, -1),
      ziggurat: new SettingTrigger("ziggurat", true, -1),
    },
    religionItems = {
      apocripha: new TimeControlReligionSettingsItem(
        "apocripha",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      basilica: new TimeControlReligionSettingsItem(
        "basilica",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      blackCore: new TimeControlReligionSettingsItem(
        "blackCore",
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      blackLibrary: new TimeControlReligionSettingsItem(
        "blackLibrary",
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      blackNexus: new TimeControlReligionSettingsItem(
        "blackNexus",
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      blackObelisk: new TimeControlReligionSettingsItem(
        "blackObelisk",
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      blackPyramid: new TimeControlReligionSettingsItem(
        "blackPyramid",
        UnicornItemVariant.Ziggurat,
        true,
        -1
      ),
      blackRadiance: new TimeControlReligionSettingsItem(
        "blackRadiance",
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      blazar: new TimeControlReligionSettingsItem(
        "blazar",
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      darkNova: new TimeControlReligionSettingsItem(
        "darkNova",
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      goldenSpire: new TimeControlReligionSettingsItem(
        "goldenSpire",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      holyGenocide: new TimeControlReligionSettingsItem(
        "holyGenocide",
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      ivoryCitadel: new TimeControlReligionSettingsItem(
        "ivoryCitadel",
        UnicornItemVariant.Ziggurat,
        true,
        -1
      ),
      ivoryTower: new TimeControlReligionSettingsItem(
        "ivoryTower",
        UnicornItemVariant.Ziggurat,
        true,
        -1
      ),
      marker: new TimeControlReligionSettingsItem("marker", UnicornItemVariant.Ziggurat, true, -1),
      scholasticism: new TimeControlReligionSettingsItem(
        "scholasticism",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      singularity: new TimeControlReligionSettingsItem(
        "singularity",
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      skyPalace: new TimeControlReligionSettingsItem(
        "skyPalace",
        UnicornItemVariant.Ziggurat,
        true,
        -1
      ),
      solarchant: new TimeControlReligionSettingsItem(
        "solarchant",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      solarRevolution: new TimeControlReligionSettingsItem(
        "solarRevolution",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      stainedGlass: new TimeControlReligionSettingsItem(
        "stainedGlass",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      sunAltar: new TimeControlReligionSettingsItem(
        "sunAltar",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      sunspire: new TimeControlReligionSettingsItem(
        "sunspire",
        UnicornItemVariant.Ziggurat,
        true,
        -1
      ),
      templars: new TimeControlReligionSettingsItem(
        "templars",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      transcendence: new TimeControlReligionSettingsItem(
        "transcendence",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      unicornGraveyard: new TimeControlReligionSettingsItem(
        "unicornGraveyard",
        UnicornItemVariant.Ziggurat,
        true,
        -1
      ),
      unicornNecropolis: new TimeControlReligionSettingsItem(
        "unicornNecropolis",
        UnicornItemVariant.Ziggurat,
        true,
        -1
      ),
      unicornPasture: new TimeControlReligionSettingsItem(
        "unicornPasture",
        UnicornItemVariant.UnicornPasture,
        true,
        -1
      ),
      unicornTomb: new TimeControlReligionSettingsItem(
        "unicornTomb",
        UnicornItemVariant.Ziggurat,
        true,
        -1
      ),
      unicornUtopia: new TimeControlReligionSettingsItem(
        "unicornUtopia",
        UnicornItemVariant.Ziggurat,
        true,
        -1
      ),
    },
    spaceItems = {
      containmentChamber: new SettingTrigger("containmentChamber", true, -1),
      cryostation: new SettingTrigger("cryostation", true, -1),
      entangler: new SettingTrigger("entangler", true, -1),
      heatsink: new SettingTrigger("heatsink", true, -1),
      hrHarvester: new SettingTrigger("hrHarvester", true, -1),
      hydrofracturer: new SettingTrigger("hydrofracturer", true, -1),
      hydroponics: new SettingTrigger("hydroponics", true, -1),
      moltenCore: new SettingTrigger("moltenCore", true, -1),
      moonBase: new SettingTrigger("moonBase", true, -1),
      moonOutpost: new SettingTrigger("moonOutpost", true, -1),
      orbitalArray: new SettingTrigger("orbitalArray", true, -1),
      planetCracker: new SettingTrigger("planetCracker", true, -1),
      researchVessel: new SettingTrigger("researchVessel", true, -1),
      sattelite: new SettingTrigger("sattelite", true, -1),
      spaceBeacon: new SettingTrigger("spaceBeacon", true, -1),
      spaceElevator: new SettingTrigger("spaceElevator", true, -1),
      spaceStation: new SettingTrigger("spaceStation", true, -1),
      spiceRefinery: new SettingTrigger("spiceRefinery", true, -1),
      sunforge: new SettingTrigger("sunforge", true, -1),
      sunlifter: new SettingTrigger("sunlifter", true, -1),
      tectonic: new SettingTrigger("tectonic", true, -1),
      terraformingStation: new SettingTrigger("terraformingStation", true, -1),
    },
    timeItems = {
      blastFurnace: new TimeControlTimeSettingsItem(
        "blastFurnace",
        TimeItemVariant.Chronoforge,
        true,
        -1
      ),
      chronocontrol: new TimeControlTimeSettingsItem(
        "chronocontrol",
        TimeItemVariant.VoidSpace,
        true,
        -1
      ),
      cryochambers: new TimeControlTimeSettingsItem(
        "cryochambers",
        TimeItemVariant.VoidSpace,
        true,
        -1
      ),
      ressourceRetrieval: new TimeControlTimeSettingsItem(
        "ressourceRetrieval",
        TimeItemVariant.Chronoforge,
        true,
        -1
      ),
      temporalAccelerator: new TimeControlTimeSettingsItem(
        "temporalAccelerator",
        TimeItemVariant.Chronoforge,
        true,
        -1
      ),
      temporalBattery: new TimeControlTimeSettingsItem(
        "temporalBattery",
        TimeItemVariant.Chronoforge,
        true,
        -1
      ),
      temporalImpedance: new TimeControlTimeSettingsItem(
        "temporalImpedance",
        TimeItemVariant.Chronoforge,
        true,
        -1
      ),
      timeBoiler: new TimeControlTimeSettingsItem(
        "timeBoiler",
        TimeItemVariant.Chronoforge,
        true,
        -1
      ),
      voidHoover: new TimeControlTimeSettingsItem(
        "voidHoover",
        TimeItemVariant.VoidSpace,
        true,
        -1
      ),
      voidResonator: new TimeControlTimeSettingsItem(
        "voidResonator",
        TimeItemVariant.VoidSpace,
        true,
        -1
      ),
      voidRift: new TimeControlTimeSettingsItem("voidRift", TimeItemVariant.VoidSpace, true, -1),
    },
    resources = new TimeControlResourceSettings(),
    accelerateTime = new SettingTrigger("accelerateTime", true, 1),
    timeSkip = new TimeControlTimeSkipSettings(),
    reset = new Setting("reset", false)
  ) {
    super("timeControl", enabled);
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
