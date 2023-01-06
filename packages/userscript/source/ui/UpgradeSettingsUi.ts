import { UpgradeSettings } from "../settings/UpgradeSettings";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsList } from "./components/SettingsList";
import { SettingsPanel, SettingsPanelOptions } from "./components/SettingsPanel";

export class UpgradeSettingsUi extends SettingsPanel<UpgradeSettings> {
  constructor(
    host: UserScript,
    settings: UpgradeSettings,
    options?: SettingsPanelOptions<SettingsPanel<UpgradeSettings>>
  ) {
    super(host, host.engine.i18n("ui.upgrade.upgrades"), settings, options);

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

    let lastLetter = items[0].label.charCodeAt(0);
    let lastItem = items[0];
    for (const item of items) {
      const subject = item.label.charCodeAt(0);
      if (subject !== lastLetter) {
        lastLetter = subject;
        lastItem.button.element.addClass("ks-delimiter");
      }
      lastItem = item;
    }

    const itemsList = new SettingsList(this._host);
    items.forEach(button => itemsList.addChild(button.button));
    this.addChild(itemsList);
  }
}
