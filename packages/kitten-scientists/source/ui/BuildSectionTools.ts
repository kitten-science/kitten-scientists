import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { SupportedLocale } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { SettingOptions, SettingTrigger, SettingTriggerMax } from "../settings/Settings.js";
import { Dialog } from "./components/Dialog.js";
import { SettingMaxTriggerListItem } from "./components/SettingMaxTriggerListItem.js";
import { UiComponent } from "./components/UiComponent.js";

export const BuildSectionTools = {
  getBuildOption: (
    host: KittenScientists,
    option: SettingTriggerMax,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: SettingTrigger,
    label: string,
    sectionLabel: string,
    delimiter = false,
    upgradeIndicator = false,
  ) => {
    const buildOption = new SettingMaxTriggerListItem(host, option, locale, label, {
      delimiter,
      onCheck: () => {
        host.engine.imessage("status.sub.enable", [label]);
      },
      onUnCheck: () => {
        host.engine.imessage("status.sub.disable", [label]);
      },
      onRefresh: () => {
        buildOption.maxButton.inactive = !option.enabled || option.max === 0 || option.max === -1;
        buildOption.triggerButton.inactive = !option.enabled || option.trigger === -1;
      },
      onRefreshMax: () => {
        buildOption.maxButton.updateLabel(UiComponent.renderAbsolute(option.max, host));
        buildOption.maxButton.element[0].title =
          option.max < 0
            ? host.engine.i18n("ui.max.build.titleInfinite", [label])
            : option.max === 0
              ? host.engine.i18n("ui.max.build.titleZero", [label])
              : host.engine.i18n("ui.max.build.title", [
                  UiComponent.renderAbsolute(option.max, host),
                  label,
                ]);
      },
      onRefreshTrigger: () => {
        buildOption.triggerButton.element[0].title = host.engine.i18n("ui.trigger", [
          option.trigger < 0
            ? sectionSetting.trigger < 0
              ? host.engine.i18n("ui.trigger.build.blocked", [sectionLabel])
              : `${UiComponent.renderPercentage(sectionSetting.trigger, locale.selected, true)} (${host.engine.i18n("ui.trigger.build.inherited")})`
            : UiComponent.renderPercentage(option.trigger, locale.selected, true),
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
          option.max.toString(),
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
            buildOption.refreshUi();
          })
          .catch(redirectErrorsToConsole(console));
      },
      onSetTrigger: () => {
        Dialog.prompt(
          host,
          host.engine.i18n("ui.trigger.prompt.percentage"),
          host.engine.i18n("ui.trigger.build.prompt", [
            label,
            option.trigger !== -1
              ? UiComponent.renderPercentage(option.trigger, locale.selected, true)
              : host.engine.i18n("ui.trigger.build.inherited"),
          ]),
          option.trigger !== -1
            ? UiComponent.renderPercentage(option.trigger, locale.selected)
            : "",
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
            buildOption.refreshUi();
          })
          .catch(redirectErrorsToConsole(console));
      },
      upgradeIndicator,
    });
    return buildOption;
  },
};
