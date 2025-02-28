import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { ResetSettingsUi } from "./ResetSettingsUi.js";
import { TimeSkipSettingsUi } from "./TimeSkipSettingsUi.js";
import stylesButton from "./components/Button.module.css";
import { Container } from "./components/Container.js";
import { Dialog } from "./components/Dialog.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export class TimeControlSettingsUi extends SettingsPanel {
  _items;
  _accelerateTime;
  _timeSkipUi;
  _resetUi;
  constructor(host, settings, locale) {
    const label = host.engine.i18n("ui.timeCtrl");
    super(
      host,
      settings,
      new SettingListItem(host, settings, label, {
        childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
        onCheck: () => {
          host.engine.imessage("status.auto.enable", [label]);
          this.refreshUi();
        },
        onUnCheck: () => {
          host.engine.imessage("status.auto.disable", [label]);
          this.refreshUi();
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
          this._accelerateTime.triggerButton.inactive = !this.setting.accelerateTime.enabled;
          this._accelerateTime.triggerButton.ineffective =
            this.setting.enabled &&
            this.setting.accelerateTime.enabled &&
            this.setting.accelerateTime.trigger === -1;
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
    this._timeSkipUi = new TimeSkipSettingsUi(host, this.setting.timeSkip, locale, settings);
    this._resetUi = new ResetSettingsUi(host, this.setting.reset, locale);
    this._items = [this._accelerateTime, this._timeSkipUi, this._resetUi];
    list.addChildren(this._items);
    this.addChild(list);
  }
}
//# sourceMappingURL=TimeControlSettingsUi.js.map
