import { ScienceSettings } from "../options/ScienceSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsListUi } from "./SettingsListUi";
import { SettingsPanelUi } from "./SettingsPanelUi";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { SettingUi } from "./SettingUi";

export class ScienceSettingsUi extends SettingsSectionUi {
  private readonly _settings: ScienceSettings;

  constructor(host: UserScript, settings: ScienceSettings) {
    const toggleName = "upgrade";
    const label = ucfirst(host.engine.i18n("ui.upgrade"));
    const list = SettingsListUi.getSettingsList(host.engine, toggleName);
    const panel = SettingsPanelUi.make(host, toggleName, label, settings, list);
    super(host, panel, list);

    this._settings = settings;

    // Technologies
    const techsList = SettingsListUi.getSettingsList(this._host.engine, "techs");
    const techsElement = SettingsPanelUi.make(
      this._host,
      "techs",
      this._host.engine.i18n("ui.upgrade.techs"),
      this._settings.techs,
      techsList
    );

    const techButtons = [];
    for (const [techName, tech] of objectEntries(this._settings.techs.items)) {
      const label = this._host.engine.i18n(`$science.${techName}.label`);
      const button = SettingUi.make(this._host, `tech-${techName}`, tech, label, {
        onCheck: () => this._host.engine.imessage("status.auto.enable", [label]),
        onUnCheck: () => this._host.engine.imessage("status.auto.disable", [label]),
      });

      techButtons.push({ label: label, button: button });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    techButtons.sort((a, b) => a.label.localeCompare(b.label));
    techButtons.forEach(button => techsList.append(button.button.element));

    // Policies
    const policiesList = SettingsListUi.getSettingsList(this._host.engine, "policies");
    const policiesElement = SettingsPanelUi.make(
      this._host,
      "policies",
      this._host.engine.i18n("ui.upgrade.policies"),
      this._settings.policies,
      policiesList
    );

    const policyButtons = [];
    for (const [policyName, policy] of objectEntries(this._settings.policies.items)) {
      const policyLabel = this._host.engine.i18n(
        `$policy.${policyName === "authocracy" ? "autocracy" : policyName}.label`
      );
      const policyButton = SettingUi.make(this._host, `policy-${policyName}`, policy, policyLabel, {
        onCheck: () => this._host.engine.imessage("status.auto.enable", [policyLabel]),
        onUnCheck: () => this._host.engine.imessage("status.auto.disable", [policyLabel]),
      });

      policyButtons.push({ label: policyLabel, button: policyButton });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    policyButtons.sort((a, b) => a.label.localeCompare(b.label));
    policyButtons.forEach(button => policiesList.append(button.button.element));

    list.append(techsElement.element, techsList, policiesElement.element, policiesList);
    panel.element.append(list);
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
