import { ResourceCraftable } from "../types";
import { ResourceSettings } from "./ResourcesSettings";
import { SettingsSection } from "./SettingsSection";

export type CraftSettingsItem = {
  enabled: boolean;
  $enabled?: JQuery<HTMLElement>;

  limited: boolean;
  $limited?: JQuery<HTMLElement>;
};
export class CraftSettings extends SettingsSection {
  trigger = 0.95;
  $trigger?: JQuery<HTMLElement>;

  items: {
    [item in ResourceCraftable]: CraftSettingsItem;
  } = {
    wood: { enabled: true, limited: true },
    beam: { enabled: true, limited: true },
    slab: { enabled: true, limited: true },
    steel: { enabled: true, limited: true },
    plate: { enabled: true, limited: true },
    alloy: { enabled: true, limited: true },
    concrate: { enabled: true, limited: true },
    gear: { enabled: true, limited: true },
    scaffold: { enabled: true, limited: true },
    ship: { enabled: true, limited: true },
    tanker: { enabled: true, limited: true },
    parchment: { enabled: true, limited: false },
    manuscript: { enabled: true, limited: true },
    compedium: { enabled: true, limited: true },
    blueprint: { enabled: true, limited: true },
    kerosene: { enabled: true, limited: true },
    megalith: { enabled: true, limited: true },
    eludium: { enabled: true, limited: true },
    thorium: { enabled: true, limited: true },
  };

  resources: ResourceSettings = {};
}
