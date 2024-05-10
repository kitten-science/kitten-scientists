import { isNil } from "@oliversalzburg/js-utils/nil.js";
import { UserScript } from "../UserScript.js";
import { MissionSettings } from "../settings/MissionSettings.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, SettingsPanelOptions } from "./components/SettingsPanel.js";

export class MissionSettingsUi extends SettingsPanel<MissionSettings> {
  private readonly _missions: Array<SettingListItem>;

  constructor(
    host: UserScript,
    settings: MissionSettings,
    options?: SettingsPanelOptions<SettingsPanel<MissionSettings>>,
  ) {
    super(host, host.engine.i18n("ui.upgrade.missions"), settings, options);

    // Missions should be sorted by KG. For example, when going to the sun just choose the top five Checkbox instead of looking through the list
    this._missions = this._host.game.space.programs
      .filter(item => !isNil(this.setting.missions[item.name]))
      .map(
        mission =>
          new SettingListItem(this._host, mission.label, this.setting.missions[mission.name], {
            onCheck: () => this._host.engine.imessage("status.sub.enable", [mission.label]),
            onUnCheck: () => this._host.engine.imessage("status.sub.disable", [mission.label]),
          }),
      );

    const itemsList = new SettingsList(this._host, { children: this._missions });
    this.addChild(itemsList);
  }
}
