import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { KittenScientists } from "../KittenScientists.js";
import { ReligionOptions, ReligionSettings, UnicornItems } from "../settings/ReligionSettings.js";
import { ZiggurathUpgrade } from "../types/index.js";
import { BuildSectionTools } from "./BuildSectionTools.js";
import { Delimiter } from "./components/Delimiter.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingTriggerMaxListItem } from "./components/SettingTriggerMaxListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { UiComponent } from "./components/UiComponent.js";

export class ReligionSettingsUi extends SettingsPanel<ReligionSettings> {
  private readonly _unicornBuildings: Array<SettingTriggerMaxListItem>;
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

    const unicornsArray: Array<ZiggurathUpgrade | "unicornPasture"> = [...UnicornItems];

    this._unicornBuildings = host.game.religion.zigguratUpgrades
      .filter(
        item => unicornsArray.includes(item.name) && !isNil(this.setting.buildings[item.name]),
      )
      .map(zigguratUpgrade =>
        BuildSectionTools.getBuildOption(
          host,
          this.setting.buildings[zigguratUpgrade.name],
          this.setting,
          zigguratUpgrade.label,
          label,
        ),
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
          BuildSectionTools.getBuildOption(
            host,
            this.setting.buildings.unicornPasture,
            this.setting,
            host.engine.i18n("$buildings.unicornPasture.label"),
            label,
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
              BuildSectionTools.getBuildOption(
                host,
                this.setting.buildings[upgrade.name],
                this.setting,
                upgrade.label,
                label,
              ),
            ),
          new Delimiter(host),

          new HeaderListItem(host, host.engine.i18n("$religion.panel.orderOfTheSun.label")),
          ...host.game.religion.religionUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(upgrade =>
              BuildSectionTools.getBuildOption(
                host,
                this.setting.buildings[upgrade.name],
                this.setting,
                upgrade.label,
                label,
                upgrade.name === host.game.religion.religionUpgrades.at(-1)?.name,
              ),
            ),

          new HeaderListItem(host, host.engine.i18n("$religion.panel.cryptotheology.label")),
          ...host.game.religion.transcendenceUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(upgrade =>
              BuildSectionTools.getBuildOption(
                host,
                this.setting.buildings[upgrade.name],
                this.setting,
                upgrade.label,
                label,
              ),
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
