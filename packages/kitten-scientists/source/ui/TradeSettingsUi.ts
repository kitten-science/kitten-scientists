import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../KittenScientists.js";
import { TradeSettings, TradeSettingsItem } from "../settings/TradeSettings.js";
import { ucfirst } from "../tools/Format.js";
import { EmbassySettingsUi } from "./EmbassySettingsUi.js";
import { SettingsSectionUi } from "./SettingsSectionUi.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SeasonsList } from "./components/SeasonsList.js";
import { SettingBuySellTriggerListItem } from "./components/SettingBuySellTriggerListItem.js";
import { SettingLimitedListItem } from "./components/SettingLimitedListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { TriggerButton } from "./components/buttons-icon/TriggerButton.js";

export class TradeSettingsUi extends SettingsSectionUi<TradeSettings> {
  private readonly _trigger: TriggerButton;
  private readonly _embassiesUi: EmbassySettingsUi;
  private readonly _feedLeviathans: SettingListItem;
  private readonly _tradeBlackcoin: SettingBuySellTriggerListItem;
  private readonly _unlockRaces: SettingListItem;

  constructor(host: KittenScientists, settings: TradeSettings) {
    const label = host.engine.i18n("ui.trade");
    super(host, label, settings);

    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertAfter(this._expando.element);
    this.children.add(this._trigger);

    const listRaces = new SettingsList(this._host, {
      children: this._host.game.diplomacy.races
        .filter(item => !isNil(this.setting.races[item.name]))
        .map(races =>
          this._getTradeOption(
            this.setting.races[races.name],
            races.title,
            races.name === this._host.game.diplomacy.races.at(-2)?.name,
          ),
        ),
      hasDisableAll: false,
      hasEnableAll: false,
    });

    this._feedLeviathans = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.autofeed"),
      this.setting.feedLeviathans,
      {
        onCheck: () => {
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.autofeed"),
          ]);
        },
        onUnCheck: () => {
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.autofeed"),
          ]);
        },
      },
    );
    listRaces.addChild(this._feedLeviathans);

    this._tradeBlackcoin = new SettingBuySellTriggerListItem(
      this._host,
      this._host.engine.i18n("option.crypto"),
      this.setting.tradeBlackcoin,
      {
        delimiter: true,
        onCheck: () => {
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.crypto"),
          ]);
        },
        onUnCheck: () => {
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.crypto"),
          ]);
        },
      },
    );
    listRaces.addChild(this._tradeBlackcoin);
    this.addChild(listRaces);

    const listAddition = new SettingsList(this._host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    listAddition.addChild(new HeaderListItem(this._host, this._host.engine.i18n("ui.additional")));

    this._embassiesUi = new EmbassySettingsUi(this._host, this.setting.buildEmbassies);
    listAddition.addChild(this._embassiesUi);

    this._unlockRaces = new SettingListItem(
      this._host,
      this._host.engine.i18n("ui.upgrade.races"),
      this.setting.unlockRaces,
      {
        onCheck: () => {
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("ui.upgrade.races"),
          ]);
        },
        onUnCheck: () => {
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("ui.upgrade.races"),
          ]);
        },
      },
    );
    listAddition.addChild(this._unlockRaces);
    this.addChild(listAddition);
  }

  private _getTradeOption(
    option: TradeSettingsItem,
    i18nName: string,
    delimiter = false,
    upgradeIndicator = false,
  ) {
    const settingItem = new SettingLimitedListItem(this._host, i18nName, option, {
      onCheck: () => {
        this._host.engine.imessage("status.sub.enable", [i18nName]);
      },
      onUnCheck: () => {
        this._host.engine.imessage("status.sub.disable", [i18nName]);
      },
      onLimitedCheck: () => {
        this._host.engine.imessage("trade.limited", [i18nName]);
      },
      onLimitedUnCheck: () => {
        this._host.engine.imessage("trade.unlimited", [i18nName]);
      },
      delimiter,
      upgradeIndicator,
    });
    const panel = new SettingsPanel(this._host, i18nName, option, {
      settingItem,
    });

    const seasons = new SeasonsList(this._host, option.seasons, {
      onCheck: (label: string) => {
        this._host.engine.imessage("trade.season.enable", [ucfirst(i18nName), label]);
      },
      onUnCheck: (label: string) => {
        this._host.engine.imessage("trade.season.disable", [ucfirst(i18nName), label]);
      },
    });
    panel.addChild(seasons);

    return panel;
  }
}
