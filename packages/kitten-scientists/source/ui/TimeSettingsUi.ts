import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { KittenScientists } from "../KittenScientists.js";
import { TimeSettings } from "../settings/TimeSettings.js";
import { BuildSectionTools } from "./BuildSectionTools.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { UiComponent } from "./components/UiComponent.js";

export class TimeSettingsUi extends SettingsPanel<TimeSettings> {
  constructor(host: KittenScientists, settings: TimeSettings) {
    const label = host.engine.i18n("ui.time");
    super(
      host,
      settings,
      new SettingTriggerListItem(host, label, settings, {
        onCheck: () => {
          host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.auto.disable", [label]);
        },
        onRefresh: item => {
          (item as SettingTriggerListItem).triggerButton.inactive = settings.trigger < 0;
        },
        onRefreshTrigger: item => {
          item.triggerButton.element[0].title = host.engine.i18n("ui.trigger", [
            settings.trigger < 0
              ? host.engine.i18n("ui.trigger.section.inactive")
              : `${UiComponent.renderPercentage(settings.trigger)}%`,
          ]);
        },
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.prompt.percentage"),
            host.engine.i18n("ui.trigger.section.prompt", [
              label,
              settings.trigger !== -1
                ? `${UiComponent.renderPercentage(settings.trigger)}%`
                : host.engine.i18n("ui.infinity"),
            ]),
            settings.trigger !== -1 ? UiComponent.renderPercentage(settings.trigger) : "",
            host.engine.i18n("ui.trigger.section.promptExplainer"),
          )
            .then(value => {
              if (value === undefined) {
                return;
              }

              if (value === "" || value.startsWith("-")) {
                settings.trigger = -1;
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
    );

    this.addChildren([
      new SettingsList(this._host, {
        children: [
          new HeaderListItem(this._host, this._host.engine.i18n("$workshop.chronoforge.label")),
          ...this._host.game.time.chronoforgeUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(building =>
              BuildSectionTools.getBuildOption(
                host,
                this.setting.buildings[building.name],
                this.setting,
                building.label,
                label,
                building.name === this._host.game.time.chronoforgeUpgrades.at(-1)?.name,
              ),
            ),

          new HeaderListItem(this._host, this._host.engine.i18n("$science.voidSpace.label")),
          ...this._host.game.time.voidspaceUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(building =>
              BuildSectionTools.getBuildOption(
                host,
                this.setting.buildings[building.name],
                this.setting,
                building.label,
                label,
              ),
            ),
        ],
      }),

      new SettingsList(this._host, {
        children: [
          new HeaderListItem(this._host, this._host.engine.i18n("ui.additional")),
          new SettingListItem(
            this._host,
            this._host.engine.i18n("option.fix.cry"),
            this.setting.fixCryochambers,
            {
              onCheck: () => {
                this._host.engine.imessage("status.sub.enable", [
                  this._host.engine.i18n("option.fix.cry"),
                ]);
              },
              onUnCheck: () => {
                this._host.engine.imessage("status.sub.disable", [
                  this._host.engine.i18n("option.fix.cry"),
                ]);
              },
            },
          ),
          new SettingListItem(
            this._host,
            this._host.engine.i18n("option.chronofurnace"),
            this.setting.turnOnChronoFurnace,
            {
              onCheck: () => {
                this._host.engine.imessage("status.sub.enable", [
                  this._host.engine.i18n("option.chronofurnace"),
                ]);
              },
              onUnCheck: () => {
                this._host.engine.imessage("status.sub.disable", [
                  this._host.engine.i18n("option.chronofurnace"),
                ]);
              },
            },
          ),
        ],
        hasDisableAll: false,
        hasEnableAll: false,
      }),
    ]);
  }
}
