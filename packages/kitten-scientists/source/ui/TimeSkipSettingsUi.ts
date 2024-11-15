import { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import { TimeSkipSettings } from "../settings/TimeSkipSettings.js";
import { ucfirst } from "../tools/Format.js";
import { TimeSkipHeatSettingsUi } from "./TimeSkipHeatSettingsUi.js";
import { ButtonListItem } from "./components/ButtonListItem.js";
import { CollapsiblePanel, PanelOptions } from "./components/CollapsiblePanel.js";
import { CyclesList } from "./components/CyclesList.js";
import { LabelListItem } from "./components/LabelListItem.js";
import { SeasonsList } from "./components/SeasonsList.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { MaxButton } from "./components/buttons-text/MaxButton.js";

export class TimeSkipSettingsUi extends SettingsPanel<TimeSkipSettings> {
  private readonly _maximum: MaxButton;
  private readonly _cycles: CollapsiblePanel<CyclesList>;
  private readonly _seasons: CollapsiblePanel<SeasonsList>;
  private readonly _activeHeatTransferUI: TimeSkipHeatSettingsUi;

  constructor(host: KittenScientists, settings: TimeSkipSettings, options?: PanelOptions) {
    const label = host.engine.i18n("option.time.skip");
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

    this._maximum = new MaxButton(host, label, this.setting);

    this._cycles = new CollapsiblePanel(
      host,
      new LabelListItem(host, ucfirst(host.engine.i18n("ui.cycles")), {
        icon: Icons.Cycles,
      }),
      {
        children: [new CyclesList(host, this.setting.cycles, "skip")],
      },
    );
    this._seasons = new CollapsiblePanel(
      host,
      new LabelListItem(host, ucfirst(host.engine.i18n("trade.seasons")), {
        icon: Icons.Seasons,
      }),
      {
        children: [
          new SeasonsList(host, this.setting.seasons, {
            onCheck: (label: string) => {
              host.engine.imessage("time.skip.season.enable", [label]);
            },
            onUnCheck: (label: string) => {
              host.engine.imessage("time.skip.season.disable", [label]);
            },
          }),
        ],
      },
    );
    this._activeHeatTransferUI = new TimeSkipHeatSettingsUi(host, this.setting.activeHeatTransfer);

    this.addChild(
      new SettingsList(host, {
        children: [
          new ButtonListItem(host, this._maximum, { delimiter: true }),
          this._cycles,
          this._seasons,
          new SettingListItem(
            host,
            host.engine.i18n("option.time.skip.ignoreOverheat"),
            this.setting.ignoreOverheat,
          ),
          this._activeHeatTransferUI,
        ],
        hasDisableAll: false,
        hasEnableAll: false,
      }),
    );
  }
}
