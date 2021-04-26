import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { Resource } from "../types";
import { UserScript } from "../UserScript";

export class SettingsSection {
  protected _host: UserScript;

  constructor(host: UserScript) {
    this._host = host;
  }

  protected getOptionHead(toggleName: string): JQuery<HTMLElement> {
    const containerList = $("<ul/>", {
      id: "items-list-" + toggleName,
      css: { display: "none", paddingLeft: "20px" },
    });

    const disableAllButton = $("<div/>", {
      id: "toggle-all-items-" + toggleName,
      text: this._host.i18n("ui.disable.all"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        textShadow: "3px 3px 4px gray",
        marginRight: "8px",
      },
    });

    disableAllButton.on("click", function () {
      // can't use find as we only want one layer of checkboxes
      const items = containerList.children().children(":checkbox");
      items.prop("checked", false);
      items.change();
      containerList.children().children(":checkbox").change();
    });

    containerList.append(disableAllButton);

    const enableAllButton = $("<div/>", {
      id: "toggle-all-items-" + toggleName,
      text: this._host.i18n("ui.enable.all"),
      css: { cursor: "pointer", display: "inline-block", textShadow: "3px 3px 4px gray" },
    });

    enableAllButton.on("click", function () {
      // can't use find as we only want one layer of checkboxes
      const items = containerList.children().children(":checkbox");
      items.prop("checked", true);
      items.change();
      containerList.children().children(":checkbox").change();
    });

    containerList.append(enableAllButton);
    return containerList;
  }

  protected getOption(
    name: string,
    option: { enabled: boolean },
    i18nName: string,
    delimiter = false
  ): JQuery<HTMLElement> {
    const element = $("<li/>");
    const elementLabel = i18nName;

    const label = $("<label/>", {
      for: "toggle-" + name,
      text: elementLabel,
      css: {
        display: "inline-block",
        minWidth: "80px",
        marginBottom: delimiter ? "10px" : undefined,
      },
    });

    const input = $("<input/>", {
      id: "toggle-" + name,
      type: "checkbox",
    }).data("option", option);

    if (option.enabled) {
      input.prop("checked", true);
    }

    input.on("change", () => {
      if (input.is(":checked") && option.enabled == false) {
        option.enabled = true;
      } else if (!input.is(":checked") && option.enabled == true) {
        option.enabled = false;
      }
      kittenStorage.items[input.attr("id")] = option.enabled;
      this._host.saveToKittenStorage();
    });

    element.append(input, label);

    return element;
  }

  protected getAvailableResourceOptions(forReset: boolean): Array<JQuery<HTMLElement>> {
    const items = [];
    const idPrefix = forReset ? "#resource-reset-" : "#resource-";

    for (const i in this._host.gamePage.resPool.resources) {
      const res = this._host.gamePage.resPool.resources[i];

      // Show only new resources that we don't have in the list and that are
      // visible. This helps cut down on total size.
      if (res.name && $(idPrefix + res.name).length === 0) {
        const item = $("<div/>", {
          id: "resource-add-" + res.name,
          text: ucfirst(res.title ? res.title : res.name),
          css: { cursor: "pointer", textShadow: "3px 3px 4px gray" },
        });

        item.on("click", () => {
          item.remove();
          if (!this._host.options.auto.resources[res.name]) {
            this._host.options.auto.resources[res.name] = {};
          }
          if (forReset) {
            this._host.options.auto.resources[res.name]!.checkForReset = true;
            this._host.options.auto.resources[res.name]!.stockForReset = Infinity;
            $("#toggle-reset-list-resources").append(
              this.addNewResourceOption(res.name, res.title, forReset)
            );
          } else {
            this._host.options.auto.resources[res.name]!.enabled = true;
            this._host.options.auto.resources[res.name]!.stock = 0;
            this._host.options.auto.resources[res.name]!.consume = this._host.options.consume;
            $("#toggle-list-resources").append(
              this.addNewResourceOption(res.name, res.title, forReset)
            );
          }
          //this._host.saveToKittenStorage();
        });

        items.push(item);
      }
    }

    return items;
  }

  protected addNewResourceOption(
    name: Resource,
    title: string,
    forReset = false
  ): JQuery<HTMLElement> {
    //title = title || this._host.gamePage.resPool.get(name)?.title || ucfirst(name);

    const resourceSettings = this._host.options.auto.resources[name];
    let stock;
    if (forReset && resourceSettings && resourceSettings.stockForReset) {
      stock = resourceSettings.stockForReset;
    } else if (!forReset && resourceSettings && resourceSettings.stock) {
      stock = resourceSettings.stock;
    } else {
      stock = 0;
    }
    const consume =
      resourceSettings && resourceSettings.consume != undefined
        ? resourceSettings.consume
        : this._host.options.consume;

    // The overall container for this resource item.
    const container = $("<div/>", {
      id: (forReset ? "resource-reset-" : "resource-") + name,
      css: { display: "inline-block", width: "100%" },
    });

    // The label with the name of the resource.
    const label = $("<div/>", {
      id: "resource-label-" + name,
      text: title,
      css: { display: "inline-block", width: "95px" },
    });

    // How many items to stock.
    const stockElement = $("<div/>", {
      id: "stock-value-" + name,
      text: this._host.i18n("resources.stock", [
        stock === Infinity ? "∞" : this._host.gamePage.getDisplayValueExt(stock),
      ]),
      css: { cursor: "pointer", display: "inline-block", width: "80px" },
    });

    // The consume rate for the resource.
    const consumeElement = $("<div/>", {
      id: "consume-rate-" + name,
      text: this._host.i18n("resources.consume", [consume.toFixed(2)]),
      css: { cursor: "pointer", display: "inline-block" },
    });

    // Delete the resource from the list.
    const del = $("<div/>", {
      id: "resource-delete-" + name,
      text: this._host.i18n("resources.del"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });

    if (forReset) {
      container.append(label, stockElement, del);
    } else {
      container.append(label, stockElement, consumeElement, del);
    }

    // once created, set color if relevant
    if (resourceSettings != undefined && resourceSettings.stock != undefined) {
      this._setStockWarning(name, resourceSettings.stock);
    }

    stockElement.on("click", () => {
      const value = window.prompt(this._host.i18n("resources.stock.set", [title]));
      if (value !== null) {
        this._setStockValue(name, value, forReset);
        //this._host.saveToKittenStorage();
      }
    });

    consumeElement.on("click", () => {
      const value = window.prompt(this._host.i18n("resources.consume.set", [title]));
      if (value !== null) {
        this._setConsumeRate(name, value);
        //this._host.saveToKittenStorage();
      }
    });

    del.on("click", () => {
      if (window.confirm(this._host.i18n("resources.del.confirm", [title]))) {
        container.remove();
        this._removeResourceControl(name, forReset);
        //this._host.saveToKittenStorage();
      }
    });

    return container;
  }

  private _removeResourceControl(name: Resource, forReset = false): void {
    const opt = mustExist(this._host.options.auto.resources[name]);
    if (forReset) {
      opt.checkForReset = false;
    } else {
      opt.enabled = false;
    }

    if (!opt.enabled && !opt.checkForReset) delete this._host.options.auto.resources[name];
  }

  private _setStockWarning(name: Resource, value: number, forReset = false): void {
    // simplest way to ensure it doesn't stick around too often; always do
    // a remove first then re-add only if needed
    const path = forReset ? "#resource-reset-" + name : "#resource-" + name;
    $(path).removeClass("stockWarn");

    const maxValue = this._host.gamePage.resPool.resources.filter(i => i.name == name)[0].maxValue;
    if ((value > maxValue && !(maxValue === 0)) || value === Infinity)
      $(path).addClass("stockWarn");
  }

  private _setStockValue(name: Resource, value: string, forReset = false): void {
    let n = Number(value);

    if (isNaN(n) || n < 0) {
      this._host.warning("ignoring non-numeric or invalid stock value " + value);
      return;
    }

    if (!this._host.options.auto.resources[name]) {
      this._host.options.auto.resources[name] = {};
    }
    let path;
    if (forReset) {
      path = "#resource-reset-" + name + " #stock-value-" + name;
      n = n < 0 ? Infinity : n;
      this._host.options.auto.resources[name]!.checkForReset = true;
      this._host.options.auto.resources[name]!.stockForReset = n;
    } else {
      path = "#resource-" + name + " #stock-value-" + name;
      this._host.options.auto.resources[name]!.enabled = true;
      this._host.options.auto.resources[name]!.stock = n;
    }
    $(path).text(
      this._host.i18n("resources.stock", [
        n === Infinity ? "∞" : this._host.gamePage.getDisplayValueExt(n),
      ])
    );

    this._setStockWarning(name, n, forReset);
  }

  private _setConsumeRate(name: Resource, value: string): void {
    const n = parseFloat(value);

    if (isNaN(n) || n < 0.0 || n > 1.0) {
      this._host.warning("ignoring non-numeric or invalid consume rate " + value);
      return;
    }

    if (!this._host.options.auto.resources[name]) {
      this._host.options.auto.resources[name] = {};
    }
    this._host.options.auto.resources[name]!.consume = n;
    $("#consume-rate-" + name).text(this._host.i18n("resources.consume", [n.toFixed(2)]));
  }
}
