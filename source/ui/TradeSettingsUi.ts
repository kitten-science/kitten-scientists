import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import type {
  SettingBuySellThreshold,
  SettingOptions,
  SettingTrigger,
} from "../settings/Settings.js";
import type { TradeSettings, TradeSettingsItem } from "../settings/TradeSettings.js";
import { ucfirst } from "../tools/Format.js";
import { EmbassySettingsUi } from "./EmbassySettingsUi.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SeasonsList } from "./components/SeasonsList.js";
import { SettingLimitedTriggerListItem } from "./components/SettingLimitedTriggerListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";
import { BuyButton } from "./components/buttons-text/BuyButton.js";
import { SellButton } from "./components/buttons-text/SellButton.js";

export class TradeSettingsUi extends SettingsPanel<TradeSettings, SettingTriggerListItem> {
  constructor(
    parent: UiComponent,
    settings: TradeSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = parent.host.engine.i18n("ui.trade");
    super(
      parent,
      settings,
      new SettingTriggerListItem(parent, settings, locale, label, {
        onCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.disable", [label]);
        },
        onRefresh: () => {
          this.settingItem.triggerButton.inactive = !settings.enabled || settings.trigger === -1;
        },
        onRefreshTrigger() {
          this.triggerButton.element[0].title = parent.host.engine.i18n("ui.trigger.section", [
            settings.trigger < 0
              ? parent.host.engine.i18n("ui.trigger.section.inactive")
              : parent.host.renderPercentage(settings.trigger, locale.selected, true),
          ]);
        },
        onSetTrigger: async () => {
          const value = await Dialog.prompt(
            parent,
            parent.host.engine.i18n("ui.trigger.prompt.percentage"),
            parent.host.engine.i18n("ui.trigger.section.prompt", [
              label,
              settings.trigger !== -1
                ? parent.host.renderPercentage(settings.trigger, locale.selected, true)
                : parent.host.engine.i18n("ui.infinity"),
            ]),
            settings.trigger !== -1 ? parent.host.renderPercentage(settings.trigger) : "",
            parent.host.engine.i18n("ui.trigger.section.promptExplainer"),
          );

          if (value === undefined) {
            return;
          }

          if (value === "" || value.startsWith("-")) {
            settings.trigger = -1;
            return;
          }

          settings.trigger = parent.host.parsePercentage(value);
        },
      }),
    );

    const listRaces = new SettingsList(this, {
      hasDisableAll: false,
      hasEnableAll: false,
    }).addChildren(
      this.host.game.diplomacy.races
        .filter(item => !isNil(this.setting.races[item.name]))
        .map(races =>
          this._getTradeOption(
            this,
            this.setting.races[races.name],
            locale,
            settings,
            races.title,
            label,
            races.name === this.host.game.diplomacy.races.at(-2)?.name,
          ),
        ),
    );

    listRaces.addChild(
      new SettingListItem(
        this,
        this.setting.feedLeviathans,
        this.host.engine.i18n("option.autofeed"),
        {
          onCheck: () => {
            this.host.engine.imessage("status.sub.enable", [
              this.host.engine.i18n("option.autofeed"),
            ]);
          },
          onUnCheck: () => {
            this.host.engine.imessage("status.sub.disable", [
              this.host.engine.i18n("option.autofeed"),
            ]);
          },
        },
      ),
    );

    listRaces.addChild(
      new SettingsPanel<SettingBuySellThreshold>(
        this,
        this.setting.tradeBlackcoin,
        new SettingTriggerListItem(
          this,
          this.setting.tradeBlackcoin,
          locale,
          this.host.engine.i18n("option.crypto"),
          {
            onCheck: () => {
              this.host.engine.imessage("status.sub.enable", [
                this.host.engine.i18n("option.crypto"),
              ]);
            },
            onUnCheck: () => {
              this.host.engine.imessage("status.sub.disable", [
                this.host.engine.i18n("option.crypto"),
              ]);
            },
            onRefresh: () => {
              this.settingItem.triggerButton.inactive =
                !this.setting.tradeBlackcoin.enabled || this.setting.tradeBlackcoin.trigger === -1;
            },
            onSetTrigger: async () => {
              const value = await Dialog.prompt(
                this,
                this.host.engine.i18n("ui.trigger.crypto.promptTitle"),
                this.host.engine.i18n("ui.trigger.crypto.prompt", [
                  this.host.renderAbsolute(this.setting.tradeBlackcoin.trigger, locale.selected),
                ]),
                this.host.renderAbsolute(this.setting.tradeBlackcoin.trigger),
                this.host.engine.i18n("ui.trigger.crypto.promptExplainer"),
              );

              if (value === undefined || value === "" || value.startsWith("-")) {
                return;
              }

              this.setting.tradeBlackcoin.trigger =
                this.host.parseAbsolute(value) ?? this.setting.tradeBlackcoin.trigger;
            },
          },
        ),
      ).addChildren([
        new BuyButton(this, this.setting.tradeBlackcoin, locale),
        new SellButton(this, this.setting.tradeBlackcoin, locale),
      ]),
    );
    this.addChild(listRaces);

    const listAddition = new SettingsList(this, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    listAddition.addChild(new HeaderListItem(this, this.host.engine.i18n("ui.additional")));

    listAddition.addChild(
      new EmbassySettingsUi(this, this.setting.buildEmbassies, locale, settings),
    );

    listAddition.addChild(
      new SettingListItem(
        this,
        this.setting.unlockRaces,
        this.host.engine.i18n("ui.upgrade.races"),
        {
          onCheck: () => {
            this.host.engine.imessage("status.sub.enable", [
              this.host.engine.i18n("ui.upgrade.races"),
            ]);
          },
          onUnCheck: () => {
            this.host.engine.imessage("status.sub.disable", [
              this.host.engine.i18n("ui.upgrade.races"),
            ]);
          },
        },
      ),
    );
    this.addChild(listAddition);
  }

  private _getTradeOption(
    parent: UiComponent,
    option: TradeSettingsItem,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: SettingTrigger,
    label: string,
    sectionLabel: string,
    delimiter = false,
    upgradeIndicator = false,
  ) {
    const element = new SettingLimitedTriggerListItem(parent, option, locale, label, {
      onCheck: () => {
        parent.host.engine.imessage("status.sub.enable", [label]);
      },
      onUnCheck: () => {
        parent.host.engine.imessage("status.sub.disable", [label]);
      },
      onLimitedCheck: () => {
        parent.host.engine.imessage("trade.limited", [label]);
      },
      onLimitedUnCheck: () => {
        parent.host.engine.imessage("trade.unlimited", [label]);
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
        element.triggerButton.element[0].title = parent.host.engine.i18n("ui.trigger", [
          option.trigger < 0
            ? sectionSetting.trigger < 0
              ? parent.host.engine.i18n("ui.trigger.section.blocked", [sectionLabel])
              : `${parent.host.renderPercentage(sectionSetting.trigger, locale.selected, true)} (${parent.host.engine.i18n("ui.trigger.section.inherited")})`
            : parent.host.renderPercentage(option.trigger, locale.selected, true),
        ]);
      },
      onSetTrigger: async () => {
        const value = await Dialog.prompt(
          parent,
          parent.host.engine.i18n("ui.trigger.prompt.percentage"),
          parent.host.engine.i18n("ui.trigger.section.prompt", [
            label,
            option.trigger !== -1
              ? parent.host.renderPercentage(option.trigger, locale.selected, true)
              : parent.host.engine.i18n("ui.trigger.section.inherited"),
          ]),
          option.trigger !== -1 ? parent.host.renderPercentage(option.trigger) : "",
          parent.host.engine.i18n("ui.trigger.section.promptExplainer"),
        );

        if (value === undefined) {
          return;
        }

        if (value === "" || value.startsWith("-")) {
          option.trigger = -1;
          return;
        }

        option.trigger = parent.host.parsePercentage(value);
      },
      delimiter,
      upgradeIndicator,
    });
    const panel = new SettingsPanel(parent, option, element);

    const seasons = new SeasonsList(parent, option.seasons, {
      onCheckSeason: (label: string) => {
        parent.host.engine.imessage("trade.season.enable", [ucfirst(label), label]);
        element.refreshUi();
      },
      onUnCheckSeason: (label: string) => {
        parent.host.engine.imessage("trade.season.disable", [ucfirst(label), label]);
        element.refreshUi();
      },
    });
    panel.addChild(seasons);

    return panel;
  }
}
