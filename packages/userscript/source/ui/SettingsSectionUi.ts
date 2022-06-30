import { ResourcesSettingsItem } from "../options/ResourcesSettings";
import { SettingToggle, SettingTrigger } from "../options/SettingsSection";
import { TimeControlResourcesSettingsItem } from "../options/TimeControlSettings";
import { ucfirst } from "../tools/Format";
import { clog } from "../tools/Log";
import { mustExist } from "../tools/Maybe";
import { Resource } from "../types";
import { UserScript } from "../UserScript";

export type SettingsSectionUiComposition = {
  checkbox: JQuery<HTMLElement>;
  items: JQuery<HTMLElement>;
  label: JQuery<HTMLElement>;
  panel: JQuery<HTMLElement>;
};

/**
 * Base class for all automation UI sections.
 * This provides common functionality to help build the automation sections themselves.
 */
export abstract class SettingsSectionUi<TState> {
  protected _host: UserScript;

  constructor(host: UserScript) {
    this._host = host;
  }

  abstract getState(): TState;
  abstract setState(state: TState): void;
  abstract refreshUi(): void;

  /**
   * Constructs a settings panel that is used to contain a major section of the UI.
   *
   * @param id The ID of the settings panel.
   * @param label The label to put main checkbox of this section.
   * @returns The constructed settings panel.
   */
  protected _getSettingsPanel(id: string, label: string): SettingsSectionUiComposition {
    const panelElement = $("<li/>", { id: `ks-${id}` });
    // Add a border on the element
    panelElement.css("borderTop", "1px solid rgba(185, 185, 185, 0.2)");

    // The checkbox to enable/disable this panel.
    const enabledElement = $("<input/>", {
      id: `toggle-${id}`,
      type: "checkbox",
    });
    panelElement.append(enabledElement);

    // The label for this panel.
    const labelElement = $("<label/>", {
      text: label,
    });
    panelElement.append(labelElement);

    // The expando button for this panel.
    const itemsElement = this._getItemsToggle(id);
    panelElement.append(itemsElement);

    // When clicking the label of a major section, expand it instead of
    // checking the checkbox.
    // TODO: Maybe not?
    labelElement.on("click", () => itemsElement.trigger("click"));

    return {
      checkbox: enabledElement,
      items: itemsElement,
      label: labelElement,
      panel: panelElement,
    };
  }

  /**
   * Constructs an expando element that is commonly used to expand and
   * collapses a section of the UI.
   *
   * @param id The ID of the section this is the expando for.
   * @returns The constructed expando element.
   */
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

  /**
   * Constructs a button to configure the trigger value of an
   * automation section.
   *
   * @param id The ID of this trigger button.
   * @param handler Handlers to register on the control.
   * @param handler.onClick Call this method when the trigger button
   * is clicked.
   * @returns The constructed trigger button.
   */
  protected _getTriggerButton(id: string, handler: { onClick?: () => void } = {}) {
    const triggerButton = $("<div/>", {
      id: `trigger-${id}`,
      text: this._host.i18n("ui.trigger"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
      },
    });

    if (handler.onClick) {
      triggerButton.on("click", handler.onClick);
    }

    return triggerButton;
  }

  /**
   * Creates a new button to control a trigger value in a configuration section.
   *
   * @param id The ID of the button.
   * @param itext The label of the section this trigger is for.
   * @param options The settings section this trigger is for.
   * @returns The created button.
   */
  protected _registerTriggerButton(id: string, itext: string, options: SettingTrigger) {
    return this._getTriggerButton(id, {
      onClick: () => {
        const value = window.prompt(
          this._host.i18n("ui.trigger.set", [itext]),
          options.trigger.toFixed(2)
        );

        if (value !== null) {
          this._host.updateOptions(() => (options.trigger = parseFloat(value)));
          this.refreshUi();
        }
      },
    });
  }

  /**
   * Constructs a list panel that is used to contain a list of options.
   * The panel has "enable all" and "disable all" buttons to check and
   * uncheck all checkboxes in the section at once.
   *
   * @param id The ID for this list.
   * @returns The constructed list.
   */
  protected _getOptionList(id: string): JQuery<HTMLElement> {
    const containerList = $("<ul/>", {
      id: `items-list-${id}`,
      css: { display: "none", paddingLeft: "20px", paddingTop: "4px" },
    });

    const disableAllButton = $("<div/>", {
      id: `toggle-all-items-${id}`,
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
      id: `toggle-all-items-${id}`,
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

  /**
   * Construct a subsection header.
   * This is purely for cosmetic/informational value in the UI.
   *
   * @param text The text to appear on the header element.
   * @returns The constructed header element.
   */
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

  /**
   * Construct an informational text item.
   * This is purely for cosmetic/informational value in the UI.
   *
   * @param text The text to appear on the header element.
   * @returns The constructed header element.
   */
  protected _getExplainer(text: string): JQuery<HTMLElement> {
    const headerElement = $("<li/>");
    const header = $("<span/>", {
      text,
      css: {
        color: "#888",
        cursor: "default",
        display: "inline-block",
        minWidth: "100px",
        userSelect: "none",
        padding: "4px",
      },
    });

    headerElement.append(header);

    return headerElement;
  }

  /**
   * Construct a new option element.
   * This is a simple checkbox with a label.
   *
   * @param name The internal ID of this option. Should be unique throughout the script.
   * @param option The option this element is linked to.
   * @param i18nName The label on the option element.
   * @param delimiter Should there be additional padding below this element?
   * @param handler The event handlers for this option element.
   * @param handler.onCheck Will be invoked when the user checks the checkbox.
   * @param handler.onUnCheck Will be invoked when the user unchecks the checkbox.
   * @returns The constructed option element.
   */
  protected _getOption(
    name: string,
    option: SettingToggle,
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
    });

    element.append(input, label);

    return element;
  }

  /**
   * Create a list of option elements that represent every single resource
   * available in the game. This allows users to pick certain resources for
   * other operations.
   *
   * @param forReset Is this a list that will be used to control resources
   * for reset automation?
   * @param onAddHandler Call this method when the user clicks on one of the
   * resources to add them.
   * @returns A list of option elements.
   */
  protected _getAllAvailableResourceOptions(
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

  /**
   * Creates a UI element that reflects stock and consume values for a given resource.
   * This is currently only used for the craft section.
   *
   * @param name The resource.
   * @param title The title to apply to the option.
   * @param option The option that is being controlled.
   * @param onDelHandler Will be invoked when the user removes the resoruce from the list.
   * @returns A new option with stock and consume values.
   */
  protected _addNewResourceOption(
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
        const stockValue = parseInt(value);
        this._setStockValue(name, stockValue, false);
        stockElement.text(
          this._host.i18n("resources.stock", [
            stockValue === Infinity ? "∞" : this._host.gamePage.getDisplayValueExt(stockValue),
          ])
        );
        this._host.updateOptions();
      }
    });

    consumeElement.on("click", () => {
      const value = window.prompt(
        this._host.i18n("resources.consume.set", [title]),
        option.consume?.toFixed(2)
      );
      if (value !== null) {
        const consumeValue = parseFloat(value);
        this._host.updateOptions(() => (option.consume = consumeValue));
        consumeElement.text(this._host.i18n("resources.consume", [consumeValue.toFixed(2)]));
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

  /**
   * Removes a previously created resource option.
   *
   * @param name The resource to remove.
   */
  protected _removeResourceOption(name: Resource): void {
    const container = $(`#resource-${name}`).remove();
    if (!container.length) {
      return;
    }

    container.remove();
  }

  /**
   * Creates a UI element that reflects stock values for a given resource.
   * This is currently only used for the time/reset section.
   *
   * @param name The resource.
   * @param title The title to apply to the option.
   * @param option The option that is being controlled.
   * @param onDelHandler Will be invoked when the user removes the resoruce from the list.
   * @returns A new option with stock value.
   */
  protected _addNewResourceOptionForReset(
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
        this._setStockValue(name, parseInt(value), true);
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

  /**
   * Removes a previously created resource option.
   *
   * @param name The resource to remove.
   */
  protected _removeResourceOptionForReset(name: Resource): void {
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

  protected _setStockValue(name: Resource, value: number, forReset = false): void {
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
