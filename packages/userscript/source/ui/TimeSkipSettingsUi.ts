import { TimeSkipSettings } from "../options/TimeSkipSettings";
import { UserScript } from "../UserScript";
import { CyclesList } from "./components/CyclesList";
import { Panel } from "./components/Panel";
import { SeasonsList } from "./components/SeasonsList";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsPanel } from "./components/SettingsPanel";

export class TimeSkipSettingsUi extends SettingsPanel<TimeSkipSettings> {
  private readonly _items: Array<SettingListItem>;
  private readonly _maximum: SettingListItem;
  private readonly _cycles: Panel<CyclesList>;
  private readonly _seasons: Panel<SeasonsList>;

  constructor(host: UserScript, settings: TimeSkipSettings) {
    super(host, host.engine.i18n("option.time.skip"), settings);

    this._list.addEventListener("enableAll", () => {
      this._items.forEach(item => (item.settings.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._items.forEach(item => (item.settings.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.settings.load(new TimeSkipSettings());
      this.refreshUi();
    });

    this._maximum = new SettingListItem(
      this._host,
      this._host.engine.i18n("ui.maximum"),
      this.settings,
      {
        onCheck: () =>
          this._host.engine.imessage("status.auto.enable", [this._host.engine.i18n("ui.maximum")]),
        onUnCheck: () =>
          this._host.engine.imessage("status.auto.disable", [this._host.engine.i18n("ui.maximum")]),
      }
    );
    this._cycles = new Panel(
      this._host,
      this._host.engine.i18n("ui.cycles"),
      new CyclesList(this._host, this.settings)
    );
    this._seasons = new Panel(
      this._host,
      this._host.engine.i18n("trade.seasons"),
      new SeasonsList(this._host, this.settings)
    );

    this._items = [this._maximum];

    this.addChildren([this._maximum, this._cycles, this._seasons]);
  }
}
