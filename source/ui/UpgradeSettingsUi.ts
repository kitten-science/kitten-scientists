import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { UpgradeSettings } from "../settings/UpgradeSettings.js";
import stylesButton from "./components/Button.module.css";
import stylesDelimiter from "./components/Delimiter.module.css";
import { Dialog } from "./components/Dialog.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import type { SettingListItemOptions } from "./components/SettingListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, type SettingsPanelOptions } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";

export class UpgradeSettingsUi extends SettingsPanel<UpgradeSettings, SettingTriggerListItem> {
  constructor(
    parent: UiComponent,
    settings: UpgradeSettings,
    locale: SettingOptions<SupportedLocale>,
    options?: SettingsPanelOptions<SettingTriggerListItem> & SettingListItemOptions,
  ) {
    const label = parent.host.engine.i18n("ui.upgrade.upgrades");
    super(
      parent,
      settings,
      new SettingTriggerListItem(parent, settings, locale, label, {
        onCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.enable", [label]);
          this.refreshUi();
          options?.onCheck?.(isBatchProcess);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.disable", [label]);
          this.refreshUi();
          options?.onUnCheck?.(isBatchProcess);
        },
        onRefresh: () => {
          this.settingItem.triggerButton.inactive = !settings.enabled || settings.trigger === -1;
        },
        onRefreshTrigger() {
          this.triggerButton.element[0].title = parent.host.engine.i18n("ui.trigger", [
            settings.trigger === -1
              ? parent.host.engine.i18n("ui.trigger.section.inactive")
              : parent.host.renderPercentage(settings.trigger, locale.selected, true),
          ]);
        },
        onSetTrigger: async () => {
          const value = await Dialog.prompt(
            parent,
            parent.host.engine.i18n("ui.trigger.prompt.percentage"),
            parent.host.engine.i18n("ui.trigger.section.prompt", [
              label,
              settings.trigger !== -1
                ? parent.host.renderPercentage(settings.trigger, locale.selected, true)
                : parent.host.engine.i18n("ui.infinity"),
            ]),
            settings.trigger !== -1 ? parent.host.renderPercentage(settings.trigger) : "",
            parent.host.engine.i18n("ui.trigger.section.promptExplainer"),
          );

          if (value === undefined) {
            return;
          }

          if (value === "" || value.startsWith("-")) {
            settings.trigger = -1;
            return;
          }

          settings.trigger = parent.host.parsePercentage(value);
        },
      }),
      options,
    );

    const upgrades = parent.host.game.workshop.upgrades.filter(
      upgrade => !isNil(this.setting.upgrades[upgrade.name]),
    );

    const items = [];
    let lastLabel = upgrades[0].label;
    let lastElement: SettingTriggerListItem | undefined;
    for (const upgrade of upgrades.sort((a, b) =>
      a.label.localeCompare(b.label, locale.selected),
    )) {
      const option = this.setting.upgrades[upgrade.name];

      const element = new SettingTriggerListItem(parent, option, locale, upgrade.label, {
        onCheck: () => {
          parent.host.engine.imessage("status.sub.enable", [upgrade.label]);
        },
        onUnCheck: () => {
          parent.host.engine.imessage("status.sub.disable", [upgrade.label]);
        },
        onRefresh: () => {
          element.triggerButton.inactive = !option.enabled || option.trigger === -1;
          element.triggerButton.ineffective =
            settings.enabled && option.enabled && settings.trigger === -1 && option.trigger === -1;
        },
        onRefreshTrigger: () => {
          element.triggerButton.element[0].title = parent.host.engine.i18n("ui.trigger", [
            option.trigger < 0
              ? settings.trigger < 0
                ? parent.host.engine.i18n("ui.trigger.build.blocked", [label])
                : `${parent.host.renderPercentage(settings.trigger, locale.selected, true)} (${parent.host.engine.i18n("ui.trigger.section.inherited")})`
              : parent.host.renderPercentage(option.trigger, locale.selected, true),
          ]);
        },
        onSetTrigger: async () => {
          const value = await Dialog.prompt(
            parent,
            parent.host.engine.i18n("ui.trigger.prompt.percentage"),
            parent.host.engine.i18n("ui.trigger.section.prompt", [
              label,
              option.trigger !== -1
                ? parent.host.renderPercentage(option.trigger, locale.selected, true)
                : parent.host.engine.i18n("ui.trigger.section.inherited"),
            ]),
            option.trigger !== -1 ? parent.host.renderPercentage(option.trigger) : "",
            parent.host.engine.i18n("ui.trigger.section.promptExplainer"),
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
      });
      element.triggerButton.element.addClass(stylesButton.lastHeadAction);

      if (parent.host.engine.localeSupportsFirstLetterSplits(locale.selected)) {
        if (lastLabel[0] !== upgrade.label[0]) {
          if (!isNil(lastElement)) {
            lastElement.element.addClass(stylesDelimiter.delimiter);
          }
          element.element.addClass(stylesLabelListItem.splitter);
        }
      }

      lastElement = element;
      items.push(element);

      lastLabel = upgrade.label;
    }

    this.addChild(new SettingsList(parent, { children: items }));
  }
}
