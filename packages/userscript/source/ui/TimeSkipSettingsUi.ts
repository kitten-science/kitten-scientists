import { TimeSkipSettings } from "../settings/TimeSkipSettings";
import { ucfirst } from "../tools/Format";
import { UserScript } from "../UserScript";
import { TriggerButton } from "./components/buttons-icon/TriggerButton";
import { MaxButton } from "./components/buttons-text/MaxButton";
import { CyclesList } from "./components/CyclesList";
import { LabelListItem } from "./components/LabelListItem";
import { Panel } from "./components/Panel";
import { SeasonsList } from "./components/SeasonsList";
import { SettingsPanel } from "./components/SettingsPanel";

export class TimeSkipSettingsUi extends SettingsPanel<TimeSkipSettings> {
  private readonly _trigger: TriggerButton;
  private readonly _maximum: MaxButton;
  private readonly _cycles: Panel<CyclesList, LabelListItem>;
  private readonly _seasons: Panel<SeasonsList, LabelListItem>;

  constructor(host: UserScript, settings: TimeSkipSettings) {
    const label = host.engine.i18n("option.time.skip");
    super(host, label, settings);

    this._trigger = new TriggerButton(host, label, settings, "integer");
    this._trigger.element.insertBefore(this.list.element);
    this.children.add(this._trigger);

    this.list.addEventListener("enableAll", () => {
      this.refreshUi();
    });
    this.list.addEventListener("disableAll", () => {
      this.refreshUi();
    });
    this.list.addEventListener("reset", () => {
      this.setting.load(new TimeSkipSettings());
      this.refreshUi();
    });

    this._maximum = new MaxButton(this._host, label, this.setting);
    this._cycles = new Panel(
      this._host,
      new CyclesList(this._host, this.setting.cycles),
      new LabelListItem(
        host,
        ucfirst(this._host.engine.i18n("ui.cycles")),
        "M9 44q-1.2 0-2.1-.9Q6 42.2 6 41V10q0-1.2.9-2.1Q7.8 7 9 7h3.25V4h3.25v3h17V4h3.25v3H39q1.2 0 2.1.9.9.9.9 2.1v15h-3v-5.5H9V41h16.2v3Zm29 4q-3.65 0-6.375-2.275T28.2 40h3.1q.65 2.2 2.475 3.6Q35.6 45 38 45q2.9 0 4.95-2.05Q45 40.9 45 38q0-2.9-2.05-4.95Q40.9 31 38 31q-1.45 0-2.7.525-1.25.525-2.2 1.475H36v3h-8v-8h3v2.85q1.35-1.3 3.15-2.075Q35.95 28 38 28q4.15 0 7.075 2.925T48 38q0 4.15-2.925 7.075T38 48ZM9 16.5h30V10H9Zm0 0V10v6.5Z"
      )
    );
    this._seasons = new Panel(
      this._host,
      new SeasonsList(this._host, this.setting.seasons, {
        onCheck: (label: string) => this._host.engine.imessage("time.skip.season.enable", [label]),
        onUnCheck: (label: string) =>
          this._host.engine.imessage("time.skip.season.disable", [label]),
      }),
      new LabelListItem(
        host,
        ucfirst(this._host.engine.i18n("trade.seasons")),
        "M15.3 28.3q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575Zm8.85 0q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575Zm8.5 0q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575ZM9 44q-1.2 0-2.1-.9Q6 42.2 6 41V10q0-1.2.9-2.1Q7.8 7 9 7h3.25V4h3.25v3h17V4h3.25v3H39q1.2 0 2.1.9.9.9.9 2.1v31q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h30V19.5H9V41Zm0-24.5h30V10H9Zm0 0V10v6.5Z"
      )
    );

    this.element.append(this._maximum.element);

    this.addChildren([this._maximum, this._cycles, this._seasons]);
  }
}
