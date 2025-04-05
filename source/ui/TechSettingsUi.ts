import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import type { ScienceSettings } from "../settings/ScienceSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { TechSettings } from "../settings/TechSettings.js";
import stylesButton from "./components/Button.module.css";
import { Dialog } from "./components/Dialog.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";

export class TechSettingsUi extends SettingsPanel<TechSettings, SettingTriggerListItem> {
  constructor(
    parent: UiComponent,
    settings: TechSettings,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: ScienceSettings,
  ) {
    const label = parent.host.engine.i18n("ui.upgrade.techs");
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
          this.settingItem.triggerButton.ineffective =
            sectionSetting.enabled &&
            settings.enabled &&
            settings.trigger === -1 &&
            !Object.values(settings.techs).some(tech => tech.enabled && 0 <= tech.trigger);

          this.expando.ineffective =
            sectionSetting.enabled &&
            settings.enabled &&
            !Object.values(settings.techs).some(tech => tech.enabled);
        },
        onRefreshTrigger() {
          this.triggerButton.element[0].title = parent.host.engine.i18n("ui.trigger", [
            settings.trigger < 0
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
    );

    const techs = this.host.game.science.techs.filter(
      tech => !isNil(this.setting.techs[tech.name]),
    );

    const items = [];
    let lastLabel = techs[0].label;
    for (const tech of techs.sort((a, b) => a.label.localeCompare(b.label, locale.selected))) {
      const option = this.setting.techs[tech.name];

      const element = new SettingTriggerListItem(this, option, locale, tech.label, {
        onCheck: () => {
          this.host.engine.imessage("status.sub.enable", [tech.label]);
        },
        onUnCheck: () => {
          this.host.engine.imessage("status.sub.disable", [tech.label]);
        },
        onRefresh: () => {
          element.triggerButton.inactive = !option.enabled || option.trigger === -1;
          element.triggerButton.ineffective =
            sectionSetting.enabled &&
            settings.enabled &&
            option.enabled &&
            settings.trigger === -1 &&
            option.trigger === -1;
        },
        onRefreshTrigger: () => {
          element.triggerButton.element[0].title = this.host.engine.i18n("ui.trigger", [
            option.trigger < 0
              ? settings.trigger < 0
                ? this.host.engine.i18n("ui.trigger.section.blocked", [label])
                : `${this.host.renderPercentage(settings.trigger, locale.selected, true)} (${this.host.engine.i18n("ui.trigger.section.inherited")})`
              : this.host.renderPercentage(option.trigger, locale.selected, true),
          ]);
        },
        onSetTrigger: async () => {
          const value = await Dialog.prompt(
            this,
            this.host.engine.i18n("ui.trigger.prompt.percentage"),
            this.host.engine.i18n("ui.trigger.section.prompt", [
              label,
              option.trigger !== -1
                ? this.host.renderPercentage(option.trigger, locale.selected, true)
                : this.host.engine.i18n("ui.trigger.section.inherited"),
            ]),
            option.trigger !== -1 ? this.host.renderPercentage(option.trigger) : "",
            this.host.engine.i18n("ui.trigger.section.promptExplainer"),
          );

          if (value === undefined) {
            return;
          }

          if (value === "" || value.startsWith("-")) {
            option.trigger = -1;
            return;
          }

          option.trigger = this.host.parsePercentage(value);
        },
      });
      element.triggerButton.element.addClass(stylesButton.lastHeadAction);

      if (this.host.engine.localeSupportsFirstLetterSplits(locale.selected)) {
        if (lastLabel[0] !== tech.label[0]) {
          element.element.addClass(stylesLabelListItem.splitter);
        }
      }

      items.push(element);

      lastLabel = tech.label;
    }

    this.addChildContent(new SettingsList(this).addChildren(items));
  }
}
