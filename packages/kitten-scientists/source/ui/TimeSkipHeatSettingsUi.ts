import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { SupportedLocale } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { SettingOptions } from "../settings/Settings.js";
import { TimeSkipHeatSettings } from "../settings/TimeSkipHeatSettings.js";
import { PanelOptions } from "./components/CollapsiblePanel.js";
import { CyclesList } from "./components/CyclesList.js";
import { Dialog } from "./components/Dialog.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import styles from "./TimeSkipHeatSettingsUi.module.css";

export class TimeSkipHeatSettingsUi extends SettingsPanel<TimeSkipHeatSettings> {
  constructor(
    host: KittenScientists,
    settings: TimeSkipHeatSettings,
    locale: SettingOptions<SupportedLocale>,
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
            settings.enabled && settings.trigger === -1;
          this.expando.ineffective =
            settings.enabled && !Object.values(settings.cycles).some(cycle => cycle.enabled);

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
            host.engine.i18n("ui.trigger.activeHeatTransfer.promptTitle"),
            host.engine.i18n("ui.trigger.activeHeatTransfer.prompt", [
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
        children: [new CyclesList(host, this.setting.cycles, "heatTransfer")],
        hasDisableAll: false,
        hasEnableAll: false,
      }),
    );
  }
}
