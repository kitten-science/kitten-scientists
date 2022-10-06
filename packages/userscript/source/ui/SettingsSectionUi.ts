import { BonfireSettingsItem } from "../options/BonfireSettings";
import { ReligionSettingsItem } from "../options/ReligionSettings";
import { SettingMax, SettingTrigger } from "../options/Settings";
import { SettingsSection } from "../options/SettingsSection";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { Resource } from "../types";
import { UserScript } from "../UserScript";
import { WorkshopManager } from "../WorkshopManager";
import { SettingMaxUi } from "./SettingMaxUi";

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
export abstract class SettingsSectionUi {
  protected _host: UserScript;
  protected _mainChild: JQuery<HTMLElement> | null = null;
  protected _itemsExpanded = false;

  constructor(host: UserScript) {
    this._host = host;
  }

  abstract refreshUi(): void;

  /**
   * Expands the options list if true, and collapses it if false.
   * Changes the value of _itemsExpanded even if _mainChild is not defined.
   *
   * @param display Force a display state.
   * @returns the value of _itemsExpanded
   */
  public toggleOptions(display = !this._itemsExpanded) {
    this._itemsExpanded = display;
    if (this._mainChild) {
      this._mainChild.toggle(display);
    }
    return this._itemsExpanded;
  }

  /**
   * Constructs a settings panel that is used to contain a major section of the UI.
   *
   * @param id The ID of the settings panel.
   * @param label The label to put main checkbox of this section.
   * @param options An options section for which this is the settings panel.
   * @param mainChild The main child element in the panel that should be toggled with
   * the sections' expando button.
   * @returns The constructed settings panel.
   */
  protected _getSettingsPanel(
    id: string,
    label: string,
    options: SettingsSection,
    mainChild: JQuery<HTMLElement>
  ): SettingsSectionUiComposition {
    this._mainChild = mainChild;

    const panelElement = $('<li class="ks-setting"/>', { id: `ks-${id}` });
    // Add a border on the element
    panelElement.css("borderTop", "1px solid rgba(185, 185, 185, 0.2)");

    // The checkbox to enable/disable this panel.
    const enabledElement = $("<input/>", {
      id: `toggle-${id}`,
      type: "checkbox",
    });
    panelElement.append(enabledElement);

    enabledElement.on("change", () => {
      if (enabledElement.is(":checked") && options.enabled === false) {
        this._host.updateOptions(() => (options.enabled = true));
        this._host.engine.imessage("status.auto.enable", [label]);
      } else if (!enabledElement.is(":checked") && options.enabled === true) {
        this._host.updateOptions(() => (options.enabled = false));
        this._host.engine.imessage("status.auto.disable", [label]);
      }
    });

    // The label for this panel.
    const labelElement = $("<label/>", {
      text: label,
    });
    panelElement.append(labelElement);

    // The expando button for this panel.
    const itemsElement = this._getItemsToggle(id);
    panelElement.append(itemsElement);

    itemsElement.on("click", () => {
      this.toggleOptions();

      itemsElement.text(this._itemsExpanded ? "-" : "+");
      itemsElement.prop(
        "title",
        this._itemsExpanded
          ? this._host.engine.i18n("ui.itemsHide")
          : this._host.engine.i18n("ui.itemsShow")
      );
    });

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
      title: this._host.engine.i18n("ui.itemsShow"),
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
  static getTriggerButton(id: string, handler: { onClick?: () => void } = {}) {
    const triggerButton = $("<div/>", {
      id: `trigger-${id}`,
      html: '<svg style="width:15px;height:15px" viewBox="0 0 24 24"><path fill="currentColor" d="M11 15H6L13 1V9H18L11 23V15Z" /></svg>',
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        marginBottom: "-2px",
        paddingRight: "3px",
        paddingTop: "2px",
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
    return SettingsSectionUi.getTriggerButton(id, {
      onClick: () => {
        const value = SettingsSectionUi.promptPercentage(
          this._host.engine.i18n("ui.trigger.set", [itext]),
          SettingsSectionUi.renderPercentage(options.trigger)
        );

        if (value !== null) {
          this._host.updateOptions(() => (options.trigger = value));
          this.refreshUi();
        }
      },
    });
  }

  static getList(id: string) {
    return $('<ul class="ks-list"/>');
  }

  /**
   * Constructs a list panel that is used to contain a list of options.
   * The panel has "enable all" and "disable all" buttons to check and
   * uncheck all checkboxes in the section at once.
   *
   * @param id The ID for this list.
   * @returns The constructed list.
   */
  protected _getItemsList(id: string): JQuery<HTMLElement> {
    const containerList = $('<ul class="ks-list ks-items-list"/>', {
      id: `items-list-${id}`,
    });

    const disableAllButton = $('<div class="ks-button"/>', {
      id: `toggle-all-items-${id}`,
    }).text(this._host.engine.i18n("ui.disable.all"));

    disableAllButton.on("click", function () {
      // can't use find as we only want one layer of checkboxes
      const items = containerList.children().children(":checkbox");
      items.prop("checked", false);
      items.trigger("change");
      containerList.children().children(":checkbox").trigger("change");
    });

    containerList.append(disableAllButton);

    const enableAllButton = $('<div class="ks-button ks-margin-right"/>', {
      id: `toggle-all-items-${id}`,
    }).text(this._host.engine.i18n("ui.enable.all"));

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

  protected _getBuildOption(
    name: string,
    option: BonfireSettingsItem | ReligionSettingsItem | SettingMax,
    label: string,
    delimiter = false,
    upgradeIndicator = false
  ): JQuery<HTMLElement> {
    return SettingMaxUi.make(this._host, name, option, label, delimiter, upgradeIndicator, {
      onCheck: () => {
        this._host.updateOptions(() => (option.enabled = true));
        this._host.engine.imessage("status.auto.enable", [label]);
      },
      onUnCheck: () => {
        this._host.updateOptions(() => (option.enabled = false));
        this._host.engine.imessage("status.auto.disable", [label]);
      },
    });
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

  setConsumeRate(name: Resource, value: number): void {
    if (value < 0.0 || 1.0 < value) {
      this._host.engine.warning(`ignoring non-numeric or invalid consume rate ${value}`);
      return;
    }

    mustExist(this._host.engine.workshopManager.settings.resources[name]).consume = value;
  }

  static promptLimit(text: string, defaultValue: string): number | null {
    const value = window.prompt(text, defaultValue);
    if (value === null) {
      return null;
    }

    const hasSuffix = /[KMGT]$/.test(value);
    const baseValue = value.substring(0, value.length - (hasSuffix ? 1 : 0));

    let numericValue =
      value.includes("e") || hasSuffix ? parseFloat(baseValue) : parseInt(baseValue);
    if (hasSuffix) {
      const suffix = value.substring(value.length - 1);
      numericValue = numericValue * Math.pow(1000, ["", "K", "M", "G", "T"].indexOf(suffix));
    }
    if (numericValue === Number.POSITIVE_INFINITY || numericValue < 0) {
      numericValue = -1;
    }

    return numericValue;
  }

  static promptPercentage(text: string, defaultValue: string): number | null {
    const value = window.prompt(text, defaultValue);
    if (value === null) {
      return null;
    }

    // Cap value between 0 and 1.
    return Math.max(0, Math.min(1, parseFloat(value)));
  }

  protected _renderLimit(value: number): string {
    return SettingsSectionUi.renderLimit(value, this._host);
  }

  static renderLimit(value: number, host: UserScript) {
    if (value < 0 || value === Number.POSITIVE_INFINITY) {
      return "∞";
    }

    return host.gamePage.getDisplayValueExt(value);
  }

  static renderPercentage(value: number): string {
    return value.toFixed(3);
  }

  static renderConsumeRate(consume: number | undefined): string {
    return SettingsSectionUi.renderPercentage(consume ?? WorkshopManager.DEFAULT_CONSUME_RATE);
  }
}
