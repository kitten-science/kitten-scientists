import { PolicySettings } from "../options/PolicySettings";
import { ScienceSettings } from "../options/ScienceSettings";
import { TechSettings } from "../options/TechSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class ScienceSettingsUi extends SettingsSectionUi<ScienceSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: ScienceSettings;

  private _techsExpanded = false;
  private _policiesExpanded = false;

  constructor(host: UserScript, options: ScienceSettings = host.options.auto.unlock) {
    super(host);

    this._options = options;

    const toggleName = "upgrade";
    const label = ucfirst(this._host.i18n("ui.upgrade"));

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getOptionList(toggleName);

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, label, this._options, list);
    this._options.$enabled = element.checkbox;

    const techsButton = this._getOption(
      "techs",
      this._options.items.techs,
      this._host.i18n("ui.upgrade.techs"),
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (this._options.items.techs.enabled = true));
          this._host.imessage("status.auto.enable", [this._host.i18n("ui.upgrade.techs")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (this._options.items.techs.enabled = false));
          this._host.imessage("status.auto.disable", [this._host.i18n("ui.upgrade.techs")]);
        },
      }
    );

    const techsList = $("<ul/>", {
      id: "items-list-techs",
      css: { display: "none", paddingLeft: "20px" },
    });

    const techButtons = [];
    for (const [techName, tech] of objectEntries(
      (this._options.items.techs as TechSettings).items
    )) {
      const techLabel = this._host.i18n(`$science.${techName}.label`);
      const techButton = this._getOption(`tech-${techName}`, tech, techLabel, false, {
        onCheck: () => {
          this._host.updateOptions(() => (tech.enabled = true));
          this._host.imessage("status.auto.enable", [techLabel]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (tech.enabled = false));
          this._host.imessage("status.auto.disable", [techLabel]);
        },
      });

      techButtons.push({ label: techLabel, button: techButton });
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
        this._techsExpanded ? this._host.i18n("ui.itemsHide") : this._host.i18n("ui.itemsShow")
      );
    });
    techsButton.append(techsItemsButton, techsList);

    // Set up the more complex policies options.
    const policiesButton = this._getOption(
      "policies",
      this._options.items.policies,
      this._host.i18n("ui.upgrade.policies"),
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (this._options.items.policies.enabled = true));
          this._host.imessage("status.auto.enable", [this._host.i18n("ui.upgrade.policies")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (this._options.items.policies.enabled = false));
          this._host.imessage("status.auto.disable", [this._host.i18n("ui.upgrade.policies")]);
        },
      }
    );

    const policiesList = $("<ul/>", {
      id: "items-list-policies",
      css: { display: "none", paddingLeft: "20px" },
    });

    const policyButtons = [];
    for (const [policyName, policy] of objectEntries(
      (this._options.items.policies as PolicySettings).items
    )) {
      const policyLabel = this._host.i18n(
        `$policy.${policyName === "authocracy" ? "autocracy" : policyName}.label`
      );
      const policyButton = this._getOption(`policy-${policyName}`, policy, policyLabel, false, {
        onCheck: () => {
          this._host.updateOptions(() => (policy.enabled = true));
          this._host.imessage("status.auto.enable", [policyLabel]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (policy.enabled = false));
          this._host.imessage("status.auto.disable", [policyLabel]);
        },
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
        this._policiesExpanded ? this._host.i18n("ui.itemsHide") : this._host.i18n("ui.itemsShow")
      );
    });
    policiesButton.append(policiesItemsButton, policiesList);

    // Set up the remaining options.
    const optionButtons = [techsButton, policiesButton];

    list.append(...optionButtons);

    element.panel.append(list);

    this.element = element.panel;
  }

  getState(): ScienceSettings {
    return {
      enabled: this._options.enabled,
      items: this._options.items,
    };
  }

  setState(state: ScienceSettings): void {
    this._options.enabled = state.enabled;

    this._options.items.policies.enabled = state.items.policies.enabled;
    this._options.items.techs.enabled = state.items.techs.enabled;

    // Handle policies.
    for (const [name, option] of objectEntries(
      (this._options.items.policies as PolicySettings).items
    )) {
      option.enabled = (state.items.policies as PolicySettings).items[name].enabled;
    }

    // Handle techs.
    for (const [name, option] of objectEntries((this._options.items.techs as TechSettings).items)) {
      option.enabled = (state.items.techs as TechSettings).items[name].enabled;
    }
  }

  refreshUi(): void {
    mustExist(this._options.$enabled).prop("checked", this._options.enabled);

    mustExist(this._options.items.policies.$enabled).prop(
      "checked",
      this._options.items.policies.enabled
    );
    mustExist(this._options.items.techs.$enabled).prop(
      "checked",
      this._options.items.techs.enabled
    );

    // Handle techs.
    for (const [name, option] of objectEntries((this._options.items.techs as TechSettings).items)) {
      mustExist(option.$enabled).prop(
        "checked",
        (this._options.items.techs as TechSettings).items[name].enabled
      );
    }

    // Handle policies.
    for (const [name, option] of objectEntries(
      (this._options.items.policies as PolicySettings).items
    )) {
      mustExist(option.$enabled).prop(
        "checked",
        (this._options.items.policies as PolicySettings).items[name].enabled
      );
    }
  }
}
