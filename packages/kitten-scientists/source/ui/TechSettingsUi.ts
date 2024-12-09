import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { SupportedLocale } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { SettingOptions } from "../settings/Settings.js";
import { TechSettings } from "../settings/TechSettings.js";
import stylesButton from "./components/Button.module.css";
import { PanelOptions } from "./components/CollapsiblePanel.js";
import { Dialog } from "./components/Dialog.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { UiComponent } from "./components/UiComponent.js";

export class TechSettingsUi extends SettingsPanel<TechSettings> {
  constructor(
    host: KittenScientists,
    settings: TechSettings,
    locale: SettingOptions<SupportedLocale>,
    options?: PanelOptions,
  ) {
    const label = host.engine.i18n("ui.upgrade.techs");
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
          item.triggerButton.element[0].title = host.engine.i18n("ui.trigger", [
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
      options,
    );

    const techs = host.game.science.techs.filter(tech => !isNil(this.setting.techs[tech.name]));

    const items = [];
    let lastLabel = techs[0].label;
    for (const tech of techs.sort((a, b) => a.label.localeCompare(b.label, locale.selected))) {
      const option = this.setting.techs[tech.name];

      const element = new SettingTriggerListItem(host, option, locale, tech.label, {
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [tech.label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.sub.disable", [tech.label]);
        },
        onRefresh: () => {
          element.triggerButton.inactive = !option.enabled || option.trigger === -1;
        },
        onRefreshTrigger: () => {
          element.triggerButton.element[0].title = host.engine.i18n("ui.trigger", [
            option.trigger < 0
              ? settings.trigger < 0
                ? host.engine.i18n("ui.trigger.build.blocked", [label])
                : `${UiComponent.renderPercentage(settings.trigger, locale.selected, true)} (${host.engine.i18n("ui.trigger.build.inherited")})`
              : UiComponent.renderPercentage(option.trigger, locale.selected, true),
          ]);
        },
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.prompt.percentage"),
            host.engine.i18n("ui.trigger.section.prompt", [
              label,
              option.trigger !== -1
                ? UiComponent.renderPercentage(option.trigger, locale.selected, true)
                : host.engine.i18n("ui.trigger.build.inherited"),
            ]),
            option.trigger !== -1 ? UiComponent.renderPercentage(option.trigger) : "",
            host.engine.i18n("ui.trigger.build.promptExplainer"),
          )
            .then(value => {
              if (value === undefined) {
                return;
              }

              if (value === "" || value.startsWith("-")) {
                option.trigger = -1;
                return;
              }

              option.trigger = UiComponent.parsePercentage(value);
            })
            .then(() => {
              element.refreshUi();
            })
            .catch(redirectErrorsToConsole(console));
        },
      });
      element.triggerButton.element.addClass(stylesButton.lastHeadAction);

      if (host.engine.localeSupportsFirstLetterSplits(locale.selected)) {
        if (lastLabel[0] !== tech.label[0]) {
          element.element.addClass(stylesLabelListItem.splitter);
        }
      }

      items.push(element);

      lastLabel = tech.label;
    }

    this.addChild(new SettingsList(host, { children: items }));
  }
}
