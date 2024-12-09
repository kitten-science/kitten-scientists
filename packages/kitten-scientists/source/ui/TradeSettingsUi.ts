import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { SupportedLocale } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { SettingBuySellThreshold, SettingOptions } from "../settings/Settings.js";
import { TradeSettings, TradeSettingsItem } from "../settings/TradeSettings.js";
import { ucfirst } from "../tools/Format.js";
import { BuyButton } from "./components/buttons-text/BuyButton.js";
import { SellButton } from "./components/buttons-text/SellButton.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SeasonsList } from "./components/SeasonsList.js";
import { SettingLimitedListItem } from "./components/SettingLimitedListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { UiComponent } from "./components/UiComponent.js";
import { EmbassySettingsUi } from "./EmbassySettingsUi.js";

export class TradeSettingsUi extends SettingsPanel<TradeSettings> {
  constructor(
    host: KittenScientists,
    settings: TradeSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = host.engine.i18n("ui.trade");
    super(
      host,
      settings,
      new SettingTriggerListItem(host, settings, locale, label, {
        onCheck: () => {
          host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.auto.disable", [label]);
        },
        onRefresh: item => {
          (item as SettingTriggerListItem).triggerButton.inactive =
            !settings.enabled || settings.trigger === -1;
        },
        onRefreshTrigger: item => {
          item.triggerButton.element[0].title = host.engine.i18n("ui.trigger.section", [
            settings.trigger < 0
              ? host.engine.i18n("ui.trigger.section.inactive")
              : UiComponent.renderPercentage(settings.trigger, locale.selected, true),
          ]);
        },
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.prompt.percentage"),
            host.engine.i18n("ui.trigger.section.prompt", [
              label,
              settings.trigger !== -1
                ? UiComponent.renderPercentage(settings.trigger, locale.selected, true)
                : host.engine.i18n("ui.infinity"),
            ]),
            settings.trigger !== -1 ? UiComponent.renderPercentage(settings.trigger) : "",
            host.engine.i18n("ui.trigger.section.promptExplainer"),
          )
            .then(value => {
              if (value === undefined) {
                return;
              }

              if (value === "" || value.startsWith("-")) {
                settings.trigger = -1;
                return;
              }

              settings.trigger = UiComponent.parsePercentage(value);
            })
            .then(() => {
              this.refreshUi();
            })
            .catch(redirectErrorsToConsole(console));
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
          this.setting.tradeBlackcoin,
          locale,
          host.engine.i18n("option.crypto"),
          {
            onCheck: () => {
              host.engine.imessage("status.sub.enable", [host.engine.i18n("option.crypto")]);
            },
            onUnCheck: () => {
              host.engine.imessage("status.sub.disable", [host.engine.i18n("option.crypto")]);
            },
            onRefresh: item => {
              (item as SettingTriggerListItem).triggerButton.inactive =
                !this.setting.tradeBlackcoin.enabled || this.setting.tradeBlackcoin.trigger === -1;
            },
            onSetTrigger: () => {
              Dialog.prompt(
                host,
                host.engine.i18n("ui.trigger.crypto.promptTitle"),
                host.engine.i18n("ui.trigger.crypto.prompt", [
                  UiComponent.renderAbsolute(this.setting.tradeBlackcoin.trigger, host),
                ]),
                UiComponent.renderAbsolute(this.setting.tradeBlackcoin.trigger, host),
                host.engine.i18n("ui.trigger.crypto.promptExplainer"),
              )
                .then(value => {
                  if (value === undefined || value === "" || value.startsWith("-")) {
                    return;
                  }

                  this.setting.tradeBlackcoin.trigger =
                    UiComponent.parseAbsolute(value) ?? this.setting.tradeBlackcoin.trigger;
                })
                .then(() => {
                  this.refreshUi();
                })
                .catch(redirectErrorsToConsole(console));
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

    listAddition.addChild(new EmbassySettingsUi(host, this.setting.buildEmbassies, locale));

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
    const element = new SettingLimitedListItem(host, i18nName, option, {
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
      onRefresh: () => {
        element.limitedButton.inactive = !option.enabled || !option.limited;
      },
      delimiter,
      upgradeIndicator,
    });
    const panel = new SettingsPanel(host, option, element);

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
