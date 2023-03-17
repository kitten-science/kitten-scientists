import { EmbassySettings } from "../settings/EmbassySettings";
import { SettingMax } from "../settings/Settings";
import { UserScript } from "../UserScript";
import { TriggerButton } from "./components/buttons-icon/TriggerButton";
import { SettingListItem } from "./components/SettingListItem";
import { SettingMaxListItem } from "./components/SettingMaxListItem";
import { SettingsList } from "./components/SettingsList";
import { SettingsPanel, SettingsPanelOptions } from "./components/SettingsPanel";

export class EmbassySettingsUi extends SettingsPanel<EmbassySettings> {
  private readonly _trigger: TriggerButton;
  private readonly _races: Array<SettingListItem>;

  constructor(
    host: UserScript,
    settings: EmbassySettings,
    options?: SettingsPanelOptions<SettingsPanel<EmbassySettings>>
  ) {
    const label = host.engine.i18n("option.embassies");
    super(host, label, settings, options);

    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertAfter(this._expando.element);
    this.children.add(this._trigger);

    const listRaces = new SettingsList(this._host);
    this._races = [
      this._makeEmbassySetting(
        this.setting.races.lizards,
        this._host.engine.i18n(`$trade.race.lizards`)
      ),
      this._makeEmbassySetting(
        this.setting.races.sharks,
        this._host.engine.i18n(`$trade.race.sharks`)
      ),
      this._makeEmbassySetting(
        this.setting.races.griffins,
        this._host.engine.i18n(`$trade.race.griffins`)
      ),
      this._makeEmbassySetting(
        this.setting.races.nagas,
        this._host.engine.i18n(`$trade.race.nagas`)
      ),
      this._makeEmbassySetting(
        this.setting.races.zebras,
        this._host.engine.i18n(`$trade.race.zebras`)
      ),
      this._makeEmbassySetting(
        this.setting.races.spiders,
        this._host.engine.i18n(`$trade.race.spiders`)
      ),
      this._makeEmbassySetting(
        this.setting.races.dragons,
        this._host.engine.i18n(`$trade.race.dragons`)
      ),
      this._makeEmbassySetting(
        this.setting.races.leviathans,
        this._host.engine.i18n(`$trade.race.leviathans`)
      ),
    ];
    listRaces.addChildren(this._races);
    this.addChild(listRaces);
  }

  private _makeEmbassySetting(option: SettingMax, label: string) {
    return new SettingMaxListItem(this._host, label, option, {
      onCheck: () => this._host.engine.imessage("status.sub.enable", [label]),
      onUnCheck: () => this._host.engine.imessage("status.sub.disable", [label]),
    });
  }
}
