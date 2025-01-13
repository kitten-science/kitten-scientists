import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { SupportedLocale } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { SettingOptions } from "../settings/Settings.js";
import { CraftSettingsItem, WorkshopSettings } from "../settings/WorkshopSettings.js";
import { ucfirst } from "../tools/Format.js";
import { ResourceCraftable } from "../types/index.js";
import { UpgradeSettingsUi } from "./UpgradeSettingsUi.js";
import { Dialog } from "./components/Dialog.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { WorkshopCraftListItem } from "./components/WorkshopCraftListItem.js";

export class WorkshopSettingsUi extends SettingsPanel<WorkshopSettings> {
  private readonly _crafts: Array<SettingListItem>;

  constructor(
    host: KittenScientists,
    settings: WorkshopSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = host.engine.i18n("ui.craft");
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
              : host.renderPercentage(settings.trigger, locale.selected, true),
          ]);
        },
        onSetTrigger: () => {
          Dialog.prompt(
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
          )
            .then(value => {
              if (value === undefined) {
                return;
              }

              if (value === "" || value.startsWith("-")) {
                settings.trigger = -1;
                return;
              }

              settings.trigger = host.parsePercentage(value);
            })
            .then(() => {
              this.refreshUi();
            })
            .catch(redirectErrorsToConsole(console));
        },
      }),
    );

    let excludeCraftsArray: Array<ResourceCraftable> = [];
    if (!game.challenges.getChallenge("ironWill").active) {
      this.setting.resources.bloodstone.enabled = false;
      this.setting.resources.tMythril.enabled = false;
      excludeCraftsArray = ["bloodstone", "tMythril"];
    }

    const preparedCrafts: Array<[CraftSettingsItem, string]> = host.game.workshop.crafts
      .filter(
        item =>
          !excludeCraftsArray.includes(item.name) && !isNil(this.setting.resources[item.name]),
      )
      .map(resource => [this.setting.resources[resource.name], ucfirst(resource.label)]);

    this._crafts = [];
    for (const [option, label] of preparedCrafts) {
      const element = new WorkshopCraftListItem(host, option, locale, label, {
        delimiter: option.resource === "kerosene" || option.resource === "blueprint",
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.sub.disable", [label]);
        },
        onLimitedCheck: () => {
          host.engine.imessage("craft.limited", [label]);
        },
        onLimitedUnCheck: () => {
          host.engine.imessage("craft.unlimited", [label]);
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
          element.maxButton.updateLabel(host.renderAbsolute(option.max));
          element.maxButton.element[0].title =
            option.max < 0
              ? host.engine.i18n("ui.max.craft.titleInfinite", [label])
              : option.max === 0
                ? host.engine.i18n("ui.max.craft.titleZero", [label])
                : host.engine.i18n("ui.max.craft.title", [host.renderAbsolute(option.max), label]);
        },
        onRefreshTrigger: () => {
          element.triggerButton.element[0].title = host.engine.i18n("ui.trigger", [
            option.trigger < 0
              ? settings.trigger < 0
                ? host.engine.i18n("ui.trigger.build.blocked", [label])
                : `${host.renderPercentage(settings.trigger, locale.selected, true)} (${host.engine.i18n("ui.trigger.build.inherited")})`
              : host.renderPercentage(option.trigger, locale.selected, true),
          ]);
        },
        onSetMax: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.max.craft.prompt", [label]),
            host.engine.i18n("ui.max.craft.promptTitle", [
              label,
              host.renderAbsolute(option.max, locale.selected),
            ]),
            host.renderAbsolute(option.max),
            host.engine.i18n("ui.max.craft.promptExplainer"),
          )
            .then(value => {
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

              option.max = host.parseAbsolute(value) ?? option.max;
            })
            .then(() => {
              this.refreshUi();
            })
            .catch(redirectErrorsToConsole(console));
        },
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.prompt.percentage"),
            host.engine.i18n("ui.trigger.section.prompt", [
              label,
              option.trigger !== -1
                ? host.renderPercentage(option.trigger, locale.selected, true)
                : host.engine.i18n("ui.trigger.build.inherited"),
            ]),
            option.trigger !== -1 ? host.renderPercentage(option.trigger) : "",
            host.engine.i18n("ui.trigger.build.promptExplainer"),
          )
            .then(value => {
              if (value === undefined) {
                return;
              }

              if (value === "" || value.startsWith("-")) {
                option.trigger = -1;
                return;
              }

              option.trigger = host.parsePercentage(value);
            })
            .then(() => {
              element.refreshUi();
            })
            .catch(redirectErrorsToConsole(console));
        },
      });
      this._crafts.push(element);

      if (option.resource === "ship") {
        this._crafts.push(
          new SettingListItem(
            host,
            this.setting.shipOverride,
            host.engine.i18n("option.shipOverride"),
            {
              onCheck: () => {
                host.engine.imessage("status.sub.enable", [
                  host.engine.i18n("option.shipOverride"),
                ]);
              },
              onUnCheck: () => {
                host.engine.imessage("status.sub.disable", [
                  host.engine.i18n("option.shipOverride"),
                ]);
              },
              upgradeIndicator: true,
            },
          ),
        );
      }
    }

    const listCrafts = new SettingsList(host, {
      children: this._crafts,
      onReset: () => {
        this.setting.load({ resources: new WorkshopSettings().resources });
        this.refreshUi();
      },
    });
    this.addChild(listCrafts);

    this.addChild(
      new SettingsList(host, {
        children: [new UpgradeSettingsUi(host, this.setting.unlockUpgrades, locale)],
        hasDisableAll: false,
        hasEnableAll: false,
      }),
    );
  }
}
