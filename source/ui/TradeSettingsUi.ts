import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type {
  SettingBuySellThreshold,
  SettingOptions,
  SettingTrigger,
} from "../settings/Settings.js";
import type { TradeSettings, TradeSettingsItem } from "../settings/TradeSettings.js";
import { ucfirst } from "../tools/Format.js";
import { EmbassySettingsUi } from "./EmbassySettingsUi.js";
import type { PanelOptions } from "./components/CollapsiblePanel.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SeasonsList } from "./components/SeasonsList.js";
import { SettingLimitedTriggerListItem } from "./components/SettingLimitedTriggerListItem.js";
import { SettingListItem, type SettingListItemOptions } from "./components/SettingListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { BuyButton } from "./components/buttons-text/BuyButton.js";
import { SellButton } from "./components/buttons-text/SellButton.js";

export class TradeSettingsUi extends SettingsPanel<TradeSettings> {
  constructor(
    host: KittenScientists,
    settings: TradeSettings,
    locale: SettingOptions<SupportedLocale>,
    options?: Partial<PanelOptions & SettingListItemOptions>,
  ) {
    const label = host.engine.i18n("ui.trade");
    super(
      host,
      settings,
      new SettingTriggerListItem(host, settings, locale, label, {
        onCheck: (isBatchProcess?: boolean) => {
          host.engine.imessage("status.auto.enable", [label]);
          this.refreshUi();
          options?.onCheck?.(isBatchProcess);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          host.engine.imessage("status.auto.disable", [label]);
          this.refreshUi();
          options?.onUnCheck?.(isBatchProcess);
        },
        onRefresh: item => {
          (item as SettingTriggerListItem).triggerButton.inactive =
            !settings.enabled || settings.trigger === -1;
        },
        onRefreshTrigger: item => {
          item.triggerButton.element[0].title = host.engine.i18n("ui.trigger.section", [
            settings.trigger < 0
              ? host.engine.i18n("ui.trigger.section.inactive")
              : host.renderPercentage(settings.trigger, locale.selected, true),
          ]);
        },
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.prompt.percentage"),
            host.engine.i18n("ui.trigger.section.prompt", [
              label,
              settings.trigger !== -1
                ? host.renderPercentage(settings.trigger, locale.selected, true)
                : host.engine.i18n("ui.infinity"),
            ]),
            settings.trigger !== -1 ? host.renderPercentage(settings.trigger) : "",
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

              settings.trigger = host.parsePercentage(value);
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
            locale,
            settings,
            races.title,
            label,
            races.name === host.game.diplomacy.races.at(-2)?.name,
          ),
        ),
      hasDisableAll: false,
      hasEnableAll: false,
    });

    listRaces.addChild(
      new SettingListItem(host, this.setting.feedLeviathans, host.engine.i18n("option.autofeed"), {
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
                  host.renderAbsolute(this.setting.tradeBlackcoin.trigger, locale.selected),
                ]),
                host.renderAbsolute(this.setting.tradeBlackcoin.trigger),
                host.engine.i18n("ui.trigger.crypto.promptExplainer"),
              )
                .then(value => {
                  if (value === undefined || value === "" || value.startsWith("-")) {
                    return;
                  }

                  this.setting.tradeBlackcoin.trigger =
                    host.parseAbsolute(value) ?? this.setting.tradeBlackcoin.trigger;
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
            new BuyButton(host, this.setting.tradeBlackcoin, locale),
            new SellButton(host, this.setting.tradeBlackcoin, locale),
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

    listAddition.addChild(
      new EmbassySettingsUi(host, this.setting.buildEmbassies, locale, settings),
    );

    listAddition.addChild(
      new SettingListItem(host, this.setting.unlockRaces, host.engine.i18n("ui.upgrade.races"), {
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
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: SettingTrigger,
    label: string,
    sectionLabel: string,
    delimiter = false,
    upgradeIndicator = false,
  ) {
    const element = new SettingLimitedTriggerListItem(host, option, locale, label, {
      onCheck: () => {
        host.engine.imessage("status.sub.enable", [label]);
      },
      onUnCheck: () => {
        host.engine.imessage("status.sub.disable", [label]);
      },
      onLimitedCheck: () => {
        host.engine.imessage("trade.limited", [label]);
      },
      onLimitedUnCheck: () => {
        host.engine.imessage("trade.unlimited", [label]);
      },
      onRefresh: () => {
        element.limitedButton.inactive = !option.enabled || !option.limited;
        element.triggerButton.inactive = !option.enabled || option.trigger === -1;
        element.triggerButton.ineffective =
          sectionSetting.enabled &&
          option.enabled &&
          sectionSetting.trigger === -1 &&
          option.trigger === -1;

        panel.expando.ineffective =
          sectionSetting.enabled &&
          option.enabled &&
          !option.seasons.autumn.enabled &&
          !option.seasons.spring.enabled &&
          !option.seasons.summer.enabled &&
          !option.seasons.winter.enabled;
      },
      onRefreshTrigger: () => {
        element.triggerButton.element[0].title = host.engine.i18n("ui.trigger", [
          option.trigger < 0
            ? sectionSetting.trigger < 0
              ? host.engine.i18n("ui.trigger.section.blocked", [sectionLabel])
              : `${host.renderPercentage(sectionSetting.trigger, locale.selected, true)} (${host.engine.i18n("ui.trigger.section.inherited")})`
            : host.renderPercentage(option.trigger, locale.selected, true),
        ]);
      },
      onSetTrigger: () => {
        Dialog.prompt(
          host,
          host.engine.i18n("ui.trigger.prompt.percentage"),
          host.engine.i18n("ui.trigger.section.prompt", [
            label,
            option.trigger !== -1
              ? host.renderPercentage(option.trigger, locale.selected, true)
              : host.engine.i18n("ui.trigger.section.inherited"),
          ]),
          option.trigger !== -1 ? host.renderPercentage(option.trigger) : "",
          host.engine.i18n("ui.trigger.section.promptExplainer"),
        )
          .then(value => {
            if (value === undefined) {
              return;
            }

            if (value === "" || value.startsWith("-")) {
              option.trigger = -1;
              return;
            }

            option.trigger = host.parsePercentage(value);
          })
          .then(() => {
            element.refreshUi();
          })
          .catch(redirectErrorsToConsole(console));
      },
      delimiter,
      upgradeIndicator,
    });
    const panel = new SettingsPanel(host, option, element);

    const seasons = new SeasonsList(host, option.seasons, {
      onCheck: (label: string) => {
        host.engine.imessage("trade.season.enable", [ucfirst(label), label]);
        element.refreshUi();
      },
      onUnCheck: (label: string) => {
        host.engine.imessage("trade.season.disable", [ucfirst(label), label]);
        element.refreshUi();
      },
    });
    panel.addChild(seasons);

    return panel;
  }
}
