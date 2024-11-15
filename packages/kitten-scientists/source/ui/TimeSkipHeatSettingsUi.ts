import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { KittenScientists } from "../KittenScientists.js";
import { TimeSkipHeatSettings } from "../settings/TimeSkipHeatSettings.js";
import { PanelOptions } from "./components/CollapsiblePanel.js";
import { CyclesList } from "./components/CyclesList.js";
import { Dialog } from "./components/Dialog.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { UiComponent } from "./components/UiComponent.js";

export class TimeSkipHeatSettingsUi extends SettingsPanel<TimeSkipHeatSettings> {
  constructor(host: KittenScientists, settings: TimeSkipHeatSettings, options?: PanelOptions) {
    const label = host.engine.i18n("option.time.activeHeatTransfer");
    super(
      host,
      settings,
      new SettingTriggerListItem(host, label, settings, {
        onCheck: () => {
          host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.auto.disable", [label]);
        },
        onRefresh: item => {
          (item as SettingTriggerListItem).triggerButton.inactive = !settings.enabled;
        },
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.activeHeatTransfer.promptTitle"),
            host.engine.i18n("ui.trigger.activeHeatTransfer.prompt", [
              `${UiComponent.renderPercentage(settings.trigger)}%`,
            ]),
            UiComponent.renderPercentage(settings.trigger),
            host.engine.i18n("ui.trigger.activeHeatTransfer.promptExplainer"),
          )
            .then(value => {
              if (value === undefined || value === "" || value.startsWith("-")) {
                return;
              }

              settings.trigger = UiComponent.parsePercentage(value);
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
