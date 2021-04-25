import { ResourceCraftable } from "../types";

export type CraftSettingsItem = { enabled: boolean; limited: boolean; max: number };
export class CraftSettings {
  enabled = false;
  trigger = 0.95;

  items: {
    [item in ResourceCraftable]: CraftSettingsItem;
  } = {
    wood: { enabled: true, limited: true, max: 0 },
    beam: { enabled: true, limited: true, max: 0 },
    slab: { enabled: true, limited: true, max: 0 },
    steel: { enabled: true, limited: true, max: 0 },
    plate: { enabled: true, limited: true, max: 0 },
    alloy: { enabled: true, limited: true, max: 0 },
    concrate: { enabled: true, limited: true, max: 0 },
    gear: { enabled: true, limited: true, max: 0 },
    scaffold: { enabled: true, limited: true, max: 0 },
    ship: { enabled: true, limited: true, max: 0 },
    tanker: { enabled: true, limited: true, max: 0 },
    parchment: { enabled: true, limited: false, max: 0 },
    manuscript: { enabled: true, limited: true, max: 0 },
    compedium: { enabled: true, limited: true, max: 0 },
    blueprint: { enabled: true, limited: true, max: 0 },
    kerosene: { enabled: true, limited: true, max: 0 },
    megalith: { enabled: true, limited: true, max: 0 },
    eludium: { enabled: true, limited: true, max: 0 },
    thorium: { enabled: true, limited: true, max: 0 },
  };
}
