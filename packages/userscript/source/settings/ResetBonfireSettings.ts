import { consumeEntriesPedantic, objectEntries } from "../tools/Entries";
import { isNil, Maybe } from "../tools/Maybe";
import { BonfireItem } from "./BonfireSettings";
import { Setting, SettingTrigger } from "./Settings";
import { LegacyStorage } from "./SettingsStorage";

export class ResetBonfireBuildingSetting extends SettingTrigger {
  readonly building: BonfireItem;

  constructor(building: BonfireItem, enabled = false, trigger = 1) {
    super(enabled, trigger);
    this.building = building;
  }
}

// unicornPasture is handled in the Religion section.
export type ResetBonfireBuildingSettings = Record<
  Exclude<BonfireItem, "unicornPasture">,
  ResetBonfireBuildingSetting
>;

export class ResetBonfireSettings extends Setting {
  readonly buildings: ResetBonfireBuildingSettings;

  constructor(
    enabled = false,
    buildings: ResetBonfireBuildingSettings = {
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
    }
  ) {
    super(enabled);
    this.buildings = buildings;
  }

  load(settings: Maybe<Partial<ResetBonfireSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.buildings, settings.buildings, (building, item) => {
      building.enabled = item?.enabled ?? building.enabled;
      building.trigger = item?.trigger ?? building.trigger;
    });
  }

  static fromLegacyOptions(subject: LegacyStorage) {
    const options = new ResetBonfireSettings();
    options.enabled = true;

    for (const [name, item] of objectEntries(options.buildings)) {
      item.enabled = subject.items[`toggle-reset-build-${name}` as const] ?? item.enabled;
      item.trigger = subject.items[`set-reset-build-${name}-min` as const] ?? item.trigger;
    }

    return options;
  }
}
