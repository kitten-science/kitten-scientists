import { KittenScientists } from "../KittenScientists.js";
import { TimeSkipHeatSettings } from "../settings/TimeSkipHeatSettings.js";
import { PanelOptions } from "./components/CollapsiblePanel.js";
import { CyclesList } from "./components/CyclesList.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

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
