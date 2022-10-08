import { BonfireSettingsItem } from "../options/BonfireSettings";
import { ReligionSettingsItem } from "../options/ReligionSettings";
import { SettingMax, SettingTrigger } from "../options/Settings";
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

  constructor(host: UserScript) {
    this._host = host;
  }

  abstract refreshUi(): void;

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
