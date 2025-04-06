import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { TimeItem, TimeSettings } from "../settings/TimeSettings.js";
import { BuildSectionTools } from "./BuildSectionTools.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import type { UiComponent } from "./components/UiComponent.js";

export class TimeSettingsUi extends SettingsPanel<TimeSettings, SettingTriggerListItem> {
  constructor(
    parent: UiComponent,
    settings: TimeSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = parent.host.engine.i18n("ui.time");
    super(
      parent,
      settings,
      new SettingTriggerListItem(parent, settings, locale, label, {
        onCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.enable", [label]);
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
        onUnCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.disable", [label]);
        },
        renderLabelTrigger: false,
      }),
    );

    this.addChildrenContent([
      new SettingsList(this).addChildren([
        new HeaderListItem(this, this.host.engine.i18n("$workshop.chronoforge.label")),
        ...this.host.game.time.chronoforgeUpgrades
          .filter(item => !isNil(this.setting.buildings[item.name]))
          .map(building =>
            BuildSectionTools.getBuildOption(
              this,
              this.setting.buildings[building.name],
              locale,
              this.setting,
              building.label,
              label,
              {
                delimiter: building.name === this.host.game.time.chronoforgeUpgrades.at(-1)?.name,
                renderLabelTrigger: false,
              },
            ),
          ),

        new HeaderListItem(this, this.host.engine.i18n("$science.voidSpace.label")),
        ...this.host.game.time.voidspaceUpgrades
          .filter(item => item.name in this.setting.buildings)
          .map(building =>
            BuildSectionTools.getBuildOption(
              this,
              this.setting.buildings[building.name as TimeItem],
              locale,
              this.setting,
              building.label,
              label,
              { renderLabelTrigger: false },
            ),
          ),
      ]),

      new SettingsList(this, {
        hasDisableAll: false,
        hasEnableAll: false,
      }).addChildren([
        new HeaderListItem(this, this.host.engine.i18n("ui.additional")),
        new SettingListItem(
          this,
          this.setting.fixCryochambers,
          this.host.engine.i18n("option.fix.cry"),
          {
            onCheck: () => {
              this.host.engine.imessage("status.sub.enable", [
                this.host.engine.i18n("option.fix.cry"),
              ]);
            },
            onUnCheck: () => {
              this.host.engine.imessage("status.sub.disable", [
                this.host.engine.i18n("option.fix.cry"),
              ]);
            },
          },
        ),
      ]),
    ]);
  }
}
