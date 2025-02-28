import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Resources } from "../types/index.js";
import { Setting, SettingThreshold } from "./Settings.js";
export class ResetResourcesSettingsItem extends SettingThreshold {
  #resource;
  get resource() {
    return this.#resource;
  }
  constructor(resource, enabled = false, threshold = -1) {
    super(enabled, threshold);
    this.#resource = resource;
  }
}
export class ResetResourcesSettings extends Setting {
  resources;
  constructor(enabled = false) {
    super(enabled);
    this.resources = this.initResources();
  }
  initResources() {
    const items = {};
    for (const item of Resources) {
      items[item] = new ResetResourcesSettingsItem(item);
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
      resource.trigger = item?.trigger ?? resource.trigger;
    });
  }
}
//# sourceMappingURL=ResetResourcesSettings.js.map
