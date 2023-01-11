import { consumeEntriesPedantic, objectEntries } from "../tools/Entries";
import { isNil, Maybe } from "../tools/Maybe";
import { Resource } from "../types";
import { Setting } from "./Settings";
import { LegacyStorage } from "./SettingsStorage";

export class ResetResourcesSettingsItem extends Setting {
  readonly resource: Resource;
  stock = 0;

  constructor(id: Resource, enabled: boolean, stock: number) {
    super(enabled);
    this.resource = id;
    this.stock = stock;
  }
}

export type ResetResourcesResourceSettings = Record<Resource, ResetResourcesSettingsItem>;

export class ResetResourcesSettings extends Setting {
  resources: ResetResourcesResourceSettings;

  constructor(
    enabled = false,
    resources: ResetResourcesResourceSettings = {
      alloy: new ResetResourcesSettingsItem("alloy", false, 0),
      antimatter: new ResetResourcesSettingsItem("antimatter", false, 0),
      beam: new ResetResourcesSettingsItem("beam", false, 0),
      blackcoin: new ResetResourcesSettingsItem("blackcoin", false, 0),
      bloodstone: new ResetResourcesSettingsItem("bloodstone", false, 0),
      blueprint: new ResetResourcesSettingsItem("blueprint", false, 0),
      catnip: new ResetResourcesSettingsItem("catnip", false, 0),
      coal: new ResetResourcesSettingsItem("coal", false, 0),
      compedium: new ResetResourcesSettingsItem("compedium", false, 0),
      concrate: new ResetResourcesSettingsItem("concrate", false, 0),
      culture: new ResetResourcesSettingsItem("culture", false, 0),
      eludium: new ResetResourcesSettingsItem("eludium", false, 0),
      faith: new ResetResourcesSettingsItem("faith", false, 0),
      furs: new ResetResourcesSettingsItem("furs", false, 0),
      gear: new ResetResourcesSettingsItem("gear", false, 0),
      gold: new ResetResourcesSettingsItem("gold", false, 0),
      iron: new ResetResourcesSettingsItem("iron", false, 0),
      ivory: new ResetResourcesSettingsItem("ivory", false, 0),
      karma: new ResetResourcesSettingsItem("karma", false, 0),
      kerosene: new ResetResourcesSettingsItem("kerosene", false, 0),
      kittens: new ResetResourcesSettingsItem("kittens", false, 0),
      manpower: new ResetResourcesSettingsItem("manpower", false, 0),
      manuscript: new ResetResourcesSettingsItem("manuscript", false, 0),
      megalith: new ResetResourcesSettingsItem("megalith", false, 0),
      minerals: new ResetResourcesSettingsItem("minerals", false, 0),
      necrocorn: new ResetResourcesSettingsItem("necrocorn", false, 0),
      oil: new ResetResourcesSettingsItem("oil", false, 0),
      paragon: new ResetResourcesSettingsItem("paragon", false, 0),
      parchment: new ResetResourcesSettingsItem("parchment", false, 0),
      plate: new ResetResourcesSettingsItem("plate", false, 0),
      relic: new ResetResourcesSettingsItem("relic", false, 0),
      scaffold: new ResetResourcesSettingsItem("scaffold", false, 0),
      science: new ResetResourcesSettingsItem("science", false, 0),
      ship: new ResetResourcesSettingsItem("ship", false, 0),
      slab: new ResetResourcesSettingsItem("slab", false, 0),
      spice: new ResetResourcesSettingsItem("spice", false, 0),
      starchart: new ResetResourcesSettingsItem("starchart", false, 0),
      steel: new ResetResourcesSettingsItem("steel", false, 0),
      tanker: new ResetResourcesSettingsItem("tanker", false, 0),
      tears: new ResetResourcesSettingsItem("tears", false, 0),
      temporalFlux: new ResetResourcesSettingsItem("temporalFlux", false, 0),
      thorium: new ResetResourcesSettingsItem("thorium", false, 0),
      timeCrystal: new ResetResourcesSettingsItem("timeCrystal", false, 0),
      titanium: new ResetResourcesSettingsItem("titanium", false, 0),
      unicorns: new ResetResourcesSettingsItem("unicorns", false, 0),
      unobtainium: new ResetResourcesSettingsItem("unobtainium", false, 0),
      uranium: new ResetResourcesSettingsItem("uranium", false, 0),
      void: new ResetResourcesSettingsItem("void", false, 0),
      wood: new ResetResourcesSettingsItem("wood", false, 0),
      zebras: new ResetResourcesSettingsItem("zebras", false, 0),
    }
  ) {
    super(enabled);
    this.resources = resources;
  }

  load(settings: Maybe<Partial<ResetResourcesSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.resources, settings.resources, (resource, item) => {
      resource.enabled = item?.enabled ?? resource.enabled;
      resource.stock = item?.stock ?? resource.stock;
    });
  }

  static fromLegacyOptions(subject: LegacyStorage) {
    const options = new ResetResourcesSettings();
    options.enabled = true;

    for (const [name, item] of objectEntries(subject.resources)) {
      if (!item.checkForReset) {
        continue;
      }
      options.resources[name].enabled = item.checkForReset;
      options.resources[name].stock = item.stockForReset;
    }

    return options;
  }
}
