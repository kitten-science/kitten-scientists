import { Icons } from "../images/Icons.js";
import { ResetUpgradeSettings } from "../settings/ResetUpgradeSettings.js";
import { Setting } from "../settings/Settings.js";
import { UserScript } from "../UserScript.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";

export class ResetUpgradesSettingsUi extends IconSettingsPanel<ResetUpgradeSettings> {
  constructor(host: UserScript, settings: ResetUpgradeSettings) {
    const label = host.engine.i18n("ui.upgrades");
    super(host, label, settings, {
      icon: Icons.Workshop,
    });

    const items = [];
    for (const setting of Object.values(this.setting.upgrades)) {
      const label = this._host.engine.i18n(`$workshop.${setting.upgrade}.label`);
      const button = this._getResetOption(setting, label);

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

  private _getResetOption(
    option: Setting,
    i18nName: string,
    delimiter = false,
    upgradeIndicator = false,
  ) {
    return new SettingListItem(this._host, i18nName, option, {
      delimiter,
      onCheck: () => this._host.engine.imessage("status.reset.check.enable", [i18nName]),
      onUnCheck: () => this._host.engine.imessage("status.reset.check.disable", [i18nName]),
      upgradeIndicator,
    });
  }
}
