import { TradeSettings, TradeSettingsItem } from "../settings/TradeSettings.js";
import { ucfirst } from "../tools/Format.js";
import { Race } from "../types/index.js";
import { UserScript } from "../UserScript.js";
import { TriggerButton } from "./components/buttons-icon/TriggerButton.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SeasonsList } from "./components/SeasonsList.js";
import { SettingBuySellTriggerListItem } from "./components/SettingBuySellTriggerListItem.js";
import { SettingLimitedListItem } from "./components/SettingLimitedListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { UiComponent } from "./components/UiComponent.js";
import { EmbassySettingsUi } from "./EmbassySettingsUi.js";
import { SettingsSectionUi } from "./SettingsSectionUi.js";

export class TradeSettingsUi extends SettingsSectionUi<TradeSettings> {
  private readonly _trigger: TriggerButton;
  private readonly _races: Array<UiComponent>;
  private readonly _embassiesUi: EmbassySettingsUi;
  private readonly _feedLeviathans: SettingListItem;
  private readonly _tradeBlackcoin: SettingBuySellTriggerListItem;
  private readonly _unlockRaces: SettingListItem;

  constructor(host: UserScript, settings: TradeSettings) {
    const label = host.engine.i18n("ui.trade");
    super(host, label, settings);

    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertAfter(this._expando.element);
    this.children.add(this._trigger);

    const listRaces = new SettingsList(this._host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    this._races = [
      this._getTradeOption(
        "lizards",
        this.setting.races.lizards,
        this._host.engine.i18n("$trade.race.lizards"),
      ),
      this._getTradeOption(
        "sharks",
        this.setting.races.sharks,
        this._host.engine.i18n("$trade.race.sharks"),
      ),
      this._getTradeOption(
        "griffins",
        this.setting.races.griffins,
        this._host.engine.i18n("$trade.race.griffins"),
      ),
      this._getTradeOption(
        "nagas",
        this.setting.races.nagas,
        this._host.engine.i18n("$trade.race.nagas"),
      ),
      this._getTradeOption(
        "zebras",
        this.setting.races.zebras,
        this._host.engine.i18n("$trade.race.zebras"),
      ),
      this._getTradeOption(
        "spiders",
        this.setting.races.spiders,
        this._host.engine.i18n("$trade.race.spiders"),
      ),
      this._getTradeOption(
        "dragons",
        this.setting.races.dragons,
        this._host.engine.i18n("$trade.race.dragons"),
        true,
      ),
      this._getTradeOption(
        "leviathans",
        this.setting.races.leviathans,
        this._host.engine.i18n("$trade.race.leviathans"),
      ),
    ];
    listRaces.addChildren(this._races);

    this._feedLeviathans = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.autofeed"),
      this.setting.feedLeviathans,
      {
        onCheck: () =>
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.autofeed"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.autofeed"),
          ]),
      },
    );
    listRaces.addChild(this._feedLeviathans);

    this._tradeBlackcoin = new SettingBuySellTriggerListItem(
      this._host,
      this._host.engine.i18n("option.crypto"),
      this.setting.tradeBlackcoin,
      {
        behavior: "integer",
        delimiter: true,
        onCheck: () =>
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.crypto"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.crypto"),
          ]),
      },
    );
    listRaces.addChild(this._tradeBlackcoin);
    this.addChild(listRaces);

    const listAddition = new SettingsList(this._host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    listAddition.addChild(new HeaderListItem(this._host, "Additional options"));

    this._embassiesUi = new EmbassySettingsUi(this._host, this.setting.buildEmbassies);
    listAddition.addChild(this._embassiesUi);

    this._unlockRaces = new SettingListItem(
      this._host,
      this._host.engine.i18n("ui.upgrade.races"),
      this.setting.unlockRaces,
      {
        onCheck: () =>
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("ui.upgrade.races"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("ui.upgrade.races"),
          ]),
      },
    );
    listAddition.addChild(this._unlockRaces);
    this.addChild(listAddition);
  }

  private _getTradeOption(
    name: Race,
    option: TradeSettingsItem,
    i18nName: string,
    delimiter = false,
    upgradeIndicator = false,
  ) {
    const settingItem = new SettingLimitedListItem(this._host, i18nName, option, {
      onCheck: () => this._host.engine.imessage("status.sub.enable", [i18nName]),
      onUnCheck: () => this._host.engine.imessage("status.sub.disable", [i18nName]),
      onLimitedCheck: () => this._host.engine.imessage("trade.limited", [i18nName]),
      onLimitedUnCheck: () => this._host.engine.imessage("trade.unlimited", [i18nName]),
      delimiter,
      upgradeIndicator,
    });
    const panel = new SettingsPanel(this._host, i18nName, option, {
      settingItem,
    });

    const seasons = new SeasonsList(this._host, option.seasons, {
      onCheck: (label: string) =>
        this._host.engine.imessage("trade.season.enable", [ucfirst(name), label]),
      onUnCheck: (label: string) =>
        this._host.engine.imessage("trade.season.disable", [ucfirst(name), label]),
    });
    panel.addChild(seasons);

    return panel;
  }
}
