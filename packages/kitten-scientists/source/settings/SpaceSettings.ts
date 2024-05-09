import { Maybe, isNil } from "@oliversalzburg/js-utils/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Game, SpaceBuildings, SpaceBuildingsArray } from "../types/index.js";
import { MissionSettings } from "./MissionSettings.js";
import { SettingMax, SettingTrigger } from "./Settings.js";

export class SpaceBuildingSetting extends SettingMax {
  readonly #building: SpaceBuildings;

  get building() {
    return this.#building;
  }

  constructor(building: SpaceBuildings, enabled = false) {
    super(enabled);
    this.#building = building;
  }
}

export type SpaceBuildingSettings = Record<SpaceBuildings, SpaceBuildingSetting>;

export class SpaceSettings extends SettingTrigger {
  buildings: SpaceBuildingSettings;

  unlockMissions: MissionSettings;

  constructor(enabled = false, trigger = 0, unlockMissions = new MissionSettings()) {
    super(enabled, trigger);
    this.buildings = this.initBuildings();
    this.unlockMissions = unlockMissions;
  }

  private initBuildings(): SpaceBuildingSettings {
    const items = {} as SpaceBuildingSettings;
    SpaceBuildingsArray.forEach(item => {
      items[item] = new SpaceBuildingSetting(item);
    });
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
    });

    this.unlockMissions.load(settings.unlockMissions);
  }
}
