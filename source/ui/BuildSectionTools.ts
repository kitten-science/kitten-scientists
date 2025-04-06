import type { SupportedLocale } from "../Engine.js";
import type { SettingOptions, SettingTrigger, SettingTriggerMax } from "../settings/Settings.js";
import { Dialog } from "./components/Dialog.js";
import {
  SettingMaxTriggerListItem,
  type SettingMaxTriggerListItemOptions,
} from "./components/SettingMaxTriggerListItem.js";
import type { UiComponent } from "./components/UiComponent.js";

export const BuildSectionTools = {
  getBuildOption: (
    parent: UiComponent,
    option: SettingTriggerMax,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: SettingTrigger,
    label: string,
    sectionLabel: string,
    options?: Partial<SettingMaxTriggerListItemOptions>,
  ) => {
    const onSetMax = async () => {
      const value = await Dialog.prompt(
        parent,
        parent.host.engine.i18n("ui.max.prompt.absolute"),
        parent.host.engine.i18n("ui.max.build.prompt", [
          label,
          parent.host.renderAbsolute(option.max, locale.selected),
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

    const element = new SettingMaxTriggerListItem(parent, option, locale, label, {
      delimiter: options?.delimiter,
      onCheck: async (isBatchProcess?: boolean) => {
        parent.host.engine.imessage("status.sub.enable", [label]);
        if (option.max === 0 && !isBatchProcess) {
          await onSetMax();
        }
        options?.onCheck?.(isBatchProcess);
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
        element.maxButton.updateLabel(parent.host.renderAbsolute(option.max));
        element.maxButton.element[0].title =
          option.max < 0
            ? parent.host.engine.i18n("ui.max.build.titleInfinite", [label])
            : option.max === 0
              ? parent.host.engine.i18n("ui.max.build.titleZero", [label])
              : parent.host.engine.i18n("ui.max.build.title", [
                  parent.host.renderAbsolute(option.max),
                  label,
                ]);
      },
      onRefreshTrigger: () => {
        element.triggerButton.element[0].title = parent.host.engine.i18n("ui.trigger", [
          option.trigger < 0
            ? sectionSetting.trigger < 0
              ? parent.host.engine.i18n("ui.trigger.build.blocked", [sectionLabel])
              : `${parent.host.renderPercentage(sectionSetting.trigger, locale.selected, true)} (${parent.host.engine.i18n("ui.trigger.build.inherited")})`
            : parent.host.renderPercentage(option.trigger, locale.selected, true),
        ]);
      },
      onSetMax,
      onSetTrigger: async () => {
        const value = await Dialog.prompt(
          parent,
          parent.host.engine.i18n("ui.trigger.prompt.percentage"),
          parent.host.engine.i18n("ui.trigger.build.prompt", [
            label,
            option.trigger !== -1
              ? parent.host.renderPercentage(option.trigger, locale.selected, true)
              : parent.host.engine.i18n("ui.trigger.build.inherited"),
          ]),
          option.trigger !== -1 ? parent.host.renderPercentage(option.trigger) : "",
          parent.host.engine.i18n("ui.trigger.build.promptExplainer"),
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
      onUnCheck: (isBatchProcess?: boolean) => {
        parent.host.engine.imessage("status.sub.disable", [label]);
        options?.onUnCheck?.(isBatchProcess);
      },
      renderLabelTrigger: options?.renderLabelTrigger,
      upgradeIndicator: options?.upgradeIndicator,
    });
    return element;
  },
};
