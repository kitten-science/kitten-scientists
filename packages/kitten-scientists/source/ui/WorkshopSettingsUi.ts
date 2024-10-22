import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { SupportedLanguage } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { SettingOptions } from "../settings/Settings.js";
import { CraftSettingsItem, WorkshopSettings } from "../settings/WorkshopSettings.js";
import { ucfirst } from "../tools/Format.js";
import { ResourceCraftable } from "../types/index.js";
import { UpgradeSettingsUi } from "./UpgradeSettingsUi.js";
import { SettingLimitedMaxListItem } from "./components/SettingLimitedMaxListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

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
      }),
    );

    let excludeCraftsArray: Array<ResourceCraftable> = [];
    if (!game.challenges.getChallenge("ironWill").active) {
      this.setting.resources.bloodstone.enabled = false;
      this.setting.resources.tMythril.enabled = false;
      excludeCraftsArray = ["bloodstone", "tMythril"];
    }

    const preparedCrafts: Array<[CraftSettingsItem, string]> = this._host.game.workshop.crafts
      .filter(
        item =>
          !excludeCraftsArray.includes(item.name) && !isNil(this.setting.resources[item.name]),
      )
      .map(resource => [this.setting.resources[resource.name], ucfirst(resource.label)]);

    this._crafts = [];
    for (const [setting, label] of preparedCrafts) {
      this._crafts.push(
        this._getCraftOption(
          setting,
          label,
          setting.resource === "kerosene" || setting.resource === "blueprint",
        ),
      );
      if (setting.resource === "ship") {
        this._crafts.push(
          new SettingListItem(
            this._host,
            this._host.engine.i18n("option.shipOverride"),
            this.setting.shipOverride,
            {
              onCheck: () => {
                this._host.engine.imessage("status.sub.enable", [
                  this._host.engine.i18n("option.shipOverride"),
                ]);
              },
              onUnCheck: () => {
                this._host.engine.imessage("status.sub.disable", [
                  this._host.engine.i18n("option.shipOverride"),
                ]);
              },
              upgradeIndicator: true,
            },
          ),
        );
      }
    }

    const listCrafts = new SettingsList(this._host, {
      children: this._crafts,
      onReset: () => {
        this.setting.load({ resources: new WorkshopSettings().resources });
        this.refreshUi();
      },
    });
    this.addChild(listCrafts);

    this.addChild(
      new SettingsList(this._host, {
        children: [new UpgradeSettingsUi(this._host, this.setting.unlockUpgrades, language)],
        hasDisableAll: false,
        hasEnableAll: false,
      }),
    );
  }

  private _getCraftOption(
    option: CraftSettingsItem,
    label: string,
    delimiter = false,
    upgradeIndicator = false,
  ) {
    return new SettingLimitedMaxListItem(this._host, label, option, {
      delimiter,
      onCheck: () => {
        this._host.engine.imessage("status.sub.enable", [label]);
      },
      onUnCheck: () => {
        this._host.engine.imessage("status.sub.disable", [label]);
      },
      onLimitedCheck: () => {
        this._host.engine.imessage("craft.limited", [label]);
      },
      onLimitedUnCheck: () => {
        this._host.engine.imessage("craft.unlimited", [label]);
      },
      upgradeIndicator,
    });
  }
}
