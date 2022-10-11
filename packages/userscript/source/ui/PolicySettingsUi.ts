import { PolicySettings } from "../options/PolicySettings";
import { objectEntries } from "../tools/Entries";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsPanel } from "./components/SettingsPanel";

export class PolicySettingsUi extends SettingsPanel<PolicySettings> {
  private readonly _policies: Array<SettingListItem>;

  constructor(host: UserScript, settings: PolicySettings) {
    super(host, host.engine.i18n("ui.upgrade.policies"), settings);

    this._list.addEventListener("enableAll", () => {
      this._policies.forEach(item => (item.settings.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._policies.forEach(item => (item.settings.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.settings.load(new PolicySettings());
      this.refreshUi();
    });

    const items = [];
    for (const [name, setting] of objectEntries(this.settings.items)) {
      const policyLabel = this._host.engine.i18n(
        `$policy.${name === "authocracy" ? "autocracy" : name}.label`
      );
      const policyButton = new SettingListItem(this._host, policyLabel, setting, {
        onCheck: () => this._host.engine.imessage("status.auto.enable", [policyLabel]),
        onUnCheck: () => this._host.engine.imessage("status.auto.disable", [policyLabel]),
      });

      items.push({ label: policyLabel, button: policyButton });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    items.sort((a, b) => a.label.localeCompare(b.label));
    items.forEach(button => this.addChild(button.button));

    this._policies = items.map(button => button.button);
  }
}
