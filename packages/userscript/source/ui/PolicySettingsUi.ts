import { PolicySettings } from "../settings/PolicySettings";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsPanel } from "./components/SettingsPanel";

export class PolicySettingsUi extends SettingsPanel<PolicySettings> {
  private readonly _policies: Array<SettingListItem>;

  constructor(host: UserScript, settings: PolicySettings) {
    super(host, host.engine.i18n("ui.upgrade.policies"), settings);

    const items = [];
    for (const setting of Object.values(this.setting.policies)) {
      const policyLabel = this._host.engine.i18n(
        `$policy.${setting.policy === "authocracy" ? "autocracy" : setting.policy}.label`
      );
      const policyButton = new SettingListItem(this._host, policyLabel, setting, {
        onCheck: () => this._host.engine.imessage("status.sub.enable", [policyLabel]),
        onUnCheck: () => this._host.engine.imessage("status.sub.disable", [policyLabel]),
      });

      items.push({ label: policyLabel, button: policyButton });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    items.sort((a, b) => a.label.localeCompare(b.label));
    items.forEach(button => this.addChild(button.button));

    this._policies = items.map(button => button.button);
  }
}
