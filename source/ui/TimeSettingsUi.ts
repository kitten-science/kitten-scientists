import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { TimeItem, TimeSettings } from "../settings/TimeSettings.js";
import { BuildSectionTools } from "./BuildSectionTools.js";
import type { CollapsiblePanelOptions } from "./components/CollapsiblePanel.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingListItem, type SettingListItemOptions } from "./components/SettingListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

export class TimeSettingsUi extends SettingsPanel<TimeSettings, SettingTriggerListItem> {
  constructor(
    host: KittenScientists,
    settings: TimeSettings,
    locale: SettingOptions<SupportedLocale>,
    options?: CollapsiblePanelOptions & SettingListItemOptions,
  ) {
    const label = host.engine.i18n("ui.time");
    super(
      host,
      settings,
      new SettingTriggerListItem(host, settings, locale, label, {
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
        onRefresh: () => {
          this.settingItem.triggerButton.inactive = !settings.enabled || settings.trigger === -1;
        },
        onRefreshTrigger() {
          this.triggerButton.element[0].title = host.engine.i18n("ui.trigger.section", [
            settings.trigger < 0
              ? host.engine.i18n("ui.trigger.section.inactive")
              : host.renderPercentage(settings.trigger, locale.selected, true),
          ]);
        },
        onSetTrigger: async () => {
          const value = await Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.prompt.percentage"),
            host.engine.i18n("ui.trigger.section.prompt", [
              label,
              settings.trigger !== -1
                ? host.renderPercentage(settings.trigger, locale.selected, true)
                : host.engine.i18n("ui.infinity"),
            ]),
            settings.trigger !== -1 ? host.renderPercentage(settings.trigger) : "",
            host.engine.i18n("ui.trigger.section.promptExplainer"),
          );

          if (value === undefined) {
            return;
          }

          if (value === "" || value.startsWith("-")) {
            settings.trigger = -1;
            return;
          }

          settings.trigger = host.parsePercentage(value);
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
                { delimiter: building.name === host.game.time.chronoforgeUpgrades.at(-1)?.name },
              ),
            ),

          new HeaderListItem(host, host.engine.i18n("$science.voidSpace.label")),
          ...host.game.time.voidspaceUpgrades
            .filter(item => item.name in this.setting.buildings)
            .map(building =>
              BuildSectionTools.getBuildOption(
                host,
                this.setting.buildings[building.name as TimeItem],
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
            this.setting.fixCryochambers,
            host.engine.i18n("option.fix.cry"),
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
