import { UpgradeSettings } from "../settings/UpgradeSettings";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsList } from "./components/SettingsList";
import { SettingsPanel } from "./components/SettingsPanel";

export class UpgradeSettingsUi extends SettingsPanel<UpgradeSettings> {
  private readonly _upgrades: Array<SettingListItem>;

  constructor(host: UserScript, settings: UpgradeSettings) {
    super(host, host.engine.i18n("ui.upgrade.upgrades"), settings);

    const items = [];
    for (const setting of Object.values(this.setting.upgrades)) {
      const label = this._host.engine.i18n(`$workshop.${setting.upgrade}.label`);
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

    this._upgrades = items.map(button => button.button);
  }
}
