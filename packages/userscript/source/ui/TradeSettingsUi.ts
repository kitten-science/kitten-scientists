import { TradeSettings, TradeSettingsItem } from "../settings/TradeSettings";
import { Race } from "../types";
import { UserScript } from "../UserScript";
import { HeaderListItem } from "./components/HeaderListItem";
import { SeasonsButton } from "./components/SeasonsButton";
import { SeasonsList } from "./components/SeasonsList";
import { SettingLimitedListItem } from "./components/SettingLimitedListItem";
import { SettingListItem } from "./components/SettingListItem";
import { TriggerButton } from "./components/TriggerButton";
import { EmbassySettingsUi } from "./EmbassySettingsUi";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class TradeSettingsUi extends SettingsSectionUi<TradeSettings> {
  private readonly _trigger: TriggerButton;
  private readonly _races: Array<SettingListItem>;
  private readonly _embassiesUi: EmbassySettingsUi;
  private readonly _unlockRaces: SettingListItem;

  constructor(host: UserScript, settings: TradeSettings) {
    const label = host.engine.i18n("ui.trade");
    super(host, label, settings);

    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertBefore(this.list);
    this.children.add(this._trigger);

    this._list.addEventListener("enableAll", () => {
      this._races.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._races.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.setting.load(new TradeSettings());
      this.refreshUi();
    });

    this._races = [
      this._getTradeOption(
        "lizards",
        this.setting.items.lizards,
        this._host.engine.i18n("$trade.race.lizards")
      ),
      this._getTradeOption(
        "sharks",
        this.setting.items.sharks,
        this._host.engine.i18n("$trade.race.sharks")
      ),
      this._getTradeOption(
        "griffins",
        this.setting.items.griffins,
        this._host.engine.i18n("$trade.race.griffins")
      ),
      this._getTradeOption(
        "nagas",
        this.setting.items.nagas,
        this._host.engine.i18n("$trade.race.nagas")
      ),
      this._getTradeOption(
        "zebras",
        this.setting.items.zebras,
        this._host.engine.i18n("$trade.race.zebras")
      ),
      this._getTradeOption(
        "spiders",
        this.setting.items.spiders,
        this._host.engine.i18n("$trade.race.spiders")
      ),
      this._getTradeOption(
        "dragons",
        this.setting.items.dragons,
        this._host.engine.i18n("$trade.race.dragons")
      ),
      this._getTradeOption(
        "leviathans",
        this.setting.items.leviathans,
        this._host.engine.i18n("$trade.race.leviathans"),
        true
      ),
    ];
    this.addChildren(this._races);

    this.addChild(new HeaderListItem(this._host, "Additional options"));

    this._embassiesUi = new EmbassySettingsUi(this._host, this.setting.buildEmbassies);
    this.addChild(this._embassiesUi);

    this._unlockRaces = new SettingListItem(
      this._host,
      this._host.engine.i18n("ui.upgrade.races"),
      this.setting.unlockRaces,
      {
        onCheck: () =>
          this._host.engine.imessage("status.auto.enable", [
            this._host.engine.i18n("ui.upgrade.races"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.auto.disable", [
            this._host.engine.i18n("ui.upgrade.races"),
          ]),
      }
    );
    this.addChild(this._unlockRaces);
  }

  private _getTradeOption(
    name: Race,
    option: TradeSettingsItem,
    i18nName: string,
    delimiter = false,
    upgradeIndicator = false
  ) {
    const element = new SettingLimitedListItem(
      this._host,
      i18nName,
      option,
      {
        onCheck: () => this._host.engine.imessage("status.sub.enable", [i18nName]),
        onUnCheck: () => this._host.engine.imessage("status.sub.disable", [i18nName]),
        onLimitedCheck: () => this._host.engine.imessage("trade.limited", [i18nName]),
        onLimitedUnCheck: () => this._host.engine.imessage("trade.unlimited", [i18nName]),
      },
      delimiter,
      upgradeIndicator
    );

    const seasonsButton = new SeasonsButton(this._host);
    element.addChild(seasonsButton);

    const seasons = new SeasonsList(this._host, option, {
      onCheck: (label: string) => this._host.engine.imessage("trade.season.enable", [label]),
      onUnCheck: (label: string) => this._host.engine.imessage("trade.season.disable", [label]),
    });
    element.addChild(seasons);

    seasonsButton.element.on("click", function () {
      seasons.element.toggle();
    });

    return element;
  }
}
