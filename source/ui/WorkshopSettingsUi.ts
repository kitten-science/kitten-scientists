import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import type { SettingOptions } from "../settings/Settings.js";
import { type CraftSettingsItem, WorkshopSettings } from "../settings/WorkshopSettings.js";
import { ucfirst } from "../tools/Format.js";
import type { ResourceCraftable } from "../types/index.js";
import { UpgradeSettingsUi } from "./UpgradeSettingsUi.js";
import type { CollapsiblePanelOptions } from "./components/CollapsiblePanel.js";
import { Dialog } from "./components/Dialog.js";
import { SettingListItem, type SettingListItemOptions } from "./components/SettingListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";
import { WorkshopCraftListItem } from "./components/WorkshopCraftListItem.js";

export class WorkshopSettingsUi extends SettingsPanel<WorkshopSettings, SettingTriggerListItem> {
  private readonly _crafts: Array<SettingListItem>;

  constructor(
    parent: UiComponent,
    settings: WorkshopSettings,
    locale: SettingOptions<SupportedLocale>,
    options?: CollapsiblePanelOptions & SettingListItemOptions,
  ) {
    const label = parent.host.engine.i18n("ui.craft");
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

    let excludeCraftsArray: Array<ResourceCraftable> = [];
    if (!game.challenges.getChallenge("ironWill").active) {
      this.setting.resources.bloodstone.enabled = false;
      this.setting.resources.tMythril.enabled = false;
      excludeCraftsArray = ["bloodstone", "tMythril"];
    }

    const preparedCrafts: Array<[CraftSettingsItem, string]> = parent.host.game.workshop.crafts
      .filter(
        item =>
          !excludeCraftsArray.includes(item.name) && !isNil(this.setting.resources[item.name]),
      )
      .map(resource => [this.setting.resources[resource.name], ucfirst(resource.label)]);

    this._crafts = [];
    for (const [option, label] of preparedCrafts) {
      const onSetMax = async () => {
        const value = await Dialog.prompt(
          parent,
          parent.host.engine.i18n("ui.max.craft.prompt", [label]),
          parent.host.engine.i18n("ui.max.craft.promptTitle", [
            label,
            parent.host.renderAbsolute(option.max, locale.selected),
          ]),
          parent.host.renderAbsolute(option.max),
          parent.host.engine.i18n("ui.max.craft.promptExplainer"),
        );

        if (value === undefined) {
          return;
        }

        if (value === "" || value.startsWith("-")) {
          option.max = -1;
          return;
        }

        if (value === "0") {
          option.enabled = false;
        }

        option.max = parent.host.parseAbsolute(value) ?? option.max;
      };

      const element = new WorkshopCraftListItem(parent, option, locale, label, {
        delimiter: option.resource === "kerosene" || option.resource === "blueprint",
        onCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.sub.enable", [label]);
          if (option.max === 0 && !isBatchProcess) {
            onSetMax();
          }
        },
        onUnCheck: () => {
          parent.host.engine.imessage("status.sub.disable", [label]);
        },
        onLimitedCheck: () => {
          parent.host.engine.imessage("craft.limited", [label]);
        },
        onLimitedUnCheck: () => {
          parent.host.engine.imessage("craft.unlimited", [label]);
        },
        onRefresh: () => {
          element.limitedButton.inactive = !option.enabled || !option.limited;
          element.maxButton.inactive = !option.enabled || option.max === -1;
          element.maxButton.ineffective = settings.enabled && option.enabled && option.max === 0;
          element.triggerButton.inactive = !option.enabled || option.trigger === -1;
          element.triggerButton.ineffective =
            settings.enabled && option.enabled && settings.trigger === -1 && option.trigger === -1;
        },
        onRefreshMax: () => {
          element.maxButton.updateLabel(parent.host.renderAbsolute(option.max));
          element.maxButton.element[0].title =
            option.max < 0
              ? parent.host.engine.i18n("ui.max.craft.titleInfinite", [label])
              : option.max === 0
                ? parent.host.engine.i18n("ui.max.craft.titleZero", [label])
                : parent.host.engine.i18n("ui.max.craft.title", [
                    parent.host.renderAbsolute(option.max),
                    label,
                  ]);
        },
        onRefreshTrigger: () => {
          element.triggerButton.element[0].title = parent.host.engine.i18n("ui.trigger", [
            option.trigger < 0
              ? settings.trigger < 0
                ? parent.host.engine.i18n("ui.trigger.build.blocked", [label])
                : `${parent.host.renderPercentage(settings.trigger, locale.selected, true)} (${parent.host.engine.i18n("ui.trigger.build.inherited")})`
              : parent.host.renderPercentage(option.trigger, locale.selected, true),
          ]);
        },
        onSetMax,
        onSetTrigger: async () => {
          const value = await Dialog.prompt(
            parent,
            parent.host.engine.i18n("ui.trigger.prompt.percentage"),
            parent.host.engine.i18n("ui.trigger.section.prompt", [
              label,
              option.trigger !== -1
                ? parent.host.renderPercentage(option.trigger, locale.selected, true)
                : parent.host.engine.i18n("ui.trigger.build.inherited"),
            ]),
            option.trigger !== -1 ? parent.host.renderPercentage(option.trigger) : "",
            parent.host.engine.i18n("ui.trigger.build.promptExplainer"),
          );

          if (value === undefined) {
            return;
          }

          if (value === "" || value.startsWith("-")) {
            option.trigger = -1;
            return;
          }

          option.trigger = parent.host.parsePercentage(value);
        },
      });
      this._crafts.push(element);

      if (option.resource === "ship") {
        this._crafts.push(
          new SettingListItem(
            parent,
            this.setting.shipOverride,
            parent.host.engine.i18n("option.shipOverride"),
            {
              onCheck: () => {
                parent.host.engine.imessage("status.sub.enable", [
                  parent.host.engine.i18n("option.shipOverride"),
                ]);
              },
              onUnCheck: () => {
                parent.host.engine.imessage("status.sub.disable", [
                  parent.host.engine.i18n("option.shipOverride"),
                ]);
              },
              upgradeIndicator: true,
            },
          ),
        );
      }
    }

    const listCrafts = new SettingsList(parent, {
      children: this._crafts,
      onReset: () => {
        this.setting.load({ resources: new WorkshopSettings().resources });
        this.refreshUi();
      },
    });
    this.addChild(listCrafts);

    this.addChild(
      new SettingsList(parent, {
        children: [new UpgradeSettingsUi(parent, this.setting.unlockUpgrades, locale)],
        hasDisableAll: false,
        hasEnableAll: false,
      }),
    );
  }
}
