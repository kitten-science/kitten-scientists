import type { SupportedLocale } from "../Engine.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { TimeControlSettings } from "../settings/TimeControlSettings.js";
import type { TimeSkipHeatSettings } from "../settings/TimeSkipHeatSettings.js";
import type { TimeSkipSettings } from "../settings/TimeSkipSettings.js";
import { CyclesList } from "./components/CyclesList.js";
import { Dialog } from "./components/Dialog.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import type { UiComponent } from "./components/UiComponent.js";
import styles from "./TimeSkipHeatSettingsUi.module.css";

export class TimeSkipHeatSettingsUi extends SettingsPanel<
  TimeSkipHeatSettings,
  SettingTriggerListItem
> {
  constructor(
    parent: UiComponent,
    settings: TimeSkipHeatSettings,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: TimeSkipSettings,
    sectionParentSetting: TimeControlSettings,
  ) {
    const label = parent.host.engine.i18n("option.time.activeHeatTransfer");
    super(
      parent,
      settings,
      new SettingTriggerListItem(parent, settings, locale, label, {
        onCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.enable", [label]);
        },
        onRefresh: () => {
          this.settingItem.triggerButton.inactive = !settings.enabled;
          this.settingItem.triggerButton.ineffective =
            sectionParentSetting.enabled &&
            sectionSetting.enabled &&
            settings.enabled &&
            settings.trigger === -1;

          this.expando.ineffective =
            sectionParentSetting.enabled &&
            sectionSetting.enabled &&
            settings.enabled &&
            !Object.values(settings.cycles).some(cycle => cycle.enabled);

          if (settings.activeHeatTransferStatus.enabled) {
            this.head.elementLabel.attr("data-ks-active-from", "◎");
            this.head.elementLabel.attr("data-ks-active-to", "◎");
            this.head.elementLabel.addClass(styles.active);
          } else {
            this.head.elementLabel.removeClass(styles.active);
          }
        },
        onSetTrigger: async () => {
          const value = await Dialog.prompt(
            parent,
            parent.host.engine.i18n("ui.trigger.activeHeatTransfer.prompt"),
            parent.host.engine.i18n("ui.trigger.activeHeatTransfer.promptTitle", [
              parent.host.renderPercentage(settings.trigger, locale.selected, true),
            ]),
            parent.host.renderPercentage(settings.trigger),
            parent.host.engine.i18n("ui.trigger.activeHeatTransfer.promptExplainer"),
          );

          if (value === undefined || value === "" || value.startsWith("-")) {
            return;
          }

          settings.trigger = parent.host.parsePercentage(value);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.disable", [label]);
          settings.activeHeatTransferStatus.enabled = false;
        },
      }),
    );

    this.addChildContent(
      new SettingsList(this, {
        hasDisableAll: false,
        hasEnableAll: false,
      }).addChildren([
        new CyclesList(this, this.setting.cycles, {
          onCheckCycle: (label: string) => {
            this.host.engine.imessage("time.heatTransfer.cycle.enable", [label]);
          },
          onUnCheckCycle: (label: string) => {
            this.host.engine.imessage("time.heatTransfer.cycle.disable", [label]);
          },
        }),
      ]),
    );
  }
}
