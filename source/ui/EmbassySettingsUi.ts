import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import type { EmbassySettings } from "../settings/EmbassySettings.js";
import type { SettingMax, SettingOptions } from "../settings/Settings.js";
import type { TradeSettings } from "../settings/TradeSettings.js";
import stylesButton from "./components/Button.module.css";
import { Dialog } from "./components/Dialog.js";
import { SettingMaxListItem } from "./components/SettingMaxListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";

export class EmbassySettingsUi extends SettingsPanel<EmbassySettings, SettingTriggerListItem> {
  constructor(
    parent: UiComponent,
    settings: EmbassySettings,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: TradeSettings,
  ) {
    const label = parent.host.engine.i18n("option.embassies");
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

          this.expando.ineffective =
            sectionSetting.enabled &&
            settings.enabled &&
            !Object.values(settings.races).some(race => race.enabled);
        },
        onSetTrigger: async () => {
          const value = await Dialog.prompt(
            parent,
            parent.host.engine.i18n("ui.trigger.embassies.prompt"),
            parent.host.engine.i18n("ui.trigger.embassies.promptTitle", [
              parent.host.renderPercentage(settings.trigger, locale.selected, true),
            ]),
            parent.host.renderPercentage(settings.trigger),
            parent.host.engine.i18n("ui.trigger.embassies.promptExplainer"),
          );

          if (value === undefined || value === "" || value.startsWith("-")) {
            return;
          }

          settings.trigger = parent.host.parsePercentage(value);
        },
        renderLabelTrigger: false,
      }),
    );

    const listRaces = new SettingsList(this).addChildren(
      this.host.game.diplomacy.races
        .filter(item => item.name !== "leviathans" && !isNil(this.setting.races[item.name]))
        .map(race =>
          this._makeEmbassySetting(
            this,
            this.setting.races[race.name],
            locale.selected,
            settings,
            race.title,
          ),
        ),
    );
    this.addChildContent(listRaces);
  }

  private _makeEmbassySetting(
    parent: UiComponent,
    option: SettingMax,
    locale: SupportedLocale,
    sectionSetting: EmbassySettings,
    label: string,
  ) {
    const onSetMax = async () => {
      const value = await Dialog.prompt(
        parent,
        parent.host.engine.i18n("ui.max.prompt.absolute"),
        parent.host.engine.i18n("ui.max.build.prompt", [
          label,
          parent.host.renderAbsolute(option.max, locale),
        ]),
        parent.host.renderAbsolute(option.max),
        parent.host.engine.i18n("ui.max.build.promptExplainer"),
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

      option.max = parent.host.parseAbsolute(value) ?? option.max;
    };

    const element = new SettingMaxListItem(parent, option, label, {
      onCheck: (isBatchProcess?: boolean) => {
        parent.host.engine.imessage("status.sub.enable", [label]);
        if (option.max === 0 && !isBatchProcess) {
          onSetMax();
        }
      },
      onUnCheck: () => {
        parent.host.engine.imessage("status.sub.disable", [label]);
      },
      onRefresh: () => {
        element.maxButton.inactive = !option.enabled || option.max === -1;
        element.maxButton.ineffective =
          sectionSetting.enabled && option.enabled && option.max === 0;
      },
      onRefreshMax: () => {
        element.maxButton.updateLabel(parent.host.renderAbsolute(option.max));
        element.maxButton.element[0].title =
          option.max < 0
            ? parent.host.engine.i18n("ui.max.embassy.titleInfinite", [label])
            : option.max === 0
              ? parent.host.engine.i18n("ui.max.embassy.titleZero", [label])
              : parent.host.engine.i18n("ui.max.embassy.title", [
                  parent.host.renderAbsolute(option.max),
                  label,
                ]);
      },
      onSetMax,
    });
    element.maxButton.element.addClass(stylesButton.lastHeadAction);
    return element;
  }
}
