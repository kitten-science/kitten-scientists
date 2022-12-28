import { BuildingUpgradeSettings } from "../settings/BuildingUpgradeSettings";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsPanel } from "./components/SettingsPanel";

export class BuildingUpgradeSettingsUi extends SettingsPanel<BuildingUpgradeSettings> {
  private readonly _upgrades: Array<SettingListItem>;

  constructor(host: UserScript, settings: BuildingUpgradeSettings) {
    super(host, host.engine.i18n("ui.upgrade.buildings"), settings);

    this.list.addEventListener("enableAll", () => {
      this._upgrades.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this.list.addEventListener("disableAll", () => {
      this._upgrades.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this.list.addEventListener("reset", () => {
      this.setting.load(new BuildingUpgradeSettings());
      this.refreshUi();
    });

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
    items.forEach(button => this.addChild(button.button));

    this._upgrades = items.map(button => button.button);
  }
}
