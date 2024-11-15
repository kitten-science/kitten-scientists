import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../KittenScientists.js";
import { SettingBuySellThreshold } from "../settings/Settings.js";
import { TradeSettings, TradeSettingsItem } from "../settings/TradeSettings.js";
import { ucfirst } from "../tools/Format.js";
import { BuyButton } from "./components/buttons-text/BuyButton.js";
import { SellButton } from "./components/buttons-text/SellButton.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SeasonsList } from "./components/SeasonsList.js";
import { SettingLimitedListItem } from "./components/SettingLimitedListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { EmbassySettingsUi } from "./EmbassySettingsUi.js";

export class TradeSettingsUi extends SettingsPanel<TradeSettings> {
  constructor(host: KittenScientists, settings: TradeSettings) {
    const label = host.engine.i18n("ui.trade");
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
    );

    const listRaces = new SettingsList(host, {
      children: host.game.diplomacy.races
        .filter(item => !isNil(this.setting.races[item.name]))
        .map(races =>
          this._getTradeOption(
            host,
            this.setting.races[races.name],
            races.title,
            races.name === host.game.diplomacy.races.at(-2)?.name,
          ),
        ),
      hasDisableAll: false,
      hasEnableAll: false,
    });

    listRaces.addChild(
      new SettingListItem(host, host.engine.i18n("option.autofeed"), this.setting.feedLeviathans, {
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [host.engine.i18n("option.autofeed")]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.sub.disable", [host.engine.i18n("option.autofeed")]);
        },
      }),
    );

    listRaces.addChild(
      new SettingsPanel<SettingBuySellThreshold>(
        host,
        this.setting.tradeBlackcoin,
        new SettingTriggerListItem(
          host,
          host.engine.i18n("option.crypto"),
          this.setting.tradeBlackcoin,
          {
            onCheck: () => {
              host.engine.imessage("status.sub.enable", [host.engine.i18n("option.crypto")]);
            },
            onUnCheck: () => {
              host.engine.imessage("status.sub.disable", [host.engine.i18n("option.crypto")]);
            },
          },
        ),
        {
          children: [
            new BuyButton(host, this.setting.tradeBlackcoin),
            new SellButton(host, this.setting.tradeBlackcoin),
          ],
        },
      ),
    );
    this.addChild(listRaces);

    const listAddition = new SettingsList(host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    listAddition.addChild(new HeaderListItem(host, host.engine.i18n("ui.additional")));

    listAddition.addChild(new EmbassySettingsUi(host, this.setting.buildEmbassies));

    listAddition.addChild(
      new SettingListItem(host, host.engine.i18n("ui.upgrade.races"), this.setting.unlockRaces, {
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [host.engine.i18n("ui.upgrade.races")]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.sub.disable", [host.engine.i18n("ui.upgrade.races")]);
        },
      }),
    );
    this.addChild(listAddition);
  }

  private _getTradeOption(
    host: KittenScientists,
    option: TradeSettingsItem,
    i18nName: string,
    delimiter = false,
    upgradeIndicator = false,
  ) {
    const settingItem = new SettingLimitedListItem(host, i18nName, option, {
      onCheck: () => {
        host.engine.imessage("status.sub.enable", [i18nName]);
      },
      onUnCheck: () => {
        host.engine.imessage("status.sub.disable", [i18nName]);
      },
      onLimitedCheck: () => {
        host.engine.imessage("trade.limited", [i18nName]);
      },
      onLimitedUnCheck: () => {
        host.engine.imessage("trade.unlimited", [i18nName]);
      },
      delimiter,
      upgradeIndicator,
    });
    const panel = new SettingsPanel(host, option, settingItem);

    const seasons = new SeasonsList(host, option.seasons, {
      onCheck: (label: string) => {
        host.engine.imessage("trade.season.enable", [ucfirst(i18nName), label]);
      },
      onUnCheck: (label: string) => {
        host.engine.imessage("trade.season.disable", [ucfirst(i18nName), label]);
      },
    });
    panel.addChild(seasons);

    return panel;
  }
}
