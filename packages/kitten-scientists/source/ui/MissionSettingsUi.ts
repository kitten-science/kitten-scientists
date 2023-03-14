import { MissionSettings } from "../settings/MissionSettings";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsList } from "./components/SettingsList";
import { SettingsPanel, SettingsPanelOptions } from "./components/SettingsPanel";

export class MissionSettingsUi extends SettingsPanel<MissionSettings> {
  private readonly _missions: Array<SettingListItem>;

  constructor(
    host: UserScript,
    settings: MissionSettings,
    options?: SettingsPanelOptions<SettingsPanel<MissionSettings>>
  ) {
    super(host, host.engine.i18n("ui.upgrade.missions"), settings, options);

    const items = [];
    for (const setting of Object.values(this.setting.missions)) {
      const label = this._host.engine.i18n(`$space.${setting.mission}.label`);
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

    this._missions = items.map(button => button.button);
  }
}
