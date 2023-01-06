import { BuildingUpgradeSettings } from "../settings/BuildingUpgradeSettings";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsList } from "./components/SettingsList";
import { SettingsPanel, SettingsPanelOptions } from "./components/SettingsPanel";

export class BuildingUpgradeSettingsUi extends SettingsPanel<BuildingUpgradeSettings> {
  constructor(
    host: UserScript,
    settings: BuildingUpgradeSettings,
    options?: SettingsPanelOptions<SettingsPanel<BuildingUpgradeSettings>>
  ) {
    super(host, host.engine.i18n("ui.upgrade.buildings"), settings, options);

    const items = [];
    for (const setting of Object.values(this.setting.buildings)) {
      const label = this._host.engine.i18n(`$buildings.${setting.upgrade}.label`);
      const button = new SettingListItem(this._host, label, setting, {
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
