import { objectEntries } from "../tools/Entries";
import { isNil, mustExist } from "../tools/Maybe";
import { Resource } from "../types";
import { WorkshopManager } from "../WorkshopManager";
import { Setting } from "./Settings";
import { SettingsSection } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

export class ResourcesSettingsItem extends Setting {
  consume?: number;
  $consume?: JQuery<HTMLElement>;

  stock = 0;
  $stock?: JQuery<HTMLElement>;

  constructor(enabled: boolean, consume: number | undefined, stock: number) {
    super(enabled);
    this.consume = consume;
    this.stock = stock;
  }
}

export type ResourcesSettingsItems = { [item in Resource]: ResourcesSettingsItem };

export class ResourcesSettings extends SettingsSection {
  items: ResourcesSettingsItems;

  constructor(
    items = {
      alloy: new ResourcesSettingsItem(false, 1, 0),
      antimatter: new ResourcesSettingsItem(false, 1, 0),
      beam: new ResourcesSettingsItem(false, 1, 0),
      blackcoin: new ResourcesSettingsItem(false, 1, 0),
      bloodstone: new ResourcesSettingsItem(false, 1, 0),
      blueprint: new ResourcesSettingsItem(false, 1, 0),
      catnip: new ResourcesSettingsItem(false, 1, 0),
      coal: new ResourcesSettingsItem(false, 1, 0),
      compedium: new ResourcesSettingsItem(false, 1, 0),
      concrate: new ResourcesSettingsItem(false, 1, 0),
      culture: new ResourcesSettingsItem(false, 1, 0),
      eludium: new ResourcesSettingsItem(false, 1, 0),
      faith: new ResourcesSettingsItem(false, 1, 0),
      furs: new ResourcesSettingsItem(true, undefined, 1000),
      gear: new ResourcesSettingsItem(false, 1, 0),
      gold: new ResourcesSettingsItem(false, 1, 0),
      iron: new ResourcesSettingsItem(false, 1, 0),
      ivory: new ResourcesSettingsItem(false, 1, 0),
      karma: new ResourcesSettingsItem(false, 1, 0),
      kerosene: new ResourcesSettingsItem(false, 1, 0),
      manpower: new ResourcesSettingsItem(false, 1, 0),
      manuscript: new ResourcesSettingsItem(false, 1, 0),
      megalith: new ResourcesSettingsItem(false, 1, 0),
      minerals: new ResourcesSettingsItem(false, 1, 0),
      necrocorn: new ResourcesSettingsItem(false, 1, 0),
      oil: new ResourcesSettingsItem(false, 1, 0),
      paragon: new ResourcesSettingsItem(false, 1, 0),
      parchment: new ResourcesSettingsItem(false, 1, 0),
      plate: new ResourcesSettingsItem(false, 1, 0),
      relic: new ResourcesSettingsItem(false, 1, 0),
      scaffold: new ResourcesSettingsItem(false, 1, 0),
      science: new ResourcesSettingsItem(false, 1, 0),
      ship: new ResourcesSettingsItem(false, 1, 0),
      slab: new ResourcesSettingsItem(false, 1, 0),
      spice: new ResourcesSettingsItem(false, 1, 0),
      steel: new ResourcesSettingsItem(false, 1, 0),
      tanker: new ResourcesSettingsItem(false, 1, 0),
      tears: new ResourcesSettingsItem(false, 1, 0),
      temporalFlux: new ResourcesSettingsItem(false, 1, 0),
      thorium: new ResourcesSettingsItem(false, 1, 0),
      timeCrystal: new ResourcesSettingsItem(false, 1, 0),
      titanium: new ResourcesSettingsItem(false, 1, 0),
      unicorns: new ResourcesSettingsItem(false, 1, 0),
      unobtainium: new ResourcesSettingsItem(false, 1, 0),
      uranium: new ResourcesSettingsItem(false, 1, 0),
      void: new ResourcesSettingsItem(false, 1, 0),
      wood: new ResourcesSettingsItem(false, 1, 0),
      zebras: new ResourcesSettingsItem(false, 1, 0),
    }
  ) {
    super(true);
    this.items = items;
  }

  load(settings: ResourcesSettings) {
    this.enabled = settings.enabled;

    for (const [name, item] of objectEntries(settings.items)) {
      this.items[name].enabled = item.enabled;
      this.items[name].consume = item.consume;
      this.items[name].stock = item.stock;
    }
  }

  static toLegacyOptions(settings: ResourcesSettings, subject: KittenStorageType) {
    for (const [name, item] of objectEntries(settings.items)) {
      if (isNil(subject.resources[name])) {
        subject.resources[name] = {
          checkForReset: false,
          stockForReset: 0,
          consume: item.consume,
          enabled: item.enabled,
          stock: item.stock,
        };
        continue;
      }

      mustExist(subject.resources[name]).consume = item.consume;
      mustExist(subject.resources[name]).enabled = item.enabled;
      mustExist(subject.resources[name]).stock = item.stock;
    }
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new ResourcesSettings();
    options.enabled = true;

    for (const [name, item] of objectEntries(subject.resources)) {
      if (item.checkForReset) {
        continue;
      }

      // We didn't explicitly store the `enabled` state in legacy.
      // Instead, it is derived from the setting having non-default values.
      options.items[name].enabled =
        item.consume !== WorkshopManager.DEFAULT_CONSUME_RATE || item.stock !== 0;
      options.items[name].consume = item.consume;
      options.items[name].stock = item.stock;
    }

    return options;
  }
}
