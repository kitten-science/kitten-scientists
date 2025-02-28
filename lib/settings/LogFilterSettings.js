import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Setting } from "./Settings.js";
export var LogFilterItemVariant;
(function (LogFilterItemVariant) {
  LogFilterItemVariant["build"] = "ks-activity type_ks-build";
  LogFilterItemVariant["craft"] = "ks-activity type_ks-craft";
  LogFilterItemVariant["upgrade"] = "ks-activity type_ks-upgrade";
  LogFilterItemVariant["research"] = "ks-activity type_ks-research";
  LogFilterItemVariant["trade"] = "ks-activity type_ks-trade";
  LogFilterItemVariant["hunt"] = "ks-activity type_ks-hunt";
  LogFilterItemVariant["praise"] = "ks-activity type_ks-praise";
  LogFilterItemVariant["adore"] = "ks-activity type_ks-adore";
  LogFilterItemVariant["transcend"] = "ks-activity type_ks-transcend";
  LogFilterItemVariant["faith"] = "ks-activity type_ks-faith";
  LogFilterItemVariant["accelerate"] = "ks-activity type_ks-accelerate";
  LogFilterItemVariant["timeSkip"] = "ks-activity type_ks-timeSkip";
  LogFilterItemVariant["festival"] = "ks-activity type_ks-festival";
  LogFilterItemVariant["star"] = "ks-activity type_ks-star";
  LogFilterItemVariant["distribute"] = "ks-activity type_ks-distribute";
  LogFilterItemVariant["promote"] = "ks-activity type_ks-promote";
  LogFilterItemVariant["misc"] = "ks-activity";
})(LogFilterItemVariant || (LogFilterItemVariant = {}));
export const FilterItems = [
  "accelerate",
  "adore",
  "build",
  "craft",
  "distribute",
  "faith",
  "festival",
  "hunt",
  "misc",
  "praise",
  "promote",
  "research",
  "star",
  "timeSkip",
  "trade",
  "transcend",
  "upgrade",
];
export class LogFilterSettingsItem extends Setting {
  #variant;
  get variant() {
    return this.#variant;
  }
  constructor(variant) {
    super(true);
    this.#variant = variant;
  }
}
export class LogFilterSettings extends Setting {
  filters;
  disableKGLog;
  constructor(enabled = false, disableKGLog = new Setting(true)) {
    super(enabled);
    this.filters = this.initFilters();
    this.disableKGLog = disableKGLog;
  }
  initFilters() {
    const items = {};
    for (const item of FilterItems) {
      items[item] = new LogFilterSettingsItem(LogFilterItemVariant[item]);
    }
    return items;
  }
  load(settings) {
    if (isNil(settings)) {
      return;
    }
    super.load(settings);
    consumeEntriesPedantic(this.filters, settings.filters, (filter, item) => {
      filter.enabled = item?.enabled ?? filter.enabled;
    });
    this.disableKGLog.enabled = settings.disableKGLog?.enabled ?? this.disableKGLog.enabled;
  }
}
//# sourceMappingURL=LogFilterSettings.js.map
