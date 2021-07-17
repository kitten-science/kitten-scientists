import { ResourcesSettingsItem } from "../options/ResourcesSettings";
import { TimeControlResourcesSettingsItem } from "../options/TimeControlSettings";
import { ucfirst } from "../tools/Format";
import { clog } from "../tools/Log";
import { mustExist } from "../tools/Maybe";
import { Resource } from "../types";
import { UserScript } from "../UserScript";

export abstract class SettingsSectionUi<TState> {
  protected _host: UserScript;

  constructor(host: UserScript) {
    this._host = host;
  }

  abstract setState(state: TState): void;
  abstract refreshUi(): void;

  protected _getSettingsPanel(id: string): JQuery<HTMLElement> {
    const element = $("<li/>", { id: `ks-${id}` });
    // Add a border on the element
    element.css("borderBottom", "1px  solid rgba(185, 185, 185, 0.2)");
    return element;
  }

  protected _getItemsToggle(id: string): JQuery<HTMLElement> {
    return $("<div/>", {
      id: `toggle-items-${id}`,
      text: "+",
      title: this._host.i18n("ui.itemsShow"),
      css: {
        border: "1px solid rgba(255, 255, 255, 0.2)",
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        minWidth: "10px",
        padding: "0px 3px",
        textAlign: "center",
      },
    });
  }

  protected _getOptionHead(toggleName: string): JQuery<HTMLElement> {
    const containerList = $("<ul/>", {
      id: `items-list-${toggleName}`,
      css: { display: "none", paddingLeft: "20px", paddingTop: "4px" },
    });

    const disableAllButton = $("<div/>", {
      id: `toggle-all-items-${toggleName}`,
      text: this._host.i18n("ui.disable.all"),
      css: {
        border: "1px solid grey",
        cursor: "pointer",
        float: "right",
        display: "inline-block",
        marginBottom: "4px",
        padding: "1px 2px",
      },
    });

    disableAllButton.on("click", function () {
      // can't use find as we only want one layer of checkboxes
      const items = containerList.children().children(":checkbox");
      items.prop("checked", false);
      items.trigger("change");
      containerList.children().children(":checkbox").trigger("change");
    });

    containerList.append(disableAllButton);

    const enableAllButton = $("<div/>", {
      id: `toggle-all-items-${toggleName}`,
      text: this._host.i18n("ui.enable.all"),
      css: {
        border: "1px solid grey",
        cursor: "pointer",
        float: "right",
        display: "inline-block",
        marginBottom: "4px",
        marginRight: "8px",
        padding: "1px 2px",
      },
    });

    enableAllButton.on("click", function () {
      // can't use find as we only want one layer of checkboxes
      const items = containerList.children().children(":checkbox");
      items.prop("checked", true);
      items.trigger("change");
      containerList.children().children(":checkbox").trigger("change");
    });

    containerList.append(enableAllButton);
    return containerList;
  }

  protected _getHeader(text: string): JQuery<HTMLElement> {
    const headerElement = $("<li/>");
    const header = $("<span/>", {
      text,
      css: {
        color: "grey",
        cursor: "default",
        display: "inline-block",
        minWidth: "100px",
        userSelect: "none",
      },
    });

    headerElement.append(header);

    return headerElement;
  }

  protected getOption(
    name: string,
    option: { enabled: boolean; $enabled?: JQuery<HTMLElement> },
    i18nName: string,
    delimiter = false,
    handler: {
      onCheck?: () => void;
      onUnCheck?: () => void;
    } = {}
  ): JQuery<HTMLElement> {
    const element = $("<li/>");
    const elementLabel = i18nName;

    const label = $("<label/>", {
      for: `toggle-${name}`,
      text: elementLabel,
      css: {
        display: "inline-block",
        marginBottom: delimiter ? "10px" : undefined,
        minWidth: "100px",
      },
    });

    const input = $("<input/>", {
      id: `toggle-${name}`,
      type: "checkbox",
    }).data("option", option);
    option.$enabled = input;

    // if (option.enabled) {
    //   input.prop("checked", true);
    // }

    input.on("change", () => {
      if (input.is(":checked") && option.enabled === false) {
        if (handler.onCheck) {
          handler.onCheck();
        } else {
          this._host.updateOptions(() => (option.enabled = true));
          clog("Unlogged action item");
        }
      } else if (!input.is(":checked") && option.enabled === true) {
        if (handler.onUnCheck) {
          handler.onUnCheck();
        } else {
          this._host.updateOptions(() => (option.enabled = false));
          clog("Unlogged action item");
        }
      }
      //kittenStorage.items[input.attr("id")] = option.enabled;
      //this._host.saveToKittenStorage();
    });

    element.append(input, label);

    return element;
  }

  protected getAllAvailableResourceOptions(
    forReset: boolean,
    onAddHandler: (res: {
      craftable: boolean;
      maxValue: number;
      name: Resource;
      title: string;
      type: "common" | "uncommon";
      value: number;
      visible: boolean;
    }) => void
  ): Array<JQuery<HTMLElement>> {
    const items = [];
    const idPrefix = forReset ? "#resource-reset-" : "#resource-";

    for (const resource of this._host.gamePage.resPool.resources) {
      // Show only new resources that we don't have in the list and that are
      // visible. This helps cut down on total size.
      if (resource.name && $(idPrefix + resource.name).length === 0) {
        const item = $("<div/>", {
          id: `resource-add-${resource.name}`,
          text: ucfirst(resource.title ? resource.title : resource.name),
          css: { cursor: "pointer" },
        });

        item.on("click", () => {
          item.remove();
          onAddHandler(resource);
          this._host.updateOptions();
        });

        items.push(item);
      }
    }

    return items;
  }

  protected addNewResourceOption(
    name: Resource,
    title: string,
    option: ResourcesSettingsItem,
    onDelHandler: (name: Resource, option: ResourcesSettingsItem) => void
  ): JQuery<HTMLElement> {
    //title = title || this._host.gamePage.resPool.get(name)?.title || ucfirst(name);

    const stock = option.stock;
    const consume = option.consume ?? this._host.options.consume;

    // The overall container for this resource item.
    const container = $("<div/>", {
      id: `resource-${name}`,
      css: { display: "inline-block", width: "100%" },
    });

    // The label with the name of the resource.
    const label = $("<div/>", {
      id: `resource-label-${name}`,
      text: title,
      css: { display: "inline-block", width: "95px" },
    });

    // How many items to stock.
    const stockElement = $("<div/>", {
      id: `stock-value-${name}`,
      text: this._host.i18n("resources.stock", [
        stock === Infinity ? "∞" : this._host.gamePage.getDisplayValueExt(stock),
      ]),
      css: { cursor: "pointer", display: "inline-block", width: "80px" },
    });

    // The consume rate for the resource.
    const consumeElement = $("<div/>", {
      id: `consume-rate-${name}`,
      text: this._host.i18n("resources.consume", [consume.toFixed(2)]),
      css: { cursor: "pointer", display: "inline-block" },
    });

    // Delete the resource from the list.
    const del = $("<div/>", {
      id: `resource-delete-${name}`,
      text: this._host.i18n("resources.del"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
      },
    });

    container.append(label, stockElement, consumeElement, del);

    // once created, set color if relevant
    if (option !== undefined && option.stock !== undefined) {
      this._setStockWarning(name, option.stock);
    }

    stockElement.on("click", () => {
      const value = window.prompt(
        this._host.i18n("resources.stock.set", [title]),
        option.stock.toFixed(0)
      );
      if (value !== null) {
        this.setStockValue(name, parseInt(value), false);
        this._host.updateOptions();
      }
    });

    consumeElement.on("click", () => {
      const value = window.prompt(
        this._host.i18n("resources.consume.set", [title]),
        option.consume?.toFixed(2)
      );
      if (value !== null) {
        this._host.updateOptions(() => (option.consume = parseFloat(value)));
      }
    });

    del.on("click", () => {
      if (window.confirm(this._host.i18n("resources.del.confirm", [title]))) {
        container.remove();
        onDelHandler(name, option);
        this._host.updateOptions();
      }
    });

    option.$consume = consumeElement;
    option.$stock = stockElement;

    return container;
  }

  protected removeResourceOption(name: Resource): void {
    const container = $(`#resource-${name}`).remove();
    if (!container.length) {
      return;
    }

    container.remove();
  }

  protected addNewResourceOptionForReset(
    name: Resource,
    title: string,
    option: TimeControlResourcesSettingsItem,
    onDelHandler: (name: Resource, option: TimeControlResourcesSettingsItem) => void
  ): JQuery<HTMLElement> {
    //title = title || this._host.gamePage.resPool.get(name)?.title || ucfirst(name);

    const stock = option.stockForReset;

    // The overall container for this resource item.
    const container = $("<div/>", {
      id: `resource-reset-${name}`,
      css: { display: "inline-block", width: "100%" },
    });

    // The label with the name of the resource.
    const label = $("<div/>", {
      id: `resource-label-${name}`,
      text: title,
      css: { display: "inline-block", width: "95px" },
    });

    // How many items to stock.
    const stockElement = $("<div/>", {
      id: `stock-value-${name}`,
      text: this._host.i18n("resources.stock", [
        stock === Infinity ? "∞" : this._host.gamePage.getDisplayValueExt(stock),
      ]),
      css: { cursor: "pointer", display: "inline-block", width: "80px" },
    });

    // Delete the resource from the list.
    const del = $("<div/>", {
      id: `resource-delete-${name}`,
      text: this._host.i18n("resources.del"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
      },
    });

    container.append(label, stockElement, del);

    stockElement.on("click", () => {
      const value = window.prompt(this._host.i18n("resources.stock.set", [title]));
      if (value !== null) {
        this.setStockValue(name, parseInt(value), true);
      }
    });

    del.on("click", () => {
      if (window.confirm(this._host.i18n("resources.del.confirm", [title]))) {
        container.remove();
        onDelHandler(name, option);
        this._host.updateOptions();
      }
    });

    option.$stockForReset = stockElement;

    return container;
  }

  protected removeResourceOptionForReset(name: Resource): void {
    const container = $(`#resource-reset-${name}`);
    if (!container) {
      return;
    }

    container.remove();
  }

  private _setStockWarning(name: Resource, value: number, forReset = false): void {
    // simplest way to ensure it doesn't stick around too often; always do
    // a remove first then re-add only if needed
    const path = forReset ? `#resource-reset-${name}` : `#resource-${name}`;
    $(path).removeClass("stockWarn");

    const maxValue = this._host.gamePage.resPool.resources.filter(i => i.name === name)[0].maxValue;
    if ((value > maxValue && !(maxValue === 0)) || value === Infinity) {
      $(path).addClass("stockWarn");
    }
  }

  protected setStockValue(name: Resource, value: number, forReset = false): void {
    if (value < 0) {
      this._host.warning(`ignoring non-numeric or invalid stock value '${value}'`);
      return;
    }

    if (forReset) {
      value = value < 0 ? Infinity : value;
      mustExist(this._host.options.auto.timeCtrl.resources[name]).checkForReset = true;
      mustExist(this._host.options.auto.timeCtrl.resources[name]).stockForReset = value;
    } else {
      mustExist(this._host.options.auto.craft.resources[name]).enabled = true;
      mustExist(this._host.options.auto.craft.resources[name]).stock = value;
    }
  }

  setConsumeRate(name: Resource, value: number): void {
    if (value < 0.0 || 1.0 < value) {
      this._host.warning(`ignoring non-numeric or invalid consume rate ${value}`);
      return;
    }

    mustExist(this._host.options.auto.craft.resources[name]).consume = value;
  }
}
