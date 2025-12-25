import { isNil, type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { type Resource, Resources } from "../types/index.js";
import { Setting, SettingThreshold } from "./Settings.js";

export class ResetResourcesSettingsItem extends SettingThreshold {
  readonly #resource: Resource;

  get resource() {
    return this.#resource;
  }

  constructor(resource: Resource, enabled = false, threshold = -1) {
    super(enabled, threshold);
    this.#resource = resource;
  }
}

export type ResetResourcesResourceSettings = Record<Resource, ResetResourcesSettingsItem>;

export class ResetResourcesSettings extends Setting {
  resources: ResetResourcesResourceSettings;

  constructor(enabled = true) {
    super(enabled);
    this.resources = this.initResources();
  }

  private initResources(): ResetResourcesResourceSettings {
    const items = {} as ResetResourcesResourceSettings;
    for (const item of Resources) {
      items[item] = new ResetResourcesSettingsItem(item);
    }
    return items;
  }

  load(settings: Maybe<Partial<ResetResourcesSettings>>) {
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
