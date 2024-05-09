import { Maybe, isNil } from "@oliversalzburg/js-utils/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Resource, ResourceArray } from "../types/index.js";
import { Setting } from "./Settings.js";

export class ResetResourcesSettingsItem extends Setting {
  readonly #resource: Resource;
  stock = 0;

  get resource() {
    return this.#resource;
  }

  constructor(resource: Resource, enabled = false, stock = 0) {
    super(enabled);
    this.#resource = resource;
    this.stock = stock;
  }
}

export type ResetResourcesResourceSettings = Record<Resource, ResetResourcesSettingsItem>;

export class ResetResourcesSettings extends Setting {
  resources: ResetResourcesResourceSettings;

  constructor(enabled = false) {
    super(enabled);
    this.resources = this.initResources();
  }

  private initResources(): ResetResourcesResourceSettings {
    const items = {} as ResetResourcesResourceSettings;
    ResourceArray.forEach(item => {
      items[item] = new ResetResourcesSettingsItem(item);
    });
    return items;
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
}
