import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { SettingOptions, SettingTrigger, SettingTriggerMax } from "../settings/Settings.js";
import { Dialog } from "./components/Dialog.js";
import {
  SettingMaxTriggerListItem,
  type SettingMaxTriggerListItemOptions,
} from "./components/SettingMaxTriggerListItem.js";

export const BuildSectionTools = {
  getBuildOption: (
    host: KittenScientists,
    option: SettingTriggerMax,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: SettingTrigger,
    label: string,
    sectionLabel: string,
    options?: Partial<SettingMaxTriggerListItemOptions>,
  ) => {
    const onSetMax = async () => {
      const value = await Dialog.prompt(
        host,
        host.engine.i18n("ui.max.prompt.absolute"),
        host.engine.i18n("ui.max.build.prompt", [
          label,
          host.renderAbsolute(option.max, locale.selected),
        ]),
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

    const element = new SettingMaxTriggerListItem(host, option, locale, label, {
      delimiter: options?.delimiter,
      onCheck: (isBatchProcess?: boolean) => {
        host.engine.imessage("status.sub.enable", [label]);
        if (option.max === 0 && !isBatchProcess) {
          onSetMax();
        }
        options?.onCheck?.(isBatchProcess);
      },
      onUnCheck: (isBatchProcess?: boolean) => {
        host.engine.imessage("status.sub.disable", [label]);
        options?.onUnCheck?.(isBatchProcess);
      },
      onRefresh: () => {
        element.maxButton.inactive = !option.enabled || option.max === -1;
        element.maxButton.ineffective =
          sectionSetting.enabled && option.enabled && option.max === 0;
        element.triggerButton.inactive = !option.enabled || option.trigger === -1;
        element.triggerButton.ineffective =
          sectionSetting.enabled &&
          option.enabled &&
          sectionSetting.trigger === -1 &&
          option.trigger === -1;
      },
      onRefreshMax: () => {
        element.maxButton.updateLabel(host.renderAbsolute(option.max));
        element.maxButton.element[0].title =
          option.max < 0
            ? host.engine.i18n("ui.max.build.titleInfinite", [label])
            : option.max === 0
              ? host.engine.i18n("ui.max.build.titleZero", [label])
              : host.engine.i18n("ui.max.build.title", [host.renderAbsolute(option.max), label]);
      },
      onRefreshTrigger: () => {
        element.triggerButton.element[0].title = host.engine.i18n("ui.trigger", [
          option.trigger < 0
            ? sectionSetting.trigger < 0
              ? host.engine.i18n("ui.trigger.build.blocked", [sectionLabel])
              : `${host.renderPercentage(sectionSetting.trigger, locale.selected, true)} (${host.engine.i18n("ui.trigger.build.inherited")})`
            : host.renderPercentage(option.trigger, locale.selected, true),
        ]);
      },
      onSetMax,
      onSetTrigger: async () => {
        const value = await Dialog.prompt(
          host,
          host.engine.i18n("ui.trigger.prompt.percentage"),
          host.engine.i18n("ui.trigger.build.prompt", [
            label,
            option.trigger !== -1
              ? host.renderPercentage(option.trigger, locale.selected, true)
              : host.engine.i18n("ui.trigger.build.inherited"),
          ]),
          option.trigger !== -1 ? host.renderPercentage(option.trigger) : "",
          host.engine.i18n("ui.trigger.build.promptExplainer"),
        );

        if (value === undefined) {
          return;
        }

        if (value === "" || value.startsWith("-")) {
          option.trigger = -1;
          return;
        }

        option.trigger = host.parsePercentage(value);
      },
      upgradeIndicator: options?.upgradeIndicator,
    });
    return element;
  },
};
