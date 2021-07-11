import { ResourceCraftable } from "../types";
import { Requirement } from "./Options";
import { ResourceSettings } from "./ResourcesSettings";
import { SettingsSection } from "./SettingsSection";

export type CraftSettingsItem = {
  enabled: boolean;
  $enabled?: JQuery<HTMLElement>;

  limited: boolean;
  $limited?: JQuery<HTMLElement>;

  /**
   * Meaning still unclear.
   * This is hardcoded to `0.5` right now.
   */
  limRat: 0.5;

  /**
   * The limit of how many items to craft.
   * This is hardcoded to `0` right now.
   */
  max: 0;
  require: Requirement;
};
export class CraftSettings extends SettingsSection {
  trigger = 0.95;
  $trigger?: JQuery<HTMLElement>;

  items: {
    [item in ResourceCraftable]: CraftSettingsItem;
  } = {
    wood: { enabled: true, limited: true, require: "catnip", limRat: 0.5, max: 0 },
    beam: { enabled: true, limited: true, require: "wood", limRat: 0.5, max: 0 },
    slab: { enabled: true, limited: true, require: "minerals", limRat: 0.5, max: 0 },
    steel: { enabled: true, limited: true, require: "coal", limRat: 0.5, max: 0 },
    plate: { enabled: true, limited: true, require: "iron", limRat: 0.5, max: 0 },
    alloy: { enabled: true, limited: true, require: "titanium", limRat: 0.5, max: 0 },
    concrate: { enabled: true, limited: true, require: false, limRat: 0.5, max: 0 },
    gear: { enabled: true, limited: true, require: false, limRat: 0.5, max: 0 },
    scaffold: { enabled: true, limited: true, require: false, limRat: 0.5, max: 0 },
    ship: { enabled: true, limited: true, require: false, limRat: 0.5, max: 0 },
    tanker: { enabled: true, limited: true, require: false, limRat: 0.5, max: 0 },
    parchment: { enabled: true, limited: false, require: false, limRat: 0.5, max: 0 },
    manuscript: { enabled: true, limited: true, require: "culture", limRat: 0.5, max: 0 },
    compedium: { enabled: true, limited: true, require: "science", limRat: 0.5, max: 0 },
    blueprint: { enabled: true, limited: true, require: "science", limRat: 0.5, max: 0 },
    kerosene: { enabled: true, limited: true, require: "oil", limRat: 0.5, max: 0 },
    megalith: { enabled: true, limited: true, require: false, limRat: 0.5, max: 0 },
    eludium: { enabled: true, limited: true, require: "unobtainium", limRat: 0.5, max: 0 },
    thorium: { enabled: true, limited: true, require: "uranium", limRat: 0.5, max: 0 },
  };

  resources: ResourceSettings = {
    furs: {
      enabled: true,
      stock: 1000,
    },
  };
}
