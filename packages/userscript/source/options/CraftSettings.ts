import { ResourceCraftable } from "../types";
import { Requirement } from "./Options";
import { ResourceSettings } from "./ResourcesSettings";
import { SettingsSection } from "./SettingsSection";

export type CraftSettingsItem = {
  enabled: boolean;
  $enabled?: JQuery<HTMLElement>;

  limited: boolean;
  $limited?: JQuery<HTMLElement>;

  require: Requirement;
};
export class CraftSettings extends SettingsSection {
  trigger = 0.95;
  $trigger?: JQuery<HTMLElement>;

  items: {
    [item in ResourceCraftable]: CraftSettingsItem;
  } = {
    wood: { enabled: true, limited: true, require: "catnip" },
    beam: { enabled: true, limited: true, require: "wood" },
    slab: { enabled: true, limited: true, require: "minerals" },
    steel: { enabled: true, limited: true, require: "coal" },
    plate: { enabled: true, limited: true, require: "iron" },
    alloy: { enabled: true, limited: true, require: "titanium" },
    concrate: { enabled: true, limited: true, require: false },
    gear: { enabled: true, limited: true, require: false },
    scaffold: { enabled: true, limited: true, require: false },
    ship: { enabled: true, limited: true, require: false },
    tanker: { enabled: true, limited: true, require: false },
    parchment: { enabled: true, limited: false, require: false },
    manuscript: { enabled: true, limited: true, require: "culture" },
    compedium: { enabled: true, limited: true, require: "science" },
    blueprint: { enabled: true, limited: true, require: "science" },
    kerosene: { enabled: true, limited: true, require: "oil" },
    megalith: { enabled: true, limited: true, require: false },
    eludium: { enabled: true, limited: true, require: "unobtainium" },
    thorium: { enabled: true, limited: true, require: "uranium" },
  };

  resources: ResourceSettings = {};
}
