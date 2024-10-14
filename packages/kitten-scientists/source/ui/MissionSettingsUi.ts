import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../KittenScientists.js";
import { MissionSettings } from "../settings/MissionSettings.js";
import { PanelOptions } from "./components/CollapsiblePanel.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

export class MissionSettingsUi extends SettingsPanel<MissionSettings> {
  private readonly _missions: Array<SettingListItem>;

  constructor(host: KittenScientists, settings: MissionSettings, options?: PanelOptions) {
    const label = host.engine.i18n("ui.upgrade.missions");
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

    // Missions should be sorted by KG. For example, when going to the sun just choose the top five Checkbox instead of looking through the list
    this._missions = this._host.game.space.programs
      .filter(item => !isNil(this.setting.missions[item.name]))
      .map(
        mission =>
          new SettingListItem(this._host, mission.label, this.setting.missions[mission.name], {
            onCheck: () => {
              this._host.engine.imessage("status.sub.enable", [mission.label]);
            },
            onUnCheck: () => {
              this._host.engine.imessage("status.sub.disable", [mission.label]);
            },
          }),
      );

    const itemsList = new SettingsList(this._host, { children: this._missions });
    this.addChild(itemsList);
  }
}
