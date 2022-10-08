import { BonfireSettingsItem } from "../options/BonfireSettings";
import { ReligionSettingsItem } from "../options/ReligionSettings";
import { SettingMax } from "../options/Settings";
import { UserScript } from "../UserScript";
import { WorkshopManager } from "../WorkshopManager";
import { SettingMaxUi } from "./SettingMaxUi";

export type Toggleable = {
  get isExpanded(): boolean;
  toggle: (expand: boolean | undefined) => void;
};

/**
 * Base class for all automation UI sections.
 * This provides common functionality to help build the automation sections themselves.
 */
export abstract class SettingsSectionUiBase {
  protected _host: UserScript;

  constructor(host: UserScript) {
    this._host = host;
  }

  abstract refreshUi(): void;

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
    const headerElement = $("<li/>", { text }).addClass("ks-header");
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
    const explainerElement = $("<li/>", { text }).addClass("ks-explainer");
    return explainerElement;
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

export abstract class SettingsSectionUi extends SettingsSectionUiBase {
  readonly element: JQuery<HTMLElement>;
  protected readonly expando: JQuery<HTMLElement>;
  protected readonly mainChild: JQuery<HTMLElement>;
  private _mainChildVisible = false;

  get isExpanded() {
    return this._mainChildVisible;
  }

  constructor(
    host: UserScript,
    settingsPanel: { element: JQuery<HTMLElement>; expando: JQuery<HTMLElement> },
    mainChild: JQuery<HTMLElement>
  ) {
    super(host);
    this.element = settingsPanel.element;
    this.expando = settingsPanel.expando;
    this.mainChild = mainChild;
  }

  toggle(expand: boolean | undefined) {
    this._mainChildVisible = expand !== undefined ? expand : !this._mainChildVisible;
    if (this._mainChildVisible) {
      this.mainChild.show();
      this.expando.data("expanded", true);
      this.expando.prop("title", this._host.engine.i18n("ui.itemsHide"));
      this.expando.text("-");
    } else {
      this.mainChild.hide();
      this.expando.data("expanded", false);
      this.expando.prop("title", this._host.engine.i18n("ui.itemsShow"));
      this.expando.text("+");
    }
  }
}
