import { PolicySettings } from "../settings/PolicySettings.js";
import { UserScript } from "../UserScript.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, SettingsPanelOptions } from "./components/SettingsPanel.js";

export class PolicySettingsUi extends SettingsPanel<PolicySettings> {
  constructor(
    host: UserScript,
    settings: PolicySettings,
    options?: SettingsPanelOptions<SettingsPanel<PolicySettings>>,
  ) {
    super(host, host.engine.i18n("ui.upgrade.policies"), settings, options);

    const items = [];
    for (const setting of Object.values(this.setting.policies)) {
      const policyLabel = this._host.engine.i18n(
        `$policy.${setting.policy === "authocracy" ? "autocracy" : setting.policy}.label`,
      );
      const policyButton = new SettingListItem(this._host, policyLabel, setting, {
        onCheck: () => this._host.engine.imessage("status.sub.enable", [policyLabel]),
        onUnCheck: () => this._host.engine.imessage("status.sub.disable", [policyLabel]),
      });

      items.push({ label: policyLabel, button: policyButton });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    items.sort((a, b) => a.label.localeCompare(b.label));
    const itemsList = new SettingsList(this._host);
    items.forEach(button => itemsList.addChild(button.button));
    this.addChild(itemsList);
  }
}
