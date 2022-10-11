import { EmbassySettings } from "../options/EmbassySettings";
import { SettingMax } from "../options/Settings";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingMaxListItem } from "./components/SettingMaxListItem";
import { SettingsPanel } from "./components/SettingsPanel";
import { TriggerButton } from "./components/TriggerButton";

export class EmbassySettingsUi extends SettingsPanel<EmbassySettings> {
  private readonly _races: Array<SettingListItem>;
  private readonly _embassiesTrigger: TriggerButton;

  constructor(host: UserScript, settings: EmbassySettings) {
    super(host, host.engine.i18n("option.embassies"), settings);

    this._list.addEventListener("enableAll", () => {
      this._races.forEach(item => (item.settings.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._races.forEach(item => (item.settings.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.settings.load(new EmbassySettings());
      this.refreshUi();
    });

    this._races = [
      this._makeEmbassySetting(
        this.settings.items.lizards,
        this._host.engine.i18n(`$trade.race.lizards`)
      ),
      this._makeEmbassySetting(
        this.settings.items.sharks,
        this._host.engine.i18n(`$trade.race.sharks`)
      ),
      this._makeEmbassySetting(
        this.settings.items.griffins,
        this._host.engine.i18n(`$trade.race.griffins`)
      ),
      this._makeEmbassySetting(
        this.settings.items.nagas,
        this._host.engine.i18n(`$trade.race.nagas`)
      ),
      this._makeEmbassySetting(
        this.settings.items.zebras,
        this._host.engine.i18n(`$trade.race.zebras`)
      ),
      this._makeEmbassySetting(
        this.settings.items.spiders,
        this._host.engine.i18n(`$trade.race.spiders`)
      ),
      this._makeEmbassySetting(
        this.settings.items.dragons,
        this._host.engine.i18n(`$trade.race.dragons`)
      ),
      this._makeEmbassySetting(
        this.settings.items.leviathans,
        this._host.engine.i18n(`$trade.race.leviathans`)
      ),
    ];
    this.addChildren(this._races);

    this._embassiesTrigger = new TriggerButton(
      this._host,
      this._host.engine.i18n("option.embassies"),
      this.settings
    );
    this.addChild(this._embassiesTrigger);
  }

  private _makeEmbassySetting(option: SettingMax, label: string) {
    return new SettingMaxListItem(this._host, label, option, {
      onCheck: () => this._host.engine.imessage("status.sub.enable", [label]),
      onUnCheck: () => this._host.engine.imessage("status.sub.disable", [label]),
    });
  }
}
