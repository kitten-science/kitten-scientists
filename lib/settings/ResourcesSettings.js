import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { WorkshopManager } from "../WorkshopManager.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Resources } from "../types/index.js";
import { Setting } from "./Settings.js";
export class ResourcesSettingsItem extends Setting {
  #resource;
  consume;
  stock = 0;
  get resource() {
    return this.#resource;
  }
  constructor(
    resource,
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
export class ResourcesSettings extends Setting {
  resources;
  constructor(enabled = false) {
    super(enabled);
    this.resources = this.initResources();
  }
  initResources() {
    const items = {};
    for (const item of Resources) {
      items[item] = new ResourcesSettingsItem(item);
    }
    return items;
  }
  load(settings) {
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
//# sourceMappingURL=ResourcesSettings.js.map
