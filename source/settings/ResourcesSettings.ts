import { type Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { WorkshopManager } from "../WorkshopManager.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { type Resource, Resources } from "../types/index.js";
import { Setting } from "./Settings.js";

export class ResourcesSettingsItem extends Setting {
  readonly #resource: Resource;
  consume: number;
  stock = 0;

  get resource() {
    return this.#resource;
  }

  constructor(
    resource: Resource,
    enabled = false,
    consume = WorkshopManager.DEFAULT_CONSUME_RATE,
    stock = 0,
  ) {
    super(enabled);
    this.#resource = resource;
    this.consume = consume;
    this.stock = stock;
  }
}

export type ResourcesResourceSettings = Record<Resource, ResourcesSettingsItem>;

export class ResourcesSettings extends Setting {
  resources: ResourcesResourceSettings;

  constructor(enabled = false) {
    super(enabled);
    this.resources = this.initResources();
  }

  private initResources(): ResourcesResourceSettings {
    const items = {} as ResourcesResourceSettings;
    for (const item of Resources) {
      items[item] = new ResourcesSettingsItem(item);
    }
    return items;
  }

  load(settings: Maybe<Partial<ResourcesSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.resources, settings.resources, (resource, item) => {
      resource.enabled = item?.enabled ?? resource.enabled;
      resource.consume = item?.consume ?? resource.consume;
      resource.stock = item?.stock ?? resource.stock;
    });
  }
}
