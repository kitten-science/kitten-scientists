import { BuildItem } from "./Options";

export type BonfireSettingsItem = { enabled: boolean; max: number };
export class BonfireSettings {
  enabled = false;
  trigger = 0;

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
    pasture: { enabled: true, max: -1 },
    solarFarm: { enabled: true, max: -1 },
    mine: { enabled: true, max: -1 },
    lumberMill: { enabled: true, max: -1 },
    aqueduct: { enabled: true, max: -1 },
    hydroPlant: { enabled: true, max: -1 },
    oilWell: { enabled: true, max: -1 },
    quarry: { enabled: true, max: -1 },

    smelter: { enabled: true, max: -1 },
    biolab: { enabled: false, max: -1 },
    calciner: { enabled: false, max: -1 },
    reactor: { enabled: false, max: -1 },
    accelerator: { enabled: false, max: -1 },
    steamworks: { enabled: false, max: -1 },
    magneto: { enabled: false, max: -1 },

    library: { enabled: true, max: -1 },
    dataCenter: { enabled: true, max: -1 },
    academy: { enabled: true, max: -1 },
    observatory: { enabled: true, max: -1 },

    amphitheatre: { enabled: true, max: -1 },
    broadcastTower: { enabled: true, max: -1 },
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
