import { ScienceSettings } from "../options/ScienceSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsPanel } from "./components/SettingsPanel";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class ScienceSettingsUi extends SettingsSectionUi {
  private readonly _settings: ScienceSettings;

  constructor(host: UserScript, settings: ScienceSettings) {
    const label = ucfirst(host.engine.i18n("ui.upgrade"));
    const panel = new SettingsPanel(host, label, settings);
    super(host, panel);

    this._settings = settings;

    // Technologies
    const techsElement = new SettingsPanel(
      this._host,
      this._host.engine.i18n("ui.upgrade.techs"),
      this._settings.techs
    );

    const techButtons = [];
    for (const [techName, tech] of objectEntries(this._settings.techs.items)) {
      const label = this._host.engine.i18n(`$science.${techName}.label`);
      const button = new SettingListItem(this._host, label, tech, {
        onCheck: () => this._host.engine.imessage("status.auto.enable", [label]),
        onUnCheck: () => this._host.engine.imessage("status.auto.disable", [label]),
      });

      techButtons.push({ label: label, button: button });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    techButtons.sort((a, b) => a.label.localeCompare(b.label));
    techButtons.forEach(button => techsElement.list.append(button.button.element));

    // Policies
    const policiesElement = new SettingsPanel(
      this._host,
      this._host.engine.i18n("ui.upgrade.policies"),
      this._settings.policies
    );

    const policyButtons = [];
    for (const [policyName, policy] of objectEntries(this._settings.policies.items)) {
      const policyLabel = this._host.engine.i18n(
        `$policy.${policyName === "authocracy" ? "autocracy" : policyName}.label`
      );
      const policyButton = new SettingListItem(this._host, policyLabel, policy, {
        onCheck: () => this._host.engine.imessage("status.auto.enable", [policyLabel]),
        onUnCheck: () => this._host.engine.imessage("status.auto.disable", [policyLabel]),
      });

      policyButtons.push({ label: policyLabel, button: policyButton });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    policyButtons.sort((a, b) => a.label.localeCompare(b.label));
    policyButtons.forEach(button => policiesElement.list.append(button.button.element));

    panel.list.append(techsElement.element, policiesElement.element);
  }

  setState(state: ScienceSettings): void {
    this._settings.enabled = state.enabled;

    this._settings.policies.enabled = state.policies.enabled;
    this._settings.techs.enabled = state.techs.enabled;

    // Handle policies.
    for (const [name, option] of objectEntries(this._settings.policies.items)) {
      option.enabled = state.policies.items[name].enabled;
    }

    // Handle techs.
    for (const [name, option] of objectEntries(this._settings.techs.items)) {
      option.enabled = state.techs.items[name].enabled;
    }
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).refreshUi();

    mustExist(this._settings.policies.$enabled).refreshUi();
    mustExist(this._settings.techs.$enabled).refreshUi();

    // Handle techs.
    for (const [, option] of objectEntries(this._settings.techs.items)) {
      mustExist(option.$enabled).refreshUi();
    }

    // Handle policies.
    for (const [, option] of objectEntries(this._settings.policies.items)) {
      mustExist(option.$enabled).refreshUi();
    }
  }
}
