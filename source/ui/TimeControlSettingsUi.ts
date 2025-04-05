import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { TimeControlSettings } from "../settings/TimeControlSettings.js";
import { ResetSettingsUi } from "./ResetSettingsUi.js";
import { TimeSkipSettingsUi } from "./TimeSkipSettingsUi.js";
import stylesButton from "./components/Button.module.css";
import { Container } from "./components/Container.js";
import { Dialog } from "./components/Dialog.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem, type SettingListItemOptions } from "./components/SettingListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, type SettingsPanelOptions } from "./components/SettingsPanel.js";

export class TimeControlSettingsUi extends SettingsPanel<TimeControlSettings> {
  protected readonly _items: Array<SettingListItem>;

  private readonly _accelerateTime: SettingTriggerListItem;
  private readonly _timeSkipUi: TimeSkipSettingsUi;
  private readonly _resetUi: ResetSettingsUi;

  constructor(
    host: KittenScientists,
    settings: TimeControlSettings,
    locale: SettingOptions<SupportedLocale>,
    options?: SettingsPanelOptions<SettingListItem> & SettingListItemOptions,
  ) {
    const label = host.engine.i18n("ui.timeCtrl");
    super(
      host,
      settings,
      new SettingListItem(host, settings, label, {
        childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
        onCheck: (isBatchProcess?: boolean) => {
          host.engine.imessage("status.auto.enable", [label]);
          this.refreshUi();
          options?.onCheck?.(isBatchProcess);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          host.engine.imessage("status.auto.disable", [label]);
          this.refreshUi();
          options?.onUnCheck?.(isBatchProcess);
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
        onSetTrigger: async () => {
          const value = await Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.accelerateTime.prompt"),
            host.engine.i18n("ui.trigger.accelerateTime.promptTitle", [
              host.renderPercentage(this.setting.accelerateTime.trigger, locale.selected, true),
            ]),
            host.renderPercentage(this.setting.accelerateTime.trigger),
            host.engine.i18n("ui.trigger.accelerateTime.promptExplainer"),
          );

          if (value === undefined || value === "" || value.startsWith("-")) {
            return;
          }

          this.setting.accelerateTime.trigger = host.parsePercentage(value);
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
