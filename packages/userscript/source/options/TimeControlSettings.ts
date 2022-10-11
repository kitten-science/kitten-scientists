import { objectEntries } from "../tools/Entries";
import { isNil, mustExist } from "../tools/Maybe";
import { TimeItemVariant, UnicornItemVariant } from "../types";
import { ResetBonfireBuildingSetting, ResetBonfireSettings } from "./ResetBonfireSettings";
import { ResetReligionBuildingSetting, ResetReligionSettings } from "./ResetReligionSettings";
import { ResetResourcesSettings } from "./ResetResourcesSettings";
import { ResetSpaceBuildingSetting, ResetSpaceSettings } from "./ResetSpaceSettings";
import { ResetTimeBuildingSetting, ResetTimeSettings } from "./ResetTimeSettings";
import { Setting, SettingTrigger } from "./Settings";
import { KittenStorageType } from "./SettingsStorage";
import { TimeSkipSettings } from "./TimeSkipSettings";

export type CycleIndices = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type TimeControlItem = "accelerateTime" | "reset" | "timeSkip";

export class TimeControlSettings extends Setting {
  bonfireBuildings: ResetBonfireSettings;
  religionItems: ResetReligionSettings;
  spaceItems: ResetSpaceSettings;
  timeItems: ResetTimeSettings;
  resources: ResetResourcesSettings;

  accelerateTime: SettingTrigger;
  timeSkip: TimeSkipSettings;
  reset: Setting;

  constructor(
    enabled = false,
    buildItems = {
      academy: new ResetBonfireBuildingSetting("academy", true, -1),
      accelerator: new ResetBonfireBuildingSetting("accelerator", true, -1),
      aiCore: new ResetBonfireBuildingSetting("aiCore", true, -1),
      amphitheatre: new ResetBonfireBuildingSetting("amphitheatre", true, -1),
      aqueduct: new ResetBonfireBuildingSetting("aqueduct", true, -1),
      barn: new ResetBonfireBuildingSetting("barn", true, -1),
      biolab: new ResetBonfireBuildingSetting("biolab", true, -1),
      brewery: new ResetBonfireBuildingSetting("brewery", true, -1),
      broadcastTower: new ResetBonfireBuildingSetting("broadcastTower", true, -1),
      calciner: new ResetBonfireBuildingSetting("calciner", true, -1),
      chapel: new ResetBonfireBuildingSetting("chapel", true, -1),
      chronosphere: new ResetBonfireBuildingSetting("chronosphere", true, -1),
      dataCenter: new ResetBonfireBuildingSetting("dataCenter", true, -1),
      factory: new ResetBonfireBuildingSetting("factory", true, -1),
      field: new ResetBonfireBuildingSetting("field", true, -1),
      harbor: new ResetBonfireBuildingSetting("harbor", true, -1),
      hut: new ResetBonfireBuildingSetting("hut", true, -1),
      hydroPlant: new ResetBonfireBuildingSetting("hydroPlant", true, -1),
      library: new ResetBonfireBuildingSetting("library", true, -1),
      logHouse: new ResetBonfireBuildingSetting("logHouse", true, -1),
      lumberMill: new ResetBonfireBuildingSetting("lumberMill", true, -1),
      magneto: new ResetBonfireBuildingSetting("magneto", true, -1),
      mansion: new ResetBonfireBuildingSetting("mansion", true, -1),
      mine: new ResetBonfireBuildingSetting("mine", true, -1),
      mint: new ResetBonfireBuildingSetting("mint", true, -1),
      observatory: new ResetBonfireBuildingSetting("observatory", true, -1),
      oilWell: new ResetBonfireBuildingSetting("oilWell", true, -1),
      pasture: new ResetBonfireBuildingSetting("pasture", true, -1),
      quarry: new ResetBonfireBuildingSetting("quarry", true, -1),
      reactor: new ResetBonfireBuildingSetting("reactor", true, -1),
      smelter: new ResetBonfireBuildingSetting("smelter", true, -1),
      solarFarm: new ResetBonfireBuildingSetting("solarFarm", true, -1),
      steamworks: new ResetBonfireBuildingSetting("steamworks", true, -1),
      temple: new ResetBonfireBuildingSetting("temple", true, -1),
      tradepost: new ResetBonfireBuildingSetting("tradepost", true, -1),
      warehouse: new ResetBonfireBuildingSetting("warehouse", true, -1),
      workshop: new ResetBonfireBuildingSetting("workshop", true, -1),
      zebraForge: new ResetBonfireBuildingSetting("zebraForge", true, -1),
      zebraOutpost: new ResetBonfireBuildingSetting("zebraOutpost", true, -1),
      zebraWorkshop: new ResetBonfireBuildingSetting("zebraWorkshop", true, -1),
      ziggurat: new ResetBonfireBuildingSetting("ziggurat", true, -1),
    },
    religionItems = {
      apocripha: new ResetReligionBuildingSetting(
        "apocripha",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      basilica: new ResetReligionBuildingSetting(
        "basilica",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      blackCore: new ResetReligionBuildingSetting(
        "blackCore",
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      blackLibrary: new ResetReligionBuildingSetting(
        "blackLibrary",
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      blackNexus: new ResetReligionBuildingSetting(
        "blackNexus",
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      blackObelisk: new ResetReligionBuildingSetting(
        "blackObelisk",
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      blackPyramid: new ResetReligionBuildingSetting(
        "blackPyramid",
        UnicornItemVariant.Ziggurat,
        true,
        -1
      ),
      blackRadiance: new ResetReligionBuildingSetting(
        "blackRadiance",
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      blazar: new ResetReligionBuildingSetting(
        "blazar",
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      darkNova: new ResetReligionBuildingSetting(
        "darkNova",
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      goldenSpire: new ResetReligionBuildingSetting(
        "goldenSpire",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      holyGenocide: new ResetReligionBuildingSetting(
        "holyGenocide",
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      ivoryCitadel: new ResetReligionBuildingSetting(
        "ivoryCitadel",
        UnicornItemVariant.Ziggurat,
        true,
        -1
      ),
      ivoryTower: new ResetReligionBuildingSetting(
        "ivoryTower",
        UnicornItemVariant.Ziggurat,
        true,
        -1
      ),
      marker: new ResetReligionBuildingSetting("marker", UnicornItemVariant.Ziggurat, true, -1),
      scholasticism: new ResetReligionBuildingSetting(
        "scholasticism",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      singularity: new ResetReligionBuildingSetting(
        "singularity",
        UnicornItemVariant.Cryptotheology,
        true,
        -1
      ),
      skyPalace: new ResetReligionBuildingSetting(
        "skyPalace",
        UnicornItemVariant.Ziggurat,
        true,
        -1
      ),
      solarchant: new ResetReligionBuildingSetting(
        "solarchant",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      solarRevolution: new ResetReligionBuildingSetting(
        "solarRevolution",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      stainedGlass: new ResetReligionBuildingSetting(
        "stainedGlass",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      sunAltar: new ResetReligionBuildingSetting(
        "sunAltar",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      sunspire: new ResetReligionBuildingSetting("sunspire", UnicornItemVariant.Ziggurat, true, -1),
      templars: new ResetReligionBuildingSetting(
        "templars",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      transcendence: new ResetReligionBuildingSetting(
        "transcendence",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1
      ),
      unicornGraveyard: new ResetReligionBuildingSetting(
        "unicornGraveyard",
        UnicornItemVariant.Ziggurat,
        true,
        -1
      ),
      unicornNecropolis: new ResetReligionBuildingSetting(
        "unicornNecropolis",
        UnicornItemVariant.Ziggurat,
        true,
        -1
      ),
      unicornPasture: new ResetReligionBuildingSetting(
        "unicornPasture",
        UnicornItemVariant.UnicornPasture,
        true,
        -1
      ),
      unicornTomb: new ResetReligionBuildingSetting(
        "unicornTomb",
        UnicornItemVariant.Ziggurat,
        true,
        -1
      ),
      unicornUtopia: new ResetReligionBuildingSetting(
        "unicornUtopia",
        UnicornItemVariant.Ziggurat,
        true,
        -1
      ),
    },
    spaceItems = {
      containmentChamber: new ResetSpaceBuildingSetting("containmentChamber", true, -1),
      cryostation: new ResetSpaceBuildingSetting("cryostation", true, -1),
      entangler: new ResetSpaceBuildingSetting("entangler", true, -1),
      heatsink: new ResetSpaceBuildingSetting("heatsink", true, -1),
      hrHarvester: new ResetSpaceBuildingSetting("hrHarvester", true, -1),
      hydrofracturer: new ResetSpaceBuildingSetting("hydrofracturer", true, -1),
      hydroponics: new ResetSpaceBuildingSetting("hydroponics", true, -1),
      moltenCore: new ResetSpaceBuildingSetting("moltenCore", true, -1),
      moonBase: new ResetSpaceBuildingSetting("moonBase", true, -1),
      moonOutpost: new ResetSpaceBuildingSetting("moonOutpost", true, -1),
      orbitalArray: new ResetSpaceBuildingSetting("orbitalArray", true, -1),
      planetCracker: new ResetSpaceBuildingSetting("planetCracker", true, -1),
      researchVessel: new ResetSpaceBuildingSetting("researchVessel", true, -1),
      sattelite: new ResetSpaceBuildingSetting("sattelite", true, -1),
      spaceBeacon: new ResetSpaceBuildingSetting("spaceBeacon", true, -1),
      spaceElevator: new ResetSpaceBuildingSetting("spaceElevator", true, -1),
      spaceStation: new ResetSpaceBuildingSetting("spaceStation", true, -1),
      spiceRefinery: new ResetSpaceBuildingSetting("spiceRefinery", true, -1),
      sunforge: new ResetSpaceBuildingSetting("sunforge", true, -1),
      sunlifter: new ResetSpaceBuildingSetting("sunlifter", true, -1),
      tectonic: new ResetSpaceBuildingSetting("tectonic", true, -1),
      terraformingStation: new ResetSpaceBuildingSetting("terraformingStation", true, -1),
    },
    timeItems = {
      blastFurnace: new ResetTimeBuildingSetting(
        "blastFurnace",
        TimeItemVariant.Chronoforge,
        true,
        -1
      ),
      chronocontrol: new ResetTimeBuildingSetting(
        "chronocontrol",
        TimeItemVariant.VoidSpace,
        true,
        -1
      ),
      cryochambers: new ResetTimeBuildingSetting(
        "cryochambers",
        TimeItemVariant.VoidSpace,
        true,
        -1
      ),
      ressourceRetrieval: new ResetTimeBuildingSetting(
        "ressourceRetrieval",
        TimeItemVariant.Chronoforge,
        true,
        -1
      ),
      temporalAccelerator: new ResetTimeBuildingSetting(
        "temporalAccelerator",
        TimeItemVariant.Chronoforge,
        true,
        -1
      ),
      temporalBattery: new ResetTimeBuildingSetting(
        "temporalBattery",
        TimeItemVariant.Chronoforge,
        true,
        -1
      ),
      temporalImpedance: new ResetTimeBuildingSetting(
        "temporalImpedance",
        TimeItemVariant.Chronoforge,
        true,
        -1
      ),
      timeBoiler: new ResetTimeBuildingSetting("timeBoiler", TimeItemVariant.Chronoforge, true, -1),
      voidHoover: new ResetTimeBuildingSetting("voidHoover", TimeItemVariant.VoidSpace, true, -1),
      voidResonator: new ResetTimeBuildingSetting(
        "voidResonator",
        TimeItemVariant.VoidSpace,
        true,
        -1
      ),
      voidRift: new ResetTimeBuildingSetting("voidRift", TimeItemVariant.VoidSpace, true, -1),
    },
    resources = new ResetResourcesSettings(),
    accelerateTime = new SettingTrigger("accelerateTime", true, 1),
    timeSkip = new TimeSkipSettings(),
    reset = new Setting("reset", false)
  ) {
    super("timeControl", enabled);
    this.bonfireBuildings = buildItems;
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
    this.reset.enabled = settings.reset.enabled;

    this.accelerateTime.trigger = settings.accelerateTime.trigger;

    this.timeSkip.load(settings.timeSkip);

    for (const [name, item] of objectEntries(this.bonfireBuildings)) {
      item.enabled = settings.bonfireBuildings[name].enabled;
      item.trigger = settings.bonfireBuildings[name].trigger;
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

    TimeSkipSettings.toLegacyOptions(settings.timeSkip, subject);

    for (const [name, item] of objectEntries(settings.bonfireBuildings)) {
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

    options.timeSkip = TimeSkipSettings.fromLegacyOptions(subject);

    for (const [name, item] of objectEntries(options.bonfireBuildings)) {
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
