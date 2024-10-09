import { SupportedLanguage } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { SettingOptions } from "../settings/Settings.js";
import { TimeControlSettings } from "../settings/TimeControlSettings.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { ResetSettingsUi } from "./ResetSettingsUi.js";
import { SettingsSectionUi } from "./SettingsSectionUi.js";
import { TimeSkipSettingsUi } from "./TimeSkipSettingsUi.js";

export class TimeControlSettingsUi extends SettingsSectionUi<TimeControlSettings> {
  protected readonly _items: Array<SettingListItem>;

  private readonly _accelerateTime: SettingTriggerListItem;
  private readonly _timeSkipUi: TimeSkipSettingsUi;
  private readonly _resetUi: ResetSettingsUi;

  constructor(
    host: KittenScientists,
    settings: TimeControlSettings,
    language: SettingOptions<SupportedLanguage>,
  ) {
    const label = host.engine.i18n("ui.timeCtrl");
    super(host, label, settings);

    const list = new SettingsList(this._host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    const accelerateLabel = this._host.engine.i18n("option.accelerate");
    this._accelerateTime = new SettingTriggerListItem(
      this._host,
      accelerateLabel,
      this.setting.accelerateTime,
      {
        onCheck: () => {
          this._host.engine.imessage("status.sub.enable", [accelerateLabel]);
        },
        onUnCheck: () => {
          this._host.engine.imessage("status.sub.disable", [accelerateLabel]);
        },
      },
    );
    this._timeSkipUi = new TimeSkipSettingsUi(this._host, this.setting.timeSkip);
    this._resetUi = new ResetSettingsUi(this._host, this.setting.reset, language);

    this._items = [this._accelerateTime, this._timeSkipUi, this._resetUi];

    list.addChildren(this._items);
    this.addChild(list);
  }
}
