import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { KittenScientists } from "../KittenScientists.js";
import { SettingTrigger, SettingTriggerMax } from "../settings/Settings.js";
import { Dialog } from "./components/Dialog.js";
import { SettingMaxTriggerListItem } from "./components/SettingMaxTriggerListItem.js";
import { UiComponent } from "./components/UiComponent.js";

export const BuildSectionTools = {
  getBuildOption: (
    host: KittenScientists,
    option: SettingTriggerMax,
    sectionSetting: SettingTrigger,
    label: string,
    sectionLabel: string,
    delimiter = false,
    upgradeIndicator = false,
  ) => {
    const buildOption = new SettingMaxTriggerListItem(host, label, option, {
      delimiter,
      onCheck: () => {
        host.engine.imessage("status.sub.enable", [label]);
      },
      onUnCheck: () => {
        host.engine.imessage("status.sub.disable", [label]);
      },
      onRefresh: () => {
        buildOption.triggerButton.inactive = option.trigger === -1;
      },
      onRefreshTrigger: () => {
        buildOption.triggerButton.element[0].title = host.engine.i18n("ui.trigger", [
          option.trigger < 0
            ? sectionSetting.trigger < 0
              ? host.engine.i18n("ui.trigger.build.blocked", [sectionLabel])
              : `${UiComponent.renderPercentage(sectionSetting.trigger)}% (${host.engine.i18n("ui.trigger.build.inherited")})`
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
            buildOption.refreshUi();
          })
          .catch(redirectErrorsToConsole(console));
      },
      upgradeIndicator,
    });
    return buildOption;
  },
};
