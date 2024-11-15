import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import { TimeSkipSettings } from "../settings/TimeSkipSettings.js";
import { ucfirst } from "../tools/Format.js";
import { TimeSkipHeatSettingsUi } from "./TimeSkipHeatSettingsUi.js";
import stylesButton from "./components/Button.module.css";
import { CollapsiblePanel, PanelOptions } from "./components/CollapsiblePanel.js";
import { Container } from "./components/Container";
import { CyclesList } from "./components/CyclesList.js";
import { Dialog } from "./components/Dialog.js";
import { LabelListItem } from "./components/LabelListItem.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SeasonsList } from "./components/SeasonsList.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingMaxTriggerListItem } from "./components/SettingMaxTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { UiComponent } from "./components/UiComponent.js";

export class TimeSkipSettingsUi extends SettingsPanel<TimeSkipSettings, SettingMaxTriggerListItem> {
  private readonly _cycles: CollapsiblePanel<CyclesList>;
  private readonly _seasons: CollapsiblePanel<SeasonsList>;
  private readonly _activeHeatTransferUI: TimeSkipHeatSettingsUi;

  constructor(host: KittenScientists, settings: TimeSkipSettings, options?: PanelOptions) {
    const label = host.engine.i18n("option.time.skip");
    super(
      host,
      settings,
      new SettingMaxTriggerListItem(host, label, settings, {
        onCheck: () => {
          host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.auto.disable", [label]);
        },
        onRefresh: item => {
          (item as SettingMaxTriggerListItem).maxButton.inactive =
            !settings.enabled || settings.max === -1;
          (item as SettingMaxTriggerListItem).triggerButton.inactive =
            !settings.enabled || settings.trigger === -1;
        },
        onRefreshMax: item => {
          item.maxButton.updateLabel(UiComponent.renderAbsolute(settings.max, host));
          item.maxButton.element[0].title =
            settings.max < 0
              ? host.engine.i18n("ui.max.timeSkip.titleInfinite", [label])
              : settings.max === 0
                ? host.engine.i18n("ui.max.timeSkip.titleZero", [label])
                : host.engine.i18n("ui.max.timeSkip.title", [
                    UiComponent.renderAbsolute(settings.max, host),
                    label,
                  ]);
        },
        onRefreshTrigger: item => {
          item.triggerButton.element[0].title = host.engine.i18n("ui.trigger", [
            settings.trigger < 0
              ? host.engine.i18n("ui.trigger.section.inactive")
              : `${UiComponent.renderFloat(settings.trigger)} TC`,
          ]);
        },
        onSetMax: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.max.timeSkip.prompt"),
            host.engine.i18n("ui.max.timeSkip.promptTitle", [
              UiComponent.renderAbsolute(settings.max, host),
            ]),
            UiComponent.renderAbsolute(settings.max, host),
            host.engine.i18n("ui.max.timeSkip.promptExplainer"),
          )
            .then(value => {
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

              settings.max = UiComponent.parseAbsolute(value) ?? settings.max;
            })
            .then(() => {
              this.refreshUi();
            })
            .catch(redirectErrorsToConsole(console));
        },
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.timeSkip.prompt"),
            host.engine.i18n("ui.trigger.timeSkip.promptTitle", [
              UiComponent.renderAbsolute(settings.trigger, host),
            ]),
            UiComponent.renderAbsolute(settings.trigger, host),
            host.engine.i18n("ui.trigger.timeSkip.promptExplainer"),
          )
            .then(value => {
              if (value === undefined || value === "" || value.startsWith("-")) {
                return;
              }

              settings.trigger = UiComponent.parsePercentage(value);
            })
            .then(() => {
              this.refreshUi();
            })
            .catch(redirectErrorsToConsole(console));
        },
      }),
      options,
    );
    this.settingItem.triggerButton.element.removeClass(stylesButton.lastHeadAction);

    this._cycles = new CollapsiblePanel(
      host,
      new LabelListItem(host, ucfirst(host.engine.i18n("ui.cycles")), {
        childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
        icon: Icons.Cycles,
      }),
      {
        children: [new CyclesList(host, this.setting.cycles, "skip")],
      },
    );
    this._seasons = new CollapsiblePanel(
      host,
      new LabelListItem(host, ucfirst(host.engine.i18n("trade.seasons")), {
        childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
        icon: Icons.Seasons,
      }),
      {
        children: [
          new SeasonsList(host, this.setting.seasons, {
            onCheck: (label: string) => {
              host.engine.imessage("time.skip.season.enable", [label]);
            },
            onUnCheck: (label: string) => {
              host.engine.imessage("time.skip.season.disable", [label]);
            },
          }),
        ],
      },
    );
    this._activeHeatTransferUI = new TimeSkipHeatSettingsUi(host, this.setting.activeHeatTransfer);

    this.addChild(
      new SettingsList(host, {
        children: [
          //new ButtonListItem(host, this._maximum, { delimiter: true }),
          this._cycles,
          this._seasons,
          new SettingListItem(
            host,
            host.engine.i18n("option.time.skip.ignoreOverheat"),
            this.setting.ignoreOverheat,
          ),
          this._activeHeatTransferUI,
        ],
        hasDisableAll: false,
        hasEnableAll: false,
      }),
    );
  }
}
