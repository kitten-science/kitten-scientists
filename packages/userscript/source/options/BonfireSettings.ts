import { Building } from "../types";
import { Requirement } from "./Options";
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

  require: Requirement;

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
    hut: { enabled: false, max: -1, require: "wood" },
    logHouse: { enabled: false, max: -1, require: "minerals" },
    mansion: { enabled: false, max: -1, require: "titanium" },

    workshop: { enabled: true, max: -1, require: "minerals" },
    factory: { enabled: true, max: -1, require: "titanium" },

    field: { enabled: true, max: -1, require: "catnip" },
    pasture: { enabled: true, max: -1, stage: 0, require: "catnip" },
    solarFarm: { enabled: true, max: -1, stage: 1, name: "pasture", require: "titanium" },
    mine: { enabled: true, max: -1, require: "wood" },
    lumberMill: { enabled: true, max: -1, require: "minerals" },
    aqueduct: { enabled: true, max: -1, stage: 0, require: "minerals" },
    hydroPlant: { enabled: true, max: -1, stage: 1, name: "aqueduct", require: "titanium" },
    oilWell: { enabled: true, max: -1, require: "coal" },
    quarry: { enabled: true, max: -1, require: "coal" },

    smelter: { enabled: true, max: -1, require: "minerals" },
    biolab: { enabled: false, max: -1, require: "science" },
    calciner: { enabled: false, max: -1, require: "titanium" },
    reactor: { enabled: false, max: -1, require: "titanium" },
    accelerator: { enabled: false, max: -1, require: "titanium" },
    steamworks: { enabled: false, max: -1, require: false },
    magneto: { enabled: false, max: -1, require: false },

    library: { enabled: true, max: -1, stage: 0, require: "wood" },
    dataCenter: { enabled: true, max: -1, stage: 1, name: "library", require: false },
    academy: { enabled: true, max: -1, require: "wood" },
    observatory: { enabled: true, max: -1, require: "iron" },

    amphitheatre: { enabled: true, max: -1, stage: 0, require: "minerals" },
    broadcastTower: { enabled: true, max: -1, stage: 1, name: "amphitheatre", require: "titanium" },
    tradepost: { enabled: true, max: -1, require: "gold" },
    chapel: { enabled: true, max: -1, require: "minerals" },
    temple: { enabled: true, max: -1, require: "gold" },
    mint: { enabled: false, max: -1, require: false },
    ziggurat: { enabled: true, max: -1, require: false },
    chronosphere: { enabled: true, max: -1, require: "unobtainium" },
    aiCore: { enabled: false, max: -1, require: false },
    brewery: { enabled: false, max: -1, require: false },

    barn: { enabled: true, max: -1, require: "wood" },
    harbor: { enabled: false, max: -1, require: false },
    warehouse: { enabled: false, max: -1, require: false },

    zebraOutpost: { enabled: true, max: -1, require: "bloodstone" },
    zebraWorkshop: { enabled: false, max: -1, require: "bloodstone" },
    zebraForge: { enabled: false, max: -1, require: "bloodstone" },
  };
}
