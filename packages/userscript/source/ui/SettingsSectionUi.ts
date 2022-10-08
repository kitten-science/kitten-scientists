import { BonfireSettingsItem } from "../options/BonfireSettings";
import { ReligionSettingsItem } from "../options/ReligionSettings";
import { SettingMax, SettingTrigger } from "../options/Settings";
import { SettingsSection } from "../options/SettingsSection";
import { cwarn } from "../tools/Log";
import { mustExist } from "../tools/Maybe";
import { Resource } from "../types";
import { UserScript } from "../UserScript";
import { WorkshopManager } from "../WorkshopManager";
import { SettingMaxUi } from "./SettingMaxUi";
import { SettingUi } from "./SettingUi";

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
  ): JQuery<HTMLElement> {
    this._mainChild = mainChild;

    const panelElement = SettingUi.make(this._host, id, options, label, {
      onCheck: () => this._host.engine.imessage("status.auto.enable", [label]),
      onUnCheck: () => this._host.engine.imessage("status.auto.disable", [label]),
    });

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

    return panelElement;
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
      title: this._host.engine.i18n("ui.itemsShow"),
    })
      .addClass("ks-expando-button")
      .text("+");
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
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M19.95 42 22 27.9h-7.3q-.55 0-.8-.5t0-.95L26.15 6h2.05l-2.05 14.05h7.2q.55 0 .825.5.275.5.025.95L22 42Z" /></svg>',
    }).addClass("ks-icon-button");

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
    return $("<ul/>", { id }).addClass("ks-list");
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
    const containerList = $("<ul/>", {
      id: `items-list-${id}`,
    })
      .addClass("ks-list")
      .addClass("ks-items-list");

    const disableAllButton = $("<div/>", {
      id: `toggle-all-items-${id}`,
    })
      .text(this._host.engine.i18n("ui.disable.all"))
      .addClass("ks-button");

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
    })
      .text(this._host.engine.i18n("ui.enable.all"))
      .addClass("ks-button")
      .addClass("ks-margin-right");

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
    }).addClass("ks-header");

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
    }).addClass("ks-explainer");

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
    return SettingMaxUi.make(
      this._host,
      name,
      option,
      label,
      {
        onCheck: () => this._host.engine.imessage("status.auto.enable", [label]),
        onUnCheck: () => this._host.engine.imessage("status.auto.disable", [label]),
      },
      delimiter,
      upgradeIndicator
    );
  }

  setConsumeRate(name: Resource, value: number): void {
    if (value < 0.0 || 1.0 < value) {
      cwarn(`ignoring non-numeric or invalid consume rate ${value}`);
      return;
    }

    mustExist(this._host.engine.settings.resources.items[name]).consume = value;
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
