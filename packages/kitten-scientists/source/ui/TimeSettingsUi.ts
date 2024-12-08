import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { SupportedLocale } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { SettingOptions } from "../settings/Settings.js";
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
  constructor(
    host: KittenScientists,
    settings: TimeSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = host.engine.i18n("ui.time");
    super(
      host,
      settings,
      new SettingTriggerListItem(host, settings, locale, label, {
        onCheck: () => {
          host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.auto.disable", [label]);
        },
        onRefresh: item => {
          (item as SettingTriggerListItem).triggerButton.inactive =
            !settings.enabled || settings.trigger === -1;
        },
        onRefreshTrigger: item => {
          item.triggerButton.element[0].title = host.engine.i18n("ui.trigger.section", [
            settings.trigger < 0
              ? host.engine.i18n("ui.trigger.section.inactive")
              : UiComponent.renderPercentage(settings.trigger, locale.selected, true),
          ]);
        },
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.prompt.percentage"),
            host.engine.i18n("ui.trigger.section.prompt", [
              label,
              settings.trigger !== -1
                ? UiComponent.renderPercentage(settings.trigger, locale.selected, true)
                : host.engine.i18n("ui.infinity"),
            ]),
            settings.trigger !== -1
              ? UiComponent.renderPercentage(settings.trigger, locale.selected)
              : "",
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
      new SettingsList(host, {
        children: [
          new HeaderListItem(host, host.engine.i18n("$workshop.chronoforge.label")),
          ...host.game.time.chronoforgeUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(building =>
              BuildSectionTools.getBuildOption(
                host,
                this.setting.buildings[building.name],
                locale,
                this.setting,
                building.label,
                label,
                building.name === host.game.time.chronoforgeUpgrades.at(-1)?.name,
              ),
            ),

          new HeaderListItem(host, host.engine.i18n("$science.voidSpace.label")),
          ...host.game.time.voidspaceUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(building =>
              BuildSectionTools.getBuildOption(
                host,
                this.setting.buildings[building.name],
                locale,
                this.setting,
                building.label,
                label,
              ),
            ),
        ],
      }),

      new SettingsList(host, {
        children: [
          new HeaderListItem(host, host.engine.i18n("ui.additional")),
          new SettingListItem(
            host,
            host.engine.i18n("option.fix.cry"),
            this.setting.fixCryochambers,
            {
              onCheck: () => {
                host.engine.imessage("status.sub.enable", [host.engine.i18n("option.fix.cry")]);
              },
              onUnCheck: () => {
                host.engine.imessage("status.sub.disable", [host.engine.i18n("option.fix.cry")]);
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
