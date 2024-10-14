import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../KittenScientists.js";
import { EmbassySettings } from "../settings/EmbassySettings.js";
import { SettingMax } from "../settings/Settings.js";
import { PanelOptions } from "./components/CollapsiblePanel.js";
import { SettingMaxListItem } from "./components/SettingMaxListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";

export class EmbassySettingsUi extends SettingsPanel<EmbassySettings> {
  constructor(host: KittenScientists, settings: EmbassySettings, options?: PanelOptions) {
    const label = host.engine.i18n("option.embassies");
    super(
      host,
      settings,
      new SettingTriggerListItem(host, label, settings, {
        onCheck: () => {
          host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.auto.disable", [label]);
        },
      }),
      options,
    );

    const listRaces = new SettingsList(this._host, {
      children: this._host.game.diplomacy.races
        .filter(item => !isNil(this.setting.races[item.name]))
        .map(races => this._makeEmbassySetting(this.setting.races[races.name], races.title)),
    });
    this.addChild(listRaces);
  }

  private _makeEmbassySetting(option: SettingMax, label: string) {
    return new SettingMaxListItem(this._host, label, option, {
      onCheck: () => {
        this._host.engine.imessage("status.sub.enable", [label]);
      },
      onUnCheck: () => {
        this._host.engine.imessage("status.sub.disable", [label]);
      },
    });
  }
}
