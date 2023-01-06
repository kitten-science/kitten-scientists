import { TechSettings } from "../settings/TechSettings";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsList } from "./components/SettingsList";
import { SettingsPanel, SettingsPanelOptions } from "./components/SettingsPanel";

export class TechSettingsUi extends SettingsPanel<TechSettings> {
  protected readonly _techs: Array<SettingListItem>;

  constructor(
    host: UserScript,
    settings: TechSettings,
    options?: SettingsPanelOptions<SettingsPanel<TechSettings>>
  ) {
    super(host, host.engine.i18n("ui.upgrade.techs"), settings, options);

    const items = [];
    for (const setting of Object.values(this.setting.techs)) {
      const label = this._host.engine.i18n(`$science.${setting.tech}.label`);
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

    this._techs = items.map(button => button.button);
  }
}
