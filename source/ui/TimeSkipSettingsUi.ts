import type { SupportedLocale } from "../Engine.js";
import { Icons } from "../images/Icons.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { TimeControlSettings } from "../settings/TimeControlSettings.js";
import type { TimeSkipSettings } from "../settings/TimeSkipSettings.js";
import { ucfirst } from "../tools/Format.js";
import { TimeSkipHeatSettingsUi } from "./TimeSkipHeatSettingsUi.js";
import stylesButton from "./components/Button.module.css";
import { CollapsiblePanel } from "./components/CollapsiblePanel.js";
import { Container } from "./components/Container.js";
import { CyclesList } from "./components/CyclesList.js";
import { Dialog } from "./components/Dialog.js";
import { LabelListItem } from "./components/LabelListItem.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SeasonsList } from "./components/SeasonsList.js";
import { SettingListItem } from "./components/SettingListItem.js";
import stylesSettingListItem from "./components/SettingListItem.module.css";
import { SettingMaxTriggerListItem } from "./components/SettingMaxTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";

export class TimeSkipSettingsUi extends SettingsPanel<TimeSkipSettings, SettingMaxTriggerListItem> {
  private readonly _cycles: CollapsiblePanel;
  private readonly _seasons: CollapsiblePanel;
  private readonly _activeHeatTransferUI: TimeSkipHeatSettingsUi;

  constructor(
    parent: UiComponent,
    settings: TimeSkipSettings,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: TimeControlSettings,
  ) {
    const label = parent.host.engine.i18n("option.time.skip");
    super(
      parent,
      settings,
      new SettingMaxTriggerListItem(parent, settings, locale, label, {
        onCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.disable", [label]);
        },
        onRefresh: () => {
          this.settingItem.maxButton.inactive = !settings.enabled || settings.max === -1;
          this.settingItem.triggerButton.inactive = !settings.enabled || settings.trigger === -1;

          this.settingItem.maxButton.ineffective =
            sectionSetting.enabled && settings.enabled && settings.max === 0;

          this._cycles.expando.ineffective =
            sectionSetting.enabled &&
            settings.enabled &&
            !Object.values(settings.cycles).some(cycle => cycle.enabled);
          this._seasons.expando.ineffective =
            sectionSetting.enabled &&
            settings.enabled &&
            !Object.values(settings.seasons).some(season => season.enabled);
        },
        onRefreshMax() {
          this.maxButton.updateLabel(parent.host.renderAbsolute(settings.max));
          this.maxButton.element[0].title =
            settings.max < 0
              ? parent.host.engine.i18n("ui.max.timeSkip.titleInfinite", [label])
              : settings.max === 0
                ? parent.host.engine.i18n("ui.max.timeSkip.titleZero", [label])
                : parent.host.engine.i18n("ui.max.timeSkip.title", [
                    parent.host.renderAbsolute(settings.max),
                    label,
                  ]);
        },
        onRefreshTrigger() {
          this.triggerButton.element[0].title = parent.host.engine.i18n("ui.trigger", [
            settings.trigger < 0
              ? parent.host.engine.i18n("ui.trigger.section.inactive")
              : `${parent.host.renderFloat(settings.trigger, locale.selected)} TC`,
          ]);
        },
        onSetMax: async () => {
          const value = await Dialog.prompt(
            parent,
            parent.host.engine.i18n("ui.max.timeSkip.prompt"),
            parent.host.engine.i18n("ui.max.timeSkip.promptTitle", [
              parent.host.renderAbsolute(settings.max, locale.selected),
            ]),
            parent.host.renderAbsolute(settings.max),
            parent.host.engine.i18n("ui.max.timeSkip.promptExplainer"),
          );

          if (value === undefined) {
            return;
          }

          if (value === "" || value.startsWith("-")) {
            settings.max = -1;
            return;
          }

          if (value === "0") {
            settings.enabled = false;
          }

          settings.max = parent.host.parseAbsolute(value) ?? settings.max;
        },
        onSetTrigger: async () => {
          const value = await Dialog.prompt(
            parent,
            parent.host.engine.i18n("ui.trigger.timeSkip.prompt"),
            parent.host.engine.i18n("ui.trigger.timeSkip.promptTitle", [
              parent.host.renderAbsolute(settings.trigger, locale.selected),
            ]),
            parent.host.renderAbsolute(settings.trigger),
            parent.host.engine.i18n("ui.trigger.timeSkip.promptExplainer"),
          );

          if (value === undefined || value === "" || value.startsWith("-")) {
            return;
          }

          settings.trigger = parent.host.parseAbsolute(value) ?? settings.trigger;
        },
      }),
    );
    this.settingItem.triggerButton.element.removeClass(stylesButton.lastHeadAction);

    this._cycles = new CollapsiblePanel(
      this,
      new LabelListItem(this, ucfirst(this.host.engine.i18n("ui.cycles")), {
        classes: [stylesSettingListItem.checked, stylesSettingListItem.setting],
        icon: Icons.Cycles,
      }).addChildrenHead([new Container(this, { classes: [stylesLabelListItem.fillSpace] })]),
    ).addChildren([
      new CyclesList(this, this.setting.cycles, {
        onCheckCycle: (label: string) => {
          this.host.engine.imessage("time.skip.cycle.enable", [label]);
          this.refreshUi();
        },
        onUnCheckCycle: (label: string) => {
          this.host.engine.imessage("time.skip.cycle.disable", [label]);
          this.refreshUi();
        },
      }),
    ]);
    this._seasons = new CollapsiblePanel(
      this,
      new LabelListItem(this, ucfirst(this.host.engine.i18n("trade.seasons")), {
        classes: [stylesSettingListItem.checked, stylesSettingListItem.setting],
        icon: Icons.Seasons,
      }).addChildrenHead([new Container(this, { classes: [stylesLabelListItem.fillSpace] })]),
    ).addChildren([
      new SeasonsList(this, this.setting.seasons, {
        onCheckSeason: (label: string) => {
          this.host.engine.imessage("time.skip.season.enable", [label]);
          this.refreshUi();
        },
        onUnCheckSeason: (label: string) => {
          this.host.engine.imessage("time.skip.season.disable", [label]);
          this.refreshUi();
        },
      }),
    ]);
    this._activeHeatTransferUI = new TimeSkipHeatSettingsUi(
      this,
      this.setting.activeHeatTransfer,
      locale,
      settings,
      sectionSetting,
    );

    this.addChild(
      new SettingsList(this, {
        hasDisableAll: false,
        hasEnableAll: false,
      }).addChildren([
        this._cycles,
        this._seasons,
        new SettingListItem(
          this,
          this.setting.ignoreOverheat,
          this.host.engine.i18n("option.time.skip.ignoreOverheat"),
        ),
        this._activeHeatTransferUI,
      ]),
    );
  }
}
