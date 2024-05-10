import { isNil } from "@oliversalzburg/js-utils/nil.js";
import { SupportedLanguage } from "../Engine.js";
import { UserScript } from "../UserScript.js";
import { SettingOptions } from "../settings/Settings.js";
import { UpgradeSettings } from "../settings/UpgradeSettings.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, SettingsPanelOptions } from "./components/SettingsPanel.js";

export class UpgradeSettingsUi extends SettingsPanel<UpgradeSettings> {
  constructor(
    host: UserScript,
    settings: UpgradeSettings,
    language: SettingOptions<SupportedLanguage>,
    options?: SettingsPanelOptions<SettingsPanel<UpgradeSettings>>,
  ) {
    super(host, host.engine.i18n("ui.upgrade.upgrades"), settings, options);

    const items = [];
    for (const upgrade of this._host.game.workshop.upgrades) {
      if (isNil(this.setting.upgrades[upgrade.name])) continue;
      const label = upgrade.label;
      const button = new SettingListItem(this._host, label, this.setting.upgrades[upgrade.name], {
        onCheck: () => this._host.engine.imessage("status.sub.enable", [label]),
        onUnCheck: () => this._host.engine.imessage("status.sub.disable", [label]),
      });

      items.push({ label: label, button: button });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    if (language.selected !== "zh") {
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
    }
    const itemsList = new SettingsList(this._host);
    items.forEach(button => itemsList.addChild(button.button));
    this.addChild(itemsList);
  }
}
