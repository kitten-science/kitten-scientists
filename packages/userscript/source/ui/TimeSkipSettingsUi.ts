import { Icons } from "../images/Icons";
import { TimeSkipSettings } from "../settings/TimeSkipSettings";
import { ucfirst } from "../tools/Format";
import { UserScript } from "../UserScript";
import { TriggerButton } from "./components/buttons-icon/TriggerButton";
import { MaxButton } from "./components/buttons-text/MaxButton";
import { CyclesList } from "./components/CyclesList";
import { LabelListItem } from "./components/LabelListItem";
import { Panel } from "./components/Panel";
import { SeasonsList } from "./components/SeasonsList";
import { SettingsList } from "./components/SettingsList";
import { SettingsPanel, SettingsPanelOptions } from "./components/SettingsPanel";

export class TimeSkipSettingsUi extends SettingsPanel<TimeSkipSettings> {
  private readonly _trigger: TriggerButton;
  private readonly _maximum: MaxButton;
  private readonly _cycles: Panel<CyclesList, LabelListItem>;
  private readonly _seasons: Panel<SeasonsList, LabelListItem>;

  constructor(
    host: UserScript,
    settings: TimeSkipSettings,
    options?: SettingsPanelOptions<SettingsPanel<TimeSkipSettings>>
  ) {
    const label = host.engine.i18n("option.time.skip");
    super(host, label, settings, options);

    this._trigger = new TriggerButton(host, label, settings, "integer");
    this._trigger.element.insertAfter(this._expando.element);
    this.children.add(this._trigger);

    this._maximum = new MaxButton(this._host, label, this.setting);
    this.addChild(this._maximum);

    const list = new SettingsList(this._host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    this._cycles = new Panel(
      this._host,
      new LabelListItem(host, ucfirst(this._host.engine.i18n("ui.cycles")), {
        icon: Icons.Cycles,
      }),
      {
        child: new CyclesList(this._host, this.setting.cycles),
      }
    );
    this._seasons = new Panel(
      this._host,
      new LabelListItem(host, ucfirst(this._host.engine.i18n("trade.seasons")), {
        icon: Icons.Seasons,
      }),
      {
        child: new SeasonsList(this._host, this.setting.seasons, {
          onCheck: (label: string) =>
            this._host.engine.imessage("time.skip.season.enable", [label]),
          onUnCheck: (label: string) =>
            this._host.engine.imessage("time.skip.season.disable", [label]),
        }),
      }
    );

    list.addChildren([this._cycles, this._seasons]);
    this.addChild(list);
  }
}
