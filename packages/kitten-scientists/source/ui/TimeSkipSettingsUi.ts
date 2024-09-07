import { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import { TimeSkipSettings } from "../settings/TimeSkipSettings.js";
import { ucfirst } from "../tools/Format.js";
import { TimeSkipHeatSettingsUi } from "./TimeSkipHeatSettingsUi.js";
import { ButtonListItem } from "./components/ButtonListItem.js";
import { CollapsiblePanel } from "./components/CollapsiblePanel.js";
import { CyclesList } from "./components/CyclesList.js";
import { LabelListItem } from "./components/LabelListItem.js";
import { SeasonsList } from "./components/SeasonsList.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, SettingsPanelOptions } from "./components/SettingsPanel.js";
import { TriggerButton } from "./components/buttons-icon/TriggerButton.js";
import { MaxButton } from "./components/buttons-text/MaxButton.js";

export class TimeSkipSettingsUi extends SettingsPanel<TimeSkipSettings> {
  private readonly _trigger: TriggerButton;
  private readonly _maximum: MaxButton;
  private readonly _cycles: CollapsiblePanel<CyclesList, LabelListItem>;
  private readonly _seasons: CollapsiblePanel<SeasonsList, LabelListItem>;
  private readonly _activeHeatTransferUI: TimeSkipHeatSettingsUi;

  constructor(
    host: KittenScientists,
    settings: TimeSkipSettings,
    options?: SettingsPanelOptions<SettingsPanel<TimeSkipSettings>>,
  ) {
    const label = host.engine.i18n("option.time.skip");
    super(host, label, settings, options);

    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertAfter(this._expando.element);
    this.children.add(this._trigger);

    this._maximum = new MaxButton(this._host, label, this.setting);

    this._cycles = new CollapsiblePanel(
      this._host,
      new LabelListItem(host, ucfirst(this._host.engine.i18n("ui.cycles")), {
        icon: Icons.Cycles,
      }),
      {
        children: [new CyclesList(this._host, this.setting.cycles, "skip")],
      },
    );
    this._seasons = new CollapsiblePanel(
      this._host,
      new LabelListItem(host, ucfirst(this._host.engine.i18n("trade.seasons")), {
        icon: Icons.Seasons,
      }),
      {
        children: [
          new SeasonsList(this._host, this.setting.seasons, {
            onCheck: (label: string) => {
              this._host.engine.imessage("time.skip.season.enable", [label]);
            },
            onUnCheck: (label: string) => {
              this._host.engine.imessage("time.skip.season.disable", [label]);
            },
          }),
        ],
      },
    );
    this._activeHeatTransferUI = new TimeSkipHeatSettingsUi(
      this._host,
      this.setting.activeHeatTransfer,
    );

    this.addChild(
      new SettingsList(this._host, {
        children: [
          new ButtonListItem(host, this._maximum, { delimiter: true }),
          this._cycles,
          this._seasons,
          new SettingListItem(
            this._host,
            this._host.engine.i18n("option.time.skip.ignoreOverheat"),
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
