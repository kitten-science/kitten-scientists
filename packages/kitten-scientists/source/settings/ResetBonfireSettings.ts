import { Maybe, isNil } from "@oliversalzburg/js-utils/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { BonfireItem } from "./BonfireSettings.js";
import { Setting, SettingTrigger } from "./Settings.js";

export class ResetBonfireBuildingSetting extends SettingTrigger {
  readonly #building: BonfireItem;

  get building() {
    return this.#building;
  }

  constructor(building: BonfireItem, enabled = false, trigger = 1) {
    super(enabled, trigger);
    this.#building = building;
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
      academy: new ResetBonfireBuildingSetting("academy", false, -1),
      accelerator: new ResetBonfireBuildingSetting("accelerator", false, -1),
      aiCore: new ResetBonfireBuildingSetting("aiCore", false, -1),
      amphitheatre: new ResetBonfireBuildingSetting("amphitheatre", false, -1),
      aqueduct: new ResetBonfireBuildingSetting("aqueduct", false, -1),
      barn: new ResetBonfireBuildingSetting("barn", false, -1),
      biolab: new ResetBonfireBuildingSetting("biolab", false, -1),
      brewery: new ResetBonfireBuildingSetting("brewery", false, -1),
      broadcastTower: new ResetBonfireBuildingSetting("broadcastTower", false, -1),
      calciner: new ResetBonfireBuildingSetting("calciner", false, -1),
      chapel: new ResetBonfireBuildingSetting("chapel", false, -1),
      chronosphere: new ResetBonfireBuildingSetting("chronosphere", false, -1),
      dataCenter: new ResetBonfireBuildingSetting("dataCenter", false, -1),
      factory: new ResetBonfireBuildingSetting("factory", false, -1),
      field: new ResetBonfireBuildingSetting("field", false, -1),
      harbor: new ResetBonfireBuildingSetting("harbor", false, -1),
      hut: new ResetBonfireBuildingSetting("hut", false, -1),
      hydroPlant: new ResetBonfireBuildingSetting("hydroPlant", false, -1),
      library: new ResetBonfireBuildingSetting("library", false, -1),
      logHouse: new ResetBonfireBuildingSetting("logHouse", false, -1),
      lumberMill: new ResetBonfireBuildingSetting("lumberMill", false, -1),
      magneto: new ResetBonfireBuildingSetting("magneto", false, -1),
      mansion: new ResetBonfireBuildingSetting("mansion", false, -1),
      mine: new ResetBonfireBuildingSetting("mine", false, -1),
      mint: new ResetBonfireBuildingSetting("mint", false, -1),
      observatory: new ResetBonfireBuildingSetting("observatory", false, -1),
      oilWell: new ResetBonfireBuildingSetting("oilWell", false, -1),
      pasture: new ResetBonfireBuildingSetting("pasture", false, -1),
      quarry: new ResetBonfireBuildingSetting("quarry", false, -1),
      reactor: new ResetBonfireBuildingSetting("reactor", false, -1),
      smelter: new ResetBonfireBuildingSetting("smelter", false, -1),
      solarFarm: new ResetBonfireBuildingSetting("solarFarm", false, -1),
      steamworks: new ResetBonfireBuildingSetting("steamworks", false, -1),
      temple: new ResetBonfireBuildingSetting("temple", false, -1),
      tradepost: new ResetBonfireBuildingSetting("tradepost", false, -1),
      warehouse: new ResetBonfireBuildingSetting("warehouse", false, -1),
      workshop: new ResetBonfireBuildingSetting("workshop", false, -1),
      zebraForge: new ResetBonfireBuildingSetting("zebraForge", false, -1),
      zebraOutpost: new ResetBonfireBuildingSetting("zebraOutpost", false, -1),
      zebraWorkshop: new ResetBonfireBuildingSetting("zebraWorkshop", false, -1),
      ziggurat: new ResetBonfireBuildingSetting("ziggurat", false, -1),
    },
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
}
