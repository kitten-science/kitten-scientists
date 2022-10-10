import { EmbassySettings } from "../options/EmbassySettings";
import { SettingMax } from "../options/Settings";
import { objectEntries } from "../tools/Entries";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingMaxListItem } from "./components/SettingMaxListItem";
import { SettingsPanel } from "./components/SettingsPanel";
import { TriggerButton } from "./components/TriggerButton";

export class EmbassySettingsUi extends SettingsPanel {
  protected readonly _items: Array<SettingListItem>;
  private readonly _settings: EmbassySettings;

  constructor(host: UserScript, settings: EmbassySettings) {
    super(host, host.engine.i18n("option.embassies"), settings);

    this._settings = settings;

    this._list.addEventListener("enableAll", () => {
      this._items.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._items.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this._settings.load(new EmbassySettings());
      this.refreshUi();
    });

    this._items = [
      this._makeEmbassySetting(
        this._settings.items.lizards,
        this._host.engine.i18n(`$trade.race.lizards`)
      ),
      this._makeEmbassySetting(
        this._settings.items.sharks,
        this._host.engine.i18n(`$trade.race.sharks`)
      ),
      this._makeEmbassySetting(
        this._settings.items.griffins,
        this._host.engine.i18n(`$trade.race.griffins`)
      ),
      this._makeEmbassySetting(
        this._settings.items.nagas,
        this._host.engine.i18n(`$trade.race.nagas`)
      ),
      this._makeEmbassySetting(
        this._settings.items.zebras,
        this._host.engine.i18n(`$trade.race.zebras`)
      ),
      this._makeEmbassySetting(
        this._settings.items.spiders,
        this._host.engine.i18n(`$trade.race.spiders`)
      ),
      this._makeEmbassySetting(
        this._settings.items.dragons,
        this._host.engine.i18n(`$trade.race.dragons`)
      ),
      this._makeEmbassySetting(
        this._settings.items.leviathans,
        this._host.engine.i18n(`$trade.race.leviathans`)
      ),
    ];
    for (const item of this._items) {
      this.list.append(item.element);
    }

    const embassiesTrigger = new TriggerButton(
      this._host,
      this._host.engine.i18n("option.embassies"),
      this._settings
    );
    this.element.append(embassiesTrigger.element);
  }

  private _makeEmbassySetting(option: SettingMax, label: string) {
    return new SettingMaxListItem(this._host, label, option, {
      onCheck: () => this._host.engine.imessage("status.sub.enable", [label]),
      onUnCheck: () => this._host.engine.imessage("status.sub.disable", [label]),
    });
  }

  setState(state: EmbassySettings): void {
    this._settings.enabled = state.enabled;

    for (const [name, option] of objectEntries(this._settings.items)) {
      option.enabled = state.items[name].enabled;
      option.max = state.items[name].max;
    }
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).refreshUi();

    for (const [, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).refreshUi();
      mustExist(option.$max).refreshUi();
    }
  }
}
