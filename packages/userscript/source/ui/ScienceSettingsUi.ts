import { ScienceSettings } from "../options/ScienceSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { SettingUi } from "./SettingUi";

export class ScienceSettingsUi extends SettingsSectionUi {
  readonly element: JQuery<HTMLElement>;

  private readonly _settings: ScienceSettings;

  private _techsExpanded = false;
  private _policiesExpanded = false;

  constructor(host: UserScript, settings: ScienceSettings) {
    super(host);

    this._settings = settings;

    const toggleName = "upgrade";
    const label = ucfirst(this._host.engine.i18n("ui.upgrade"));

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getItemsList(toggleName);

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, label, this._settings, list);
    this._settings.$enabled = element.checkbox;

    const techsButton = SettingUi.make(
      this._host,
      "techs",
      this._settings.techs,
      this._host.engine.i18n("ui.upgrade.techs"),
      {
        onCheck: () =>
          this._host.engine.imessage("status.auto.enable", [
            this._host.engine.i18n("ui.upgrade.techs"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.auto.disable", [
            this._host.engine.i18n("ui.upgrade.techs"),
          ]),
      }
    );

    const techsList = SettingsSectionUi.getList("items-list-techs");

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
    techButtons.forEach(button => techsList.append(button.button));

    const techsItemsButton = this._getItemsToggle("techs-show");
    techsItemsButton.on("click", () => {
      techsList.toggle();

      this._techsExpanded = !this._techsExpanded;

      techsItemsButton.text(this._techsExpanded ? "-" : "+");
      techsItemsButton.prop(
        "title",
        this._techsExpanded
          ? this._host.engine.i18n("ui.itemsHide")
          : this._host.engine.i18n("ui.itemsShow")
      );
    });
    techsButton.append(techsItemsButton, techsList);

    // Set up the more complex policies options.
    const policiesButton = SettingUi.make(
      this._host,
      "policies",
      this._settings.policies,
      this._host.engine.i18n("ui.upgrade.policies"),
      {
        onCheck: () =>
          this._host.engine.imessage("status.auto.enable", [
            this._host.engine.i18n("ui.upgrade.policies"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.auto.disable", [
            this._host.engine.i18n("ui.upgrade.policies"),
          ]),
      }
    );

    const policiesList = SettingsSectionUi.getList("items-list-policies");

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
    policyButtons.forEach(button => policiesList.append(button.button));

    const policiesItemsButton = this._getItemsToggle("policies-show");
    policiesItemsButton.on("click", () => {
      policiesList.toggle();

      this._policiesExpanded = !this._policiesExpanded;

      policiesItemsButton.text(this._policiesExpanded ? "-" : "+");
      policiesItemsButton.prop(
        "title",
        this._policiesExpanded
          ? this._host.engine.i18n("ui.itemsHide")
          : this._host.engine.i18n("ui.itemsShow")
      );
    });
    policiesButton.append(policiesItemsButton, policiesList);

    // Set up the remaining options.
    const optionButtons = [techsButton, policiesButton];

    list.append(...optionButtons);

    element.panel.append(list);

    this.element = element.panel;
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

    mustExist(this._settings.$enabled).prop("checked", this._settings.enabled);

    mustExist(this._settings.policies.$enabled).prop("checked", this._settings.policies.enabled);
    mustExist(this._settings.techs.$enabled).prop("checked", this._settings.techs.enabled);

    // Handle techs.
    for (const [name, option] of objectEntries(this._settings.techs.items)) {
      mustExist(option.$enabled).prop("checked", this._settings.techs.items[name].enabled);
    }

    // Handle policies.
    for (const [name, option] of objectEntries(this._settings.policies.items)) {
      mustExist(option.$enabled).prop("checked", this._settings.policies.items[name].enabled);
    }
  }
}
