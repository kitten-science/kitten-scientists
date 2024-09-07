import { KittenScientists } from "../KittenScientists.js";
import { TimeSkipHeatSettings } from "../settings/TimeSkipHeatSettings.js";
import { CyclesList } from "./components/CyclesList.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, SettingsPanelOptions } from "./components/SettingsPanel.js";
import { TriggerButton } from "./components/buttons-icon/TriggerButton.js";

export class TimeSkipHeatSettingsUi extends SettingsPanel<TimeSkipHeatSettings> {
  private readonly _trigger: TriggerButton;

  constructor(
    host: KittenScientists,
    settings: TimeSkipHeatSettings,
    options?: SettingsPanelOptions<SettingsPanel<TimeSkipHeatSettings>>,
  ) {
    const label = host.engine.i18n("option.time.activeHeatTransfer");
    super(host, label, settings, options);

    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertAfter(this._expando.element);
    this.children.add(this._trigger);

    this.addChild(
      new SettingsList(this._host, {
        children: [new CyclesList(this._host, this.setting.cycles, "heatTransfer")],
        hasDisableAll: false,
        hasEnableAll: false,
      }),
    );
  }
}
