import { objectEntries } from "../tools/Entries";
import { ResourceCraftable } from "../types";
import { Requirement } from "./Options";
import { ResourceSettings } from "./ResourcesSettings";
import { SettingsSection, SettingToggle, SettingTrigger } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

export type CraftSettingsItem = SettingToggle & {
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
export class CraftSettings extends SettingsSection implements SettingTrigger {
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

  static toLegacyOptions(settings: CraftSettings, subject: KittenStorageType) {
    subject.toggles.craft = settings.enabled;
    subject.triggers.craft = settings.trigger;

    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`toggle-limited-${name}` as const] = item.limited;
    }

    for (const [name, item] of objectEntries(settings.resources)) {
      subject.resources[name] = {
        checkForReset: false,
        stockForReset: 0,
        consume: item.consume,
        enabled: item.enabled,
        stock: item.stock,
      };
    }
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new CraftSettings();
    options.enabled = subject.toggles.craft;
    options.trigger = subject.triggers.craft;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.limited = subject.items[`toggle-limited-${name}` as const] ?? item.limited;
    }

    options.resources = {};
    for (const [name, item] of objectEntries(subject.resources)) {
      if (item.checkForReset) {
        continue;
      }

      options.resources[name] = {
        consume: item.consume,
        enabled: item.enabled,
        stock: item.stock,
      };
    }
    return options;
  }
}
