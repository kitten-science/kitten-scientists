import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { TimeControlSettings } from "../settings/TimeControlSettings.js";
import type { TimeSkipHeatSettings } from "../settings/TimeSkipHeatSettings.js";
import type { TimeSkipSettings } from "../settings/TimeSkipSettings.js";
import styles from "./TimeSkipHeatSettingsUi.module.css";
import type { PanelOptions } from "./components/CollapsiblePanel.js";
import { CyclesList } from "./components/CyclesList.js";
import { Dialog } from "./components/Dialog.js";
import stylesSettingListItem from "./components/SettingListItem.module.css";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

export class TimeSkipHeatSettingsUi extends SettingsPanel<TimeSkipHeatSettings> {
  constructor(
    host: KittenScientists,
    settings: TimeSkipHeatSettings,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: TimeSkipSettings,
    sectionParentSetting: TimeControlSettings,
    options?: PanelOptions,
  ) {
    const label = host.engine.i18n("option.time.activeHeatTransfer");
    super(
      host,
      settings,
      new SettingTriggerListItem(host, settings, locale, label, {
        onCheck: () => {
          host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.auto.disable", [label]);
          settings.activeHeatTransferStatus.enabled = false;
        },
        onRefresh: item => {
          (item as SettingTriggerListItem).triggerButton.inactive = !settings.enabled;
          (item as SettingTriggerListItem).triggerButton.ineffective =
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
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.activeHeatTransfer.prompt"),
            host.engine.i18n("ui.trigger.activeHeatTransfer.promptTitle", [
              host.renderPercentage(settings.trigger, locale.selected, true),
            ]),
            host.renderPercentage(settings.trigger),
            host.engine.i18n("ui.trigger.activeHeatTransfer.promptExplainer"),
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

    this.addChild(
      new SettingsList(host, {
        classes: [stylesSettingListItem.checked, stylesSettingListItem.setting],
        children: [
          new CyclesList(host, this.setting.cycles, {
            onCheck: (label: string) => {
              host.engine.imessage("time.heatTransfer.cycle.enable", [label]);
              this.refreshUi();
            },
            onUnCheck: (label: string) => {
              host.engine.imessage("time.heatTransfer.cycle.disable", [label]);
              this.refreshUi();
            },
          }),
        ],
        hasDisableAll: false,
        hasEnableAll: false,
      }),
    );
  }
}
