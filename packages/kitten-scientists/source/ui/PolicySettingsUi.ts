import { isNil } from "@oliversalzburg/js-utils/nil.js";
import { UserScript } from "../UserScript.js";
import { PolicySettings } from "../settings/PolicySettings.js";
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
    for (const policie of this._host.game.science.policies) {
      if (isNil(this.setting.policies[policie.name])) continue;
      const label = policie.label;
      const button = new SettingListItem(this._host, label, this.setting.policies[policie.name], {
        onCheck: () => this._host.engine.imessage("status.sub.enable", [label]),
        onUnCheck: () => this._host.engine.imessage("status.sub.disable", [label]),
      });

      items.push({ label: label, button: button });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    items.sort((a, b) => a.label.localeCompare(b.label));
    const itemsList = new SettingsList(this._host);
    items.forEach(button => itemsList.addChild(button.button));
    this.addChild(itemsList);
  }
}
