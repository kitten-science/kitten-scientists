import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { SupportedLanguage } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { PolicySettings } from "../settings/PolicySettings.js";
import { SettingOptions } from "../settings/Settings.js";
import { PanelOptions } from "./components/CollapsiblePanel.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

export class PolicySettingsUi extends SettingsPanel<PolicySettings> {
  constructor(
    host: KittenScientists,
    settings: PolicySettings,
    language: SettingOptions<SupportedLanguage>,
    options?: PanelOptions,
  ) {
    const label = host.engine.i18n("ui.upgrade.policies");
    super(
      host,
      settings,
      new SettingListItem(host, label, settings, {
        onCheck: () => {
          host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.auto.disable", [label]);
        },
      }),
      options,
    );

    const items = [];
    for (const policie of this._host.game.science.policies) {
      if (isNil(this.setting.policies[policie.name])) continue;
      const label = policie.label;
      const button = new SettingListItem(this._host, label, this.setting.policies[policie.name], {
        onCheck: () => {
          this._host.engine.imessage("status.sub.enable", [label]);
        },
        onUnCheck: () => {
          this._host.engine.imessage("status.sub.disable", [label]);
        },
      });

      items.push({ label: label, button: button });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    if (language.selected !== "zh") {
      items.sort((a, b) => a.label.localeCompare(b.label));
    }
    const itemsList = new SettingsList(this._host);
    items.forEach(button => {
      itemsList.addChild(button.button);
    });
    this.addChild(itemsList);
  }
}
