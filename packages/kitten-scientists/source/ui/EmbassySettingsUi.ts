import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { UserScript } from "../UserScript.js";
import { EmbassySettings } from "../settings/EmbassySettings.js";
import { SettingMax } from "../settings/Settings.js";
import { SettingMaxListItem } from "./components/SettingMaxListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, SettingsPanelOptions } from "./components/SettingsPanel.js";
import { TriggerButton } from "./components/buttons-icon/TriggerButton.js";

export class EmbassySettingsUi extends SettingsPanel<EmbassySettings> {
  private readonly _trigger: TriggerButton;

  constructor(
    host: UserScript,
    settings: EmbassySettings,
    options?: SettingsPanelOptions<SettingsPanel<EmbassySettings>>,
  ) {
    const label = host.engine.i18n("option.embassies");
    super(host, label, settings, options);

    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertAfter(this._expando.element);
    this.children.add(this._trigger);

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
