import { Building } from "../types";
import { SettingsSection } from "./SettingsSection";

/**
 * One of the building options in the KS menu.
 * These are not identical to `Building`!
 * `Building` is IDs of buildings as defined by KG. KS defines upgrade stages as well.
 */
export type BuildItem = Building | "broadcastTower" | "dataCenter" | "hydroPlant" | "solarFarm";

export type BonfireSettingsItem = {
  enabled: boolean;
  $enabled?: JQuery<HTMLElement>;

  max: number;
  $max?: JQuery<HTMLElement>;

  /**
   * In case this is an upgrade of another building, this is the name of the
   * base building.
   */
  name?: Building;

  /**
   * In case this is an upgradable building, this indicates the level of
   * the stage.
   */
  stage?: number;
};
export class BonfireSettings extends SettingsSection {
  trigger = 0;
  $trigger?: JQuery<HTMLElement>;

  items: {
    // unicornPasture is handled in the Religion section.
    [item in Exclude<BuildItem, "unicornPasture">]: BonfireSettingsItem;
  } = {
    hut: { enabled: false, max: -1 },
    logHouse: { enabled: false, max: -1 },
    mansion: { enabled: false, max: -1 },

    workshop: { enabled: true, max: -1 },
    factory: { enabled: true, max: -1 },

    field: { enabled: true, max: -1 },
    pasture: { enabled: true, max: -1, stage: 0 },
    solarFarm: { enabled: true, max: -1, stage: 1, name: "pasture" },
    mine: { enabled: true, max: -1 },
    lumberMill: { enabled: true, max: -1 },
    aqueduct: { enabled: true, max: -1, stage: 0 },
    hydroPlant: { enabled: true, max: -1, stage: 1, name: "aqueduct" },
    oilWell: { enabled: true, max: -1 },
    quarry: { enabled: true, max: -1 },

    smelter: { enabled: true, max: -1 },
    biolab: { enabled: false, max: -1 },
    calciner: { enabled: false, max: -1 },
    reactor: { enabled: false, max: -1 },
    accelerator: { enabled: false, max: -1 },
    steamworks: { enabled: false, max: -1 },
    magneto: { enabled: false, max: -1 },

    library: { enabled: true, max: -1, stage: 0 },
    dataCenter: { enabled: true, max: -1, stage: 1, name: "library" },
    academy: { enabled: true, max: -1 },
    observatory: { enabled: true, max: -1 },

    amphitheatre: { enabled: true, max: -1, stage: 0 },
    broadcastTower: { enabled: true, max: -1, stage: 1, name: "amphitheatre" },
    tradepost: { enabled: true, max: -1 },
    chapel: { enabled: true, max: -1 },
    temple: { enabled: true, max: -1 },
    mint: { enabled: false, max: -1 },
    ziggurat: { enabled: true, max: -1 },
    chronosphere: { enabled: true, max: -1 },
    aiCore: { enabled: false, max: -1 },
    brewery: { enabled: false, max: -1 },

    barn: { enabled: true, max: -1 },
    harbor: { enabled: false, max: -1 },
    warehouse: { enabled: false, max: -1 },

    zebraOutpost: { enabled: true, max: -1 },
    zebraWorkshop: { enabled: false, max: -1 },
    zebraForge: { enabled: false, max: -1 },
  };
}
