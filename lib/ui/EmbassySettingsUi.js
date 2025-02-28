import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import stylesButton from "./components/Button.module.css";
import { Dialog } from "./components/Dialog.js";
import { SettingMaxListItem } from "./components/SettingMaxListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export class EmbassySettingsUi extends SettingsPanel {
  constructor(host, settings, locale, options) {
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
          item.triggerButton.inactive = !settings.enabled || settings.trigger === -1;
        },
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.embassies.prompt"),
            host.engine.i18n("ui.trigger.embassies.promptTitle", [
              host.renderPercentage(settings.trigger, locale.selected, true),
            ]),
            host.renderPercentage(settings.trigger),
            host.engine.i18n("ui.trigger.embassies.promptExplainer"),
          )
            .then(value => {
              if (value === undefined || value === "" || value.startsWith("-")) {
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
      options,
    );
    const listRaces = new SettingsList(host, {
      children: host.game.diplomacy.races
        .filter(item => !isNil(this.setting.races[item.name]))
        .map(races =>
          this._makeEmbassySetting(
            host,
            this.setting.races[races.name],
            locale.selected,
            settings,
            races.title,
          ),
        ),
    });
    this.addChild(listRaces);
  }
  _makeEmbassySetting(host, option, locale, sectionSetting, label) {
    const onSetMax = () => {
      Dialog.prompt(
        host,
        host.engine.i18n("ui.max.prompt.absolute"),
        host.engine.i18n("ui.max.build.prompt", [label, host.renderAbsolute(option.max, locale)]),
        host.renderAbsolute(option.max),
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
          option.max = host.parseAbsolute(value) ?? option.max;
        })
        .then(() => {
          this.refreshUi();
        })
        .catch(redirectErrorsToConsole(console));
    };
    const element = new SettingMaxListItem(host, option, label, {
      onCheck: () => {
        host.engine.imessage("status.sub.enable", [label]);
        if (option.max === 0) {
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
//# sourceMappingURL=EmbassySettingsUi.js.map
