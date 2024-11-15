import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { SupportedLanguage } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { SettingOptions } from "../settings/Settings.js";
import { CraftSettingsItem, WorkshopSettings } from "../settings/WorkshopSettings.js";
import { ucfirst } from "../tools/Format.js";
import { ResourceCraftable } from "../types/index.js";
import { UpgradeSettingsUi } from "./UpgradeSettingsUi.js";
import { Dialog } from "./components/Dialog.js";
import { SettingLimitedMaxTriggerListItem } from "./components/SettingLimitedMaxTriggerListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { UiComponent } from "./components/UiComponent.js";
import { PaddingButton } from "./components/buttons-icon/PaddingButton.js";

export class WorkshopSettingsUi extends SettingsPanel<WorkshopSettings> {
  private readonly _crafts: Array<SettingListItem>;

  constructor(
    host: KittenScientists,
    settings: WorkshopSettings,
    language: SettingOptions<SupportedLanguage>,
  ) {
    const label = host.engine.i18n("ui.craft");
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
      const element = new SettingLimitedMaxTriggerListItem(host, label, option, {
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
          element.triggerButton.inactive = option.trigger === -1;
        },
        onRefreshTrigger: () => {
          element.triggerButton.element[0].title = host.engine.i18n("ui.trigger", [
            option.trigger < 0
              ? settings.trigger < 0
                ? host.engine.i18n("ui.trigger.build.blocked", [label])
                : `${UiComponent.renderPercentage(settings.trigger)}% (${host.engine.i18n("ui.trigger.build.inherited")})`
              : `${UiComponent.renderPercentage(option.trigger)}%`,
          ]);
        },
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.prompt.percentage"),
            host.engine.i18n("ui.trigger.section.prompt", [
              label,
              option.trigger !== -1
                ? `${Dialog.renderPercentage(option.trigger)}%`
                : host.engine.i18n("ui.trigger.build.inherited"),
            ]),
            option.trigger !== -1 ? Dialog.renderPercentage(option.trigger) : "",
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

              option.trigger = UiComponent.parsePercentage(value);
            })
            .then(() => {
              element.refreshUi();
            })
            .catch(redirectErrorsToConsole(console));
        },
      });
      element.head.addChild(new PaddingButton(host));
      this._crafts.push(element);

      if (option.resource === "ship") {
        this._crafts.push(
          new SettingListItem(
            host,
            host.engine.i18n("option.shipOverride"),
            this.setting.shipOverride,
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
        children: [new UpgradeSettingsUi(host, this.setting.unlockUpgrades, language)],
        hasDisableAll: false,
        hasEnableAll: false,
      }),
    );
  }
}
