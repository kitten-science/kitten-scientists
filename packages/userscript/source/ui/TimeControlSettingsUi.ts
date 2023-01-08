import { TimeControlSettings } from "../settings/TimeControlSettings";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsList } from "./components/SettingsList";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";
import { ResetSettingsUi } from "./ResetSettingsUi";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { TimeSkipSettingsUi } from "./TimeSkipSettingsUi";

export class TimeControlSettingsUi extends SettingsSectionUi<TimeControlSettings> {
  protected readonly _items: Array<SettingListItem>;

  private readonly _accelerateTime: SettingTriggerListItem;
  private readonly _timeSkipUi: TimeSkipSettingsUi;
  private readonly _resetUi: ResetSettingsUi;

  constructor(host: UserScript, settings: TimeControlSettings) {
    const label = host.engine.i18n("ui.timeCtrl");
    super(host, label, settings);

    const list = new SettingsList(this._host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    this._accelerateTime = new SettingTriggerListItem(
      this._host,
      this._host.engine.i18n("option.accelerate"),
      this.setting.accelerateTime,
      {
        onCheck: () => this._host.engine.imessage("status.sub.enable", [label]),
        onUnCheck: () => this._host.engine.imessage("status.sub.disable", [label]),
      }
    );
    this._timeSkipUi = new TimeSkipSettingsUi(this._host, this.setting.timeSkip);
    this._resetUi = new ResetSettingsUi(this._host, this.setting.reset);

    this._items = [this._accelerateTime, this._timeSkipUi, this._resetUi];

    list.addChildren(this._items);
    this.addChild(list);
  }
}
