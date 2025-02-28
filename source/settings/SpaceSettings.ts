import { type Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { type Game, type SpaceBuilding, SpaceBuildings } from "../types/index.js";
import { MissionSettings } from "./MissionSettings.js";
import { SettingTrigger, SettingTriggerMax } from "./Settings.js";

export class SpaceBuildingSetting extends SettingTriggerMax {
  readonly #building: SpaceBuilding;

  get building() {
    return this.#building;
  }

  constructor(building: SpaceBuilding) {
    super();
    this.#building = building;
  }
}

export type SpaceBuildingSettings = Record<SpaceBuilding, SpaceBuildingSetting>;

export class SpaceSettings extends SettingTrigger {
  buildings: SpaceBuildingSettings;

  unlockMissions: MissionSettings;

  constructor(enabled = false, trigger = -1, unlockMissions = new MissionSettings()) {
    super(enabled, trigger);
    this.buildings = this.initBuildings();
    this.unlockMissions = unlockMissions;
  }

  private initBuildings(): SpaceBuildingSettings {
    const items = {} as SpaceBuildingSettings;
    for (const item of SpaceBuildings) {
      items[item] = new SpaceBuildingSetting(item);
    }
    return items;
  }

  static validateGame(game: Game, settings: SpaceSettings) {
    MissionSettings.validateGame(game, settings.unlockMissions);
  }

  load(settings: Maybe<Partial<SpaceSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.buildings, settings.buildings, (building, item) => {
      building.enabled = item?.enabled ?? building.enabled;
      building.max = item?.max ?? building.max;
      building.trigger = item?.trigger ?? building.trigger;
    });

    this.unlockMissions.load(settings.unlockMissions);
  }
}
