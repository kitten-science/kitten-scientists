import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { SupportedLanguage } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { SettingOptions } from "../settings/Settings.js";
import { TechSettings } from "../settings/TechSettings.js";
import { PaddingButton } from "./components/buttons-icon/PaddingButton.js";
import { PanelOptions } from "./components/CollapsiblePanel.js";
import { Dialog } from "./components/Dialog.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { UiComponent } from "./components/UiComponent.js";

export class TechSettingsUi extends SettingsPanel<TechSettings> {
  constructor(
    host: KittenScientists,
    settings: TechSettings,
    language: SettingOptions<SupportedLanguage>,
    options?: PanelOptions,
  ) {
    const label = host.engine.i18n("ui.upgrade.techs");
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
        onRefresh: item => {
          (item as SettingTriggerListItem).triggerButton.inactive = settings.trigger < 0;
        },
        onRefreshTrigger: item => {
          item.triggerButton.element[0].title = host.engine.i18n("ui.trigger", [
            settings.trigger < 0
              ? host.engine.i18n("ui.trigger.section.inactive")
              : `${UiComponent.renderPercentage(settings.trigger)}%`,
          ]);
        },
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.prompt.percentage"),
            host.engine.i18n("ui.trigger.section.prompt", [
              label,
              settings.trigger !== -1
                ? `${UiComponent.renderPercentage(settings.trigger)}%`
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

    const localeSupportsSortMethod = language.selected !== "zh";

    const items = [];
    for (const tech of localeSupportsSortMethod
      ? host.game.science.techs.sort((a, b) => a.label.localeCompare(b.label))
      : host.game.science.techs) {
      if (isNil(this.setting.techs[tech.name])) {
        continue;
      }

      const option = this.setting.techs[tech.name];

      const element = new SettingTriggerListItem(host, tech.label, option, {
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [tech.label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.sub.disable", [tech.label]);
        },
        onRefresh: () => {
          element.triggerButton.inactive = option.trigger === -1;
        },
        onRefreshTrigger: () => {
          element.triggerButton.element[0].title = host.engine.i18n("ui.trigger", [
            option.trigger < 0
              ? settings.trigger < 0
                ? host.engine.i18n("ui.trigger.build.blocked", [label])
                : `${UiComponent.renderPercentage(settings.trigger)}% (${host.engine.i18n("ui.trigger.build.inherited")})`
              : `${UiComponent.renderPercentage(option.trigger)}%`,
          ]);
        },
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.prompt.percentage"),
            host.engine.i18n("ui.trigger.section.prompt", [
              label,
              option.trigger !== -1
                ? `${Dialog.renderPercentage(option.trigger)}%`
                : host.engine.i18n("ui.trigger.build.inherited"),
            ]),
            option.trigger !== -1 ? Dialog.renderPercentage(option.trigger) : "",
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
      element.head.addChild(new PaddingButton(host));

      items.push(element);
    }

    this.addChild(new SettingsList(host, { children: items }));
  }
}
