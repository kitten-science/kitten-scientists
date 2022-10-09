import { BonfireSettingsItem } from "../options/BonfireSettings";
import { ReligionSettingsItem } from "../options/ReligionSettings";
import { SettingMax } from "../options/Settings";
import { UserScript } from "../UserScript";
import { WorkshopManager } from "../WorkshopManager";
import { SettingMaxListItem } from "./components/SettingMaxListItem";
import { SettingsPanel } from "./components/SettingsPanel";

export type Toggleable = {
  get isExpanded(): boolean;
  toggle: (expand: boolean | undefined) => void;
};

/**
 * Base class for all automation UI sections.
 * This provides common functionality to help build the automation sections themselves.
 */
export abstract class SettingsSectionUi {
  protected _host: UserScript;
  readonly element: JQuery<HTMLElement>;
  readonly panel: SettingsPanel;

  constructor(host: UserScript, panel: SettingsPanel) {
    this._host = host;
    this.element = panel.element;
    this.panel = panel;
  }

  abstract refreshUi(): void;

  protected _getBuildOption(
    option: BonfireSettingsItem | ReligionSettingsItem | SettingMax,
    label: string,
    delimiter = false,
    upgradeIndicator = false
  ) {
    return new SettingMaxListItem(
      this._host,
      label,
      option,
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
