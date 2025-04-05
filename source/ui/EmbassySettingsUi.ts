import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { EmbassySettings } from "../settings/EmbassySettings.js";
import type { SettingMax, SettingOptions } from "../settings/Settings.js";
import type { TradeSettings } from "../settings/TradeSettings.js";
import stylesButton from "./components/Button.module.css";
import { Dialog } from "./components/Dialog.js";
import type { SettingListItemOptions } from "./components/SettingListItem.js";
import { SettingMaxListItem } from "./components/SettingMaxListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, type SettingsPanelOptions } from "./components/SettingsPanel.js";

export class EmbassySettingsUi extends SettingsPanel<EmbassySettings, SettingTriggerListItem> {
  constructor(
    host: KittenScientists,
    settings: EmbassySettings,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: TradeSettings,
    options?: SettingsPanelOptions<SettingTriggerListItem> & SettingListItemOptions,
  ) {
    const label = host.engine.i18n("option.embassies");
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
        onRefresh: () => {
          this.settingItem.triggerButton.inactive = !settings.enabled || settings.trigger === -1;

          this.expando.ineffective =
            sectionSetting.enabled &&
            settings.enabled &&
            !Object.values(settings.races).some(race => race.enabled);
        },
        onSetTrigger: async () => {
          const value = await Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.embassies.prompt"),
            host.engine.i18n("ui.trigger.embassies.promptTitle", [
              host.renderPercentage(settings.trigger, locale.selected, true),
            ]),
            host.renderPercentage(settings.trigger),
            host.engine.i18n("ui.trigger.embassies.promptExplainer"),
          );

          if (value === undefined || value === "" || value.startsWith("-")) {
            return;
          }

          settings.trigger = host.parsePercentage(value);
        },
      }),
      options,
    );

    const listRaces = new SettingsList(host, {
      children: host.game.diplomacy.races
        .filter(item => item.name !== "leviathans" && !isNil(this.setting.races[item.name]))
        .map(race =>
          this._makeEmbassySetting(
            host,
            this.setting.races[race.name],
            locale.selected,
            settings,
            race.title,
          ),
        ),
    });
    this.addChild(listRaces);
  }

  private _makeEmbassySetting(
    host: KittenScientists,
    option: SettingMax,
    locale: SupportedLocale,
    sectionSetting: EmbassySettings,
    label: string,
  ) {
    const onSetMax = async () => {
      const value = await Dialog.prompt(
        host,
        host.engine.i18n("ui.max.prompt.absolute"),
        host.engine.i18n("ui.max.build.prompt", [label, host.renderAbsolute(option.max, locale)]),
        host.renderAbsolute(option.max),
        host.engine.i18n("ui.max.build.promptExplainer"),
      );

      if (value === undefined) {
        return;
      }

      if (value === "" || value.startsWith("-")) {
        option.max = -1;
        return;
      }

      if (value === "0") {
        option.enabled = false;
      }

      option.max = host.parseAbsolute(value) ?? option.max;
    };

    const element = new SettingMaxListItem(host, option, label, {
      onCheck: (isBatchProcess?: boolean) => {
        host.engine.imessage("status.sub.enable", [label]);
        if (option.max === 0 && !isBatchProcess) {
          onSetMax();
        }
      },
      onUnCheck: () => {
        host.engine.imessage("status.sub.disable", [label]);
      },
      onRefresh: () => {
        element.maxButton.inactive = !option.enabled || option.max === -1;
        element.maxButton.ineffective =
          sectionSetting.enabled && option.enabled && option.max === 0;
      },
      onRefreshMax: () => {
        element.maxButton.updateLabel(host.renderAbsolute(option.max));
        element.maxButton.element[0].title =
          option.max < 0
            ? host.engine.i18n("ui.max.embassy.titleInfinite", [label])
            : option.max === 0
              ? host.engine.i18n("ui.max.embassy.titleZero", [label])
              : host.engine.i18n("ui.max.embassy.title", [host.renderAbsolute(option.max), label]);
      },
      onSetMax,
    });
    element.maxButton.element.addClass(stylesButton.lastHeadAction);
    return element;
  }
}
