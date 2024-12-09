import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { SupportedLocale } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { SettingOptions } from "../settings/Settings.js";
import { TimeControlSettings } from "../settings/TimeControlSettings.js";
import stylesButton from "./components/Button.module.css";
import { Container } from "./components/Container.js";
import { Dialog } from "./components/Dialog.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
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
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = host.engine.i18n("ui.timeCtrl");
    super(
      host,
      settings,
      new SettingListItem(host, settings, label, {
        childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
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
      this.setting.accelerateTime,
      locale,
      accelerateLabel,
      {
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [accelerateLabel]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.sub.disable", [accelerateLabel]);
        },
        onRefresh: () => {
          this._accelerateTime.triggerButton.inactive =
            !this.setting.accelerateTime.enabled || this.setting.accelerateTime.trigger === -1;
        },
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.accelerateTime.prompt"),
            host.engine.i18n("ui.trigger.accelerateTime.promptTitle", [
              host.renderPercentage(this.setting.accelerateTime.trigger, locale.selected, true),
            ]),
            host.renderPercentage(this.setting.accelerateTime.trigger),
            host.engine.i18n("ui.trigger.accelerateTime.promptExplainer"),
          )
            .then(value => {
              if (value === undefined || value === "" || value.startsWith("-")) {
                return;
              }

              this.setting.accelerateTime.trigger = host.parsePercentage(value);
            })
            .then(() => {
              this.refreshUi();
            })
            .catch(redirectErrorsToConsole(console));
        },
      },
    );
    this._accelerateTime.triggerButton.element.addClass(stylesButton.lastHeadAction);
    this._timeSkipUi = new TimeSkipSettingsUi(host, this.setting.timeSkip, locale);
    this._resetUi = new ResetSettingsUi(host, this.setting.reset, locale);

    this._items = [this._accelerateTime, this._timeSkipUi, this._resetUi];

    list.addChildren(this._items);
    this.addChild(list);
  }
}
