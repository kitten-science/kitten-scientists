import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { SupportedLocale } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { EmbassySettings } from "../settings/EmbassySettings.js";
import { SettingMax, SettingOptions } from "../settings/Settings.js";
import stylesButton from "./components/Button.module.css";
import { PanelOptions } from "./components/CollapsiblePanel.js";
import { Dialog } from "./components/Dialog.js";
import { SettingMaxListItem } from "./components/SettingMaxListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { UiComponent } from "./components/UiComponent.js";

export class EmbassySettingsUi extends SettingsPanel<EmbassySettings> {
  constructor(
    host: KittenScientists,
    settings: EmbassySettings,
    locale: SettingOptions<SupportedLocale>,
    options?: PanelOptions,
  ) {
    const label = host.engine.i18n("option.embassies");
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
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.embassies.prompt"),
            host.engine.i18n("ui.trigger.embassies.promptTitle", [
              UiComponent.renderPercentage(settings.trigger, locale.selected, true),
            ]),
            UiComponent.renderPercentage(settings.trigger),
            host.engine.i18n("ui.trigger.embassies.promptExplainer"),
          )
            .then(value => {
              if (value === undefined || value === "" || value.startsWith("-")) {
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
      options,
    );

    const listRaces = new SettingsList(host, {
      children: host.game.diplomacy.races
        .filter(item => !isNil(this.setting.races[item.name]))
        .map(races => this._makeEmbassySetting(host, this.setting.races[races.name], races.title)),
    });
    this.addChild(listRaces);
  }

  private _makeEmbassySetting(host: KittenScientists, option: SettingMax, label: string) {
    const element = new SettingMaxListItem(host, label, option, {
      onCheck: () => {
        host.engine.imessage("status.sub.enable", [label]);
      },
      onUnCheck: () => {
        host.engine.imessage("status.sub.disable", [label]);
      },
      onRefresh: () => {
        element.maxButton.inactive = !option.enabled || option.max === -1;
      },
      onRefreshMax: () => {
        element.maxButton.updateLabel(UiComponent.renderAbsolute(option.max, host));
        element.maxButton.element[0].title =
          option.max < 0
            ? host.engine.i18n("ui.max.embassy.titleInfinite", [label])
            : option.max === 0
              ? host.engine.i18n("ui.max.embassy.titleZero", [label])
              : host.engine.i18n("ui.max.embassy.title", [
                  UiComponent.renderAbsolute(option.max, host),
                  label,
                ]);
      },
      onSetMax: () => {
        Dialog.prompt(
          host,
          host.engine.i18n("ui.max.prompt.absolute"),
          host.engine.i18n("ui.max.build.prompt", [
            label,
            UiComponent.renderAbsolute(option.max, host),
          ]),
          UiComponent.renderAbsolute(option.max, host),
          host.engine.i18n("ui.max.build.promptExplainer"),
        )
          .then(value => {
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

            option.max = UiComponent.parseAbsolute(value) ?? option.max;
          })
          .then(() => {
            this.refreshUi();
          })
          .catch(redirectErrorsToConsole(console));
      },
    });
    element.maxButton.element.addClass(stylesButton.lastHeadAction);
    return element;
  }
}
