import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { SupportedLanguage } from "../Engine.js";
import { UserScript } from "../UserScript.js";
import { SettingOptions } from "../settings/Settings.js";
import { TechSettings } from "../settings/TechSettings.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, SettingsPanelOptions } from "./components/SettingsPanel.js";

export class TechSettingsUi extends SettingsPanel<TechSettings> {
  protected readonly _techs: Array<SettingListItem>;

  constructor(
    host: UserScript,
    settings: TechSettings,
    language: SettingOptions<SupportedLanguage>,
    options?: SettingsPanelOptions<SettingsPanel<TechSettings>>,
  ) {
    super(host, host.engine.i18n("ui.upgrade.techs"), settings, options);

    const items = [];
    for (const tech of this._host.game.science.techs) {
      if (isNil(this.setting.techs[tech.name])) continue;
      const label = tech.label;
      const button = new SettingListItem(this._host, label, this.setting.techs[tech.name], {
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

    this._techs = items.map(button => button.button);
  }
}
