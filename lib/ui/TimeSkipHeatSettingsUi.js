import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import styles from "./TimeSkipHeatSettingsUi.module.css";
import { CyclesList } from "./components/CyclesList.js";
import { Dialog } from "./components/Dialog.js";
import stylesSettingListItem from "./components/SettingListItem.module.css";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export class TimeSkipHeatSettingsUi extends SettingsPanel {
  constructor(host, settings, locale, sectionSetting, sectionParentSetting, options) {
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
          item.triggerButton.inactive = !settings.enabled;
          item.triggerButton.ineffective =
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
            onCheck: label => {
              host.engine.imessage("time.heatTransfer.cycle.enable", [label]);
              this.refreshUi();
            },
            onUnCheck: label => {
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
//# sourceMappingURL=TimeSkipHeatSettingsUi.js.map
