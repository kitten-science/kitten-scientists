import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
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
import type { UiComponent } from "./components/UiComponent.js";

export class TimeSettingsUi extends SettingsPanel<TimeSettings, SettingTriggerListItem> {
  constructor(
    parent: UiComponent,
    settings: TimeSettings,
    locale: SettingOptions<SupportedLocale>,
    options?: CollapsiblePanelOptions & SettingListItemOptions,
  ) {
    const label = parent.host.engine.i18n("ui.time");
    super(
      parent,
      settings,
      new SettingTriggerListItem(parent, settings, locale, label, {
        onCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.enable", [label]);
          this.refreshUi();
          options?.onCheck?.(isBatchProcess);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.disable", [label]);
          this.refreshUi();
          options?.onUnCheck?.(isBatchProcess);
        },
        onRefresh: () => {
          this.settingItem.triggerButton.inactive = !settings.enabled || settings.trigger === -1;
        },
        onRefreshTrigger() {
          this.triggerButton.element[0].title = parent.host.engine.i18n("ui.trigger.section", [
            settings.trigger < 0
              ? parent.host.engine.i18n("ui.trigger.section.inactive")
              : parent.host.renderPercentage(settings.trigger, locale.selected, true),
          ]);
        },
        onSetTrigger: async () => {
          const value = await Dialog.prompt(
            parent,
            parent.host.engine.i18n("ui.trigger.prompt.percentage"),
            parent.host.engine.i18n("ui.trigger.section.prompt", [
              label,
              settings.trigger !== -1
                ? parent.host.renderPercentage(settings.trigger, locale.selected, true)
                : parent.host.engine.i18n("ui.infinity"),
            ]),
            settings.trigger !== -1 ? parent.host.renderPercentage(settings.trigger) : "",
            parent.host.engine.i18n("ui.trigger.section.promptExplainer"),
          );

          if (value === undefined) {
            return;
          }

          if (value === "" || value.startsWith("-")) {
            settings.trigger = -1;
            return;
          }

          settings.trigger = parent.host.parsePercentage(value);
        },
      }),
    );

    this.addChildren([
      new SettingsList(parent, {
        children: [
          new HeaderListItem(parent, parent.host.engine.i18n("$workshop.chronoforge.label")),
          ...parent.host.game.time.chronoforgeUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(building =>
              BuildSectionTools.getBuildOption(
                parent,
                this.setting.buildings[building.name],
                locale,
                this.setting,
                building.label,
                label,
                {
                  delimiter:
                    building.name === parent.host.game.time.chronoforgeUpgrades.at(-1)?.name,
                },
              ),
            ),

          new HeaderListItem(parent, parent.host.engine.i18n("$science.voidSpace.label")),
          ...parent.host.game.time.voidspaceUpgrades
            .filter(item => item.name in this.setting.buildings)
            .map(building =>
              BuildSectionTools.getBuildOption(
                parent,
                this.setting.buildings[building.name as TimeItem],
                locale,
                this.setting,
                building.label,
                label,
              ),
            ),
        ],
      }),

      new SettingsList(parent, {
        children: [
          new HeaderListItem(parent, parent.host.engine.i18n("ui.additional")),
          new SettingListItem(
            parent,
            this.setting.fixCryochambers,
            parent.host.engine.i18n("option.fix.cry"),
            {
              onCheck: () => {
                parent.host.engine.imessage("status.sub.enable", [
                  parent.host.engine.i18n("option.fix.cry"),
                ]);
              },
              onUnCheck: () => {
                parent.host.engine.imessage("status.sub.disable", [
                  parent.host.engine.i18n("option.fix.cry"),
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
