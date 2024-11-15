import { SupportedLanguage } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { SettingOptions } from "../settings/Settings.js";
import { TimeControlSettings } from "../settings/TimeControlSettings.js";
import { PaddingButton } from "./components/buttons-icon/PaddingButton.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { ResetSettingsUi } from "./ResetSettingsUi.js";
import { TimeSkipSettingsUi } from "./TimeSkipSettingsUi.js";

export class TimeControlSettingsUi extends SettingsPanel<TimeControlSettings> {
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
    super(
      host,
      settings,
      new SettingListItem(host, label, settings, {
        onCheck: () => {
          host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.auto.disable", [label]);
        },
      }),
    );

    const list = new SettingsList(host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    const accelerateLabel = host.engine.i18n("option.accelerate");
    this._accelerateTime = new SettingTriggerListItem(
      host,
      accelerateLabel,
      this.setting.accelerateTime,
      {
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [accelerateLabel]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.sub.disable", [accelerateLabel]);
        },
      },
    );
    this._accelerateTime.head.addChild(new PaddingButton(host));
    this._timeSkipUi = new TimeSkipSettingsUi(host, this.setting.timeSkip);
    this._resetUi = new ResetSettingsUi(host, this.setting.reset, language);

    this._items = [this._accelerateTime, this._timeSkipUi, this._resetUi];

    list.addChildren(this._items);
    this.addChild(list);
  }
}
