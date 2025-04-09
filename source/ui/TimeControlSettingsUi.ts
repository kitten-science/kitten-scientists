import type { SupportedLocale } from "../Engine.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { TimeControlSettings } from "../settings/TimeControlSettings.js";
import stylesButton from "./components/Button.module.css";
import { Container } from "./components/Container.js";
import { Dialog } from "./components/Dialog.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import type { UiComponent } from "./components/UiComponent.js";
import { ResetSettingsUi } from "./ResetSettingsUi.js";
import { TimeSkipSettingsUi } from "./TimeSkipSettingsUi.js";

export class TimeControlSettingsUi extends SettingsPanel<TimeControlSettings> {
  protected readonly _items: Array<SettingListItem>;

  private readonly _accelerateTime: SettingTriggerListItem;
  private readonly _timeSkipUi: TimeSkipSettingsUi;
  private readonly _resetUi: ResetSettingsUi;

  constructor(
    parent: UiComponent,
    settings: TimeControlSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = parent.host.engine.i18n("ui.timeCtrl");
    super(
      parent,
      settings,
      new SettingListItem(parent, settings, label, {
        onCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.disable", [label]);
        },
      }).addChildrenHead([new Container(parent, { classes: [stylesLabelListItem.fillSpace] })]),
      {
        onRefreshRequest: () => {
          this.expando.ineffective =
            settings.enabled && [this._timeSkipUi, this._resetUi].some(_ => _.expando.ineffective);
          this.expando.requestRefresh();
        },
      },
    );

    const list = new SettingsList(this, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    const accelerateLabel = this.host.engine.i18n("option.accelerate");
    this._accelerateTime = new SettingTriggerListItem(
      this,
      this.setting.accelerateTime,
      locale,
      accelerateLabel,
      {
        onCheck: () => {
          this.host.engine.imessage("status.sub.enable", [accelerateLabel]);
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
            this,
            this.host.engine.i18n("ui.trigger.accelerateTime.prompt"),
            this.host.engine.i18n("ui.trigger.accelerateTime.promptTitle", [
              this.host.renderPercentage(
                this.setting.accelerateTime.trigger,
                locale.selected,
                true,
              ),
            ]),
            this.host.renderPercentage(this.setting.accelerateTime.trigger),
            this.host.engine.i18n("ui.trigger.accelerateTime.promptExplainer"),
          );

          if (value === undefined || value === "" || value.startsWith("-")) {
            return;
          }

          this.setting.accelerateTime.trigger = this.host.parsePercentage(value);
        },
        onUnCheck: () => {
          this.host.engine.imessage("status.sub.disable", [accelerateLabel]);
        },
      },
    );
    this._accelerateTime.triggerButton.element.addClass(stylesButton.lastHeadAction);
    this._timeSkipUi = new TimeSkipSettingsUi(this, this.setting.timeSkip, locale, settings);
    this._resetUi = new ResetSettingsUi(this, this.setting.reset, locale);

    this._items = [this._accelerateTime, this._timeSkipUi, this._resetUi];

    list.addChildren(this._items);
    this.addChildContent(list);
  }
}
