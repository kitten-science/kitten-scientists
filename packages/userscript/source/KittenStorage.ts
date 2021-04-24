import { Options } from "./Options";
import { mustExist } from "./tools/Maybe";

export type KittenStorageType = {
  version: number;
  toggles: Record<string, unknown>;
  items: Record<string, unknown>;
  resources: Record<string, unknown>;
  triggers: {
    build?: number;
    craft?: number;
    faith?: number;
    space?: number;
    time?: number;
    trade?: number;
  };
  reset: {
    reset: boolean;
    times: number;
    paragonLastTime: number;
    pargonTotal: number;
    karmaLastTime: number;
    karmaTotal: number;
  };
};

export class KittenStorage {
  public readonly kittenStorageVersion = 2;
  private _data: KittenStorageType = {
    version: this.kittenStorageVersion,
    toggles: {},
    items: {},
    resources: {},
    triggers: {},
    reset: {
      reset: false,
      times: 0,
      paragonLastTime: 0,
      pargonTotal: 0,
      karmaLastTime: 0,
      karmaTotal: 0,
    },
  };

  get data(): KittenStorageType {
    return this._data;
  }

  initializeKittenStorage(): void {
    const kittenStorage = this._data;
    $("#items-list-build, #items-list-craft, #items-list-trade")
      .find("input[id^='toggle-']")
      .each(function () {
        const id = mustExist($(this).attr("id"));
        kittenStorage.items[id] = $(this).prop("checked");
      });

    this.saveToKittenStorage();
  }

  saveToKittenStorage(options: Options): void {
    this._data.toggles = {
      build: options.auto.build.enabled,
      space: options.auto.space.enabled,
      craft: options.auto.craft.enabled,
      upgrade: options.auto.upgrade.enabled,
      trade: options.auto.trade.enabled,
      faith: options.auto.faith.enabled,
      time: options.auto.time.enabled,
      timeCtrl: options.auto.timeCtrl.enabled,
      distribute: options.auto.distribute.enabled,
      options: options.auto.options.enabled,
      filter: options.auto.filter.enabled,
    };
    this._data.resources = options.auto.resources;
    this._data.triggers = {
      faith: options.auto.faith.trigger,
      time: options.auto.time.trigger,
      build: options.auto.build.trigger,
      space: options.auto.space.trigger,
      craft: options.auto.craft.trigger,
      trade: options.auto.trade.trigger,
    };

    localStorage["cbc.kitten-scientists"] = JSON.stringify(this._data);
  }

  load(): void {
    const saved = JSON.parse(localStorage["cbc.kitten-scientists"] || "null");
    if (saved && saved.version == 1) {
      saved.version = 2;
      saved.reset = {
        reset: false,
        times: 0,
        paragonLastTime: 0,
        pargonTotal: 0,
        karmaLastTime: 0,
        karmaTotal: 0,
      };
    }
    if (saved && saved.version == this.kittenStorageVersion) {
      this._data = saved;

      if (saved.toggles) {
        for (const toggle in saved.toggles) {
          if (toggle !== "engine" && options.auto[toggle]) {
            options.auto[toggle].enabled = !!saved.toggles[toggle];
            var el = $("#toggle-" + toggle);
            el.prop("checked", options.auto[toggle].enabled);
          }
        }
      }

      for (const item in kittenStorage.items) {
        const value = kittenStorage.items[item];
        var el = $("#" + item);
        const option = el.data("option");
        const name = item.split("-");

        if (option === undefined) {
          delete kittenStorage.items[item];
          continue;
        }

        if (name[0] == "set") {
          el[0].title = value;
          if (name[name.length - 1] == "max") {
            el.text(i18n("ui.max", [value]));
          } else if (name[name.length - 1] == "min") {
            el.text(i18n("ui.min", [value]));
          }
        } else {
          el.prop("checked", value);
        }

        if (name.length == 2) {
          option.enabled = value;
        } else if (name[1] == "reset" && name.length >= 4) {
          const type = name[2];
          const itemName = name[3];
          switch (name[0]) {
            case "toggle":
              options.auto[type].items[itemName].checkForReset = value;
              break;
            case "set":
              options.auto[type].items[itemName].triggerForReset = value;
              break;
          }
        } else {
          if (name[1] == "limited") {
            option.limited = value;
          } else {
            option[name[2]] = value;
          }
        }
      }

      const resourcesList = $("#toggle-list-resources");
      const resetList = $("#toggle-reset-list-resources");
      for (const resource in kittenStorage.resources) {
        const res = kittenStorage.resources[resource];

        if (res.enabled) {
          if ($("#resource-" + resource).length === 0)
            resourcesList.append(addNewResourceOption(resource));
          if ("stock" in res) setStockValue(resource, res.stock);
          if ("consume" in res) setConsumeRate(resource, res.consume);
        }
        if (res.checkForReset) {
          if ($("#resource-reset-" + resource).length === 0)
            resetList.append(addNewResourceOption(resource, undefined, true));
          if ("stockForReset" in res)
            setStockValue(resource, res.stockForReset ? res.stockForReset : Infinity, true);
        }
      }

      if (saved.triggers) {
        options.auto.faith.trigger = saved.triggers.faith;
        options.auto.time.trigger = saved.triggers.time;
        options.auto.build.trigger = saved.triggers.build;
        options.auto.space.trigger = saved.triggers.space;
        options.auto.craft.trigger = saved.triggers.craft;
        options.auto.trade.trigger = saved.triggers.trade;

        $("#trigger-faith")[0].title = options.auto.faith.trigger;
        $("#trigger-time")[0].title = options.auto.time.trigger;
        $("#trigger-build")[0].title = options.auto.build.trigger;
        $("#trigger-space")[0].title = options.auto.space.trigger;
        $("#trigger-craft")[0].title = options.auto.craft.trigger;
        $("#trigger-trade")[0].title = options.auto.trade.trigger;
      }
    } else {
      initializeKittenStorage();
    }
  }
}
