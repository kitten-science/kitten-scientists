import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../KittenScientists.js";
import { ReligionOptions, ReligionSettings, UnicornItems } from "../settings/ReligionSettings.js";
import { ZiggurathUpgrade } from "../types/index.js";
import { AbstractBuildSettingsPanel } from "./SettingsSectionUi.js";
import { Delimiter } from "./components/Delimiter.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingMaxListItem } from "./components/SettingMaxListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";

export class ReligionSettingsUi extends AbstractBuildSettingsPanel<ReligionSettings> {
  private readonly _unicornBuildings: Array<SettingMaxListItem>;
  private readonly _bestUnicornBuilding: SettingListItem;

  constructor(host: KittenScientists, settings: ReligionSettings) {
    const label = host.engine.i18n("ui.faith");
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

    const unicornsArray: Array<ZiggurathUpgrade | "unicornPasture"> = [...UnicornItems];

    this._unicornBuildings = host.game.religion.zigguratUpgrades
      .filter(
        item => unicornsArray.includes(item.name) && !isNil(this.setting.buildings[item.name]),
      )
      .map(zigguratUpgrade =>
        this._getBuildOption(this.setting.buildings[zigguratUpgrade.name], zigguratUpgrade.label),
      );

    this._bestUnicornBuilding = new SettingListItem(
      host,
      host.engine.i18n("option.faith.best.unicorn"),
      this.setting.bestUnicornBuilding,
      {
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [
            host.engine.i18n("option.faith.best.unicorn"),
          ]);
          for (const building of this._unicornBuildings) {
            building.setting.enabled = true;
            building.setting.max = -1;
          }
          this.refreshUi();
        },
        onUnCheck: () => {
          host.engine.imessage("status.sub.disable", [
            host.engine.i18n("option.faith.best.unicorn"),
          ]);
          this.refreshUi();
        },
        upgradeIndicator: true,
      },
    );

    this.addChildren([
      new SettingsList(host, {
        children: [
          new HeaderListItem(host, host.engine.i18n("$religion.panel.ziggurat.label")),
          this._getBuildOption(
            this.setting.buildings.unicornPasture,
            host.engine.i18n("$buildings.unicornPasture.label"),
          ),

          ...this._unicornBuildings,
          this._bestUnicornBuilding,
          new Delimiter(host),

          ...host.game.religion.zigguratUpgrades
            .filter(
              item =>
                !unicornsArray.includes(item.name) && !isNil(this.setting.buildings[item.name]),
            )
            .map(upgrade =>
              this._getBuildOption(this.setting.buildings[upgrade.name], upgrade.label),
            ),
          new Delimiter(host),

          new HeaderListItem(host, host.engine.i18n("$religion.panel.orderOfTheSun.label")),
          ...host.game.religion.religionUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(upgrade =>
              this._getBuildOption(
                this.setting.buildings[upgrade.name],
                upgrade.label,
                upgrade.name === host.game.religion.religionUpgrades.at(-1)?.name,
              ),
            ),

          new HeaderListItem(host, host.engine.i18n("$religion.panel.cryptotheology.label")),
          ...host.game.religion.transcendenceUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(upgrade =>
              this._getBuildOption(this.setting.buildings[upgrade.name], upgrade.label),
            ),
        ],
        onEnableAll: () => {
          this.refreshUi();
        },
        onDisableAll: () => {
          this.refreshUi();
        },
        onReset: () => {
          const defaults = new ReligionSettings();
          this.setting.load({
            buildings: defaults.buildings,
            bestUnicornBuilding: defaults.bestUnicornBuilding,
          });
          this.refreshUi();
        },
      }),

      new SettingsList(host, {
        children: [
          new HeaderListItem(host, host.engine.i18n("ui.additional")),
          ...ReligionOptions.map(item => {
            const label = host.engine.i18n(`option.faith.${item}`);
            if (item === "transcend") {
              return new SettingListItem(host, label, this.setting[item], {
                onCheck: () => {
                  host.engine.imessage("status.sub.enable", [label]);
                },
                onUnCheck: () => {
                  host.engine.imessage("status.sub.disable", [label]);
                },
              });
            }
            return new SettingTriggerListItem(host, label, this.setting[item], {
              onCheck: () => {
                host.engine.imessage("status.sub.enable", [label]);
              },
              onUnCheck: () => {
                host.engine.imessage("status.sub.disable", [label]);
              },
            });
          }),
        ],
        hasDisableAll: false,
        hasEnableAll: false,
      }),
    ]);
  }

  refreshUi() {
    for (const building of this._unicornBuildings) {
      building.readOnly = this._bestUnicornBuilding.setting.enabled;
      building.maxButton.readOnly = this._bestUnicornBuilding.setting.enabled;
    }
    super.refreshUi();
  }
}
