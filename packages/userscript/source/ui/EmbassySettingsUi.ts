import { EmbassySettings } from "../settings/EmbassySettings";
import { SettingMax } from "../settings/Settings";
import { UserScript } from "../UserScript";
import { TriggerButton } from "./components/buttons-icon/TriggerButton";
import { SettingListItem } from "./components/SettingListItem";
import { SettingMaxListItem } from "./components/SettingMaxListItem";
import { SettingsPanel } from "./components/SettingsPanel";

export class EmbassySettingsUi extends SettingsPanel<EmbassySettings> {
  private readonly _trigger: TriggerButton;
  private readonly _races: Array<SettingListItem>;

  constructor(host: UserScript, settings: EmbassySettings) {
    const label = host.engine.i18n("option.embassies");
    super(host, label, settings);

    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertBefore(this.list.element);
    this.children.add(this._trigger);

    this.list.addEventListener("enableAll", () => {
      this._races.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this.list.addEventListener("disableAll", () => {
      this._races.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this.list.addEventListener("reset", () => {
      this.setting.load(new EmbassySettings());
      this.refreshUi();
    });

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
    this.addChildren(this._races);
  }

  private _makeEmbassySetting(option: SettingMax, label: string) {
    return new SettingMaxListItem(this._host, label, option, {
      onCheck: () => this._host.engine.imessage("status.sub.enable", [label]),
      onUnCheck: () => this._host.engine.imessage("status.sub.disable", [label]),
    });
  }
}
