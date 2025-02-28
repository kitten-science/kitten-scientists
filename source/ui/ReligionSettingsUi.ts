import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import { ReligionOptions, ReligionSettings, UnicornItems } from "../settings/ReligionSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { ZiggurathUpgrade } from "../types/index.js";
import { BuildSectionTools } from "./BuildSectionTools.js";
import stylesTimeSkipHeatSettings from "./TimeSkipHeatSettingsUi.module.css";
import stylesButton from "./components/Button.module.css";
import { Delimiter } from "./components/Delimiter.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import type { SettingMaxTriggerListItem } from "./components/SettingMaxTriggerListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

export class ReligionSettingsUi extends SettingsPanel<ReligionSettings> {
  private readonly _unicornBuildings: Map<
    ZiggurathUpgrade | "unicornPasture",
    SettingMaxTriggerListItem
  >;
  private readonly _bestUnicornBuilding: SettingListItem;

  constructor(
    host: KittenScientists,
    settings: ReligionSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = host.engine.i18n("ui.faith");
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

    const unicornsArray: Array<ZiggurathUpgrade | "unicornPasture"> = [...UnicornItems];

    this._unicornBuildings = new Map([
      [
        "unicornPasture",
        BuildSectionTools.getBuildOption(
          host,
          this.setting.buildings.unicornPasture,
          locale,
          this.setting,
          host.engine.i18n("$buildings.unicornPasture.label"),
          label,
        ),
      ],
      ...host.game.religion.zigguratUpgrades
        .filter(
          item => unicornsArray.includes(item.name) && !isNil(this.setting.buildings[item.name]),
        )
        .map(
          zigguratUpgrade =>
            [
              zigguratUpgrade.name,
              BuildSectionTools.getBuildOption(
                host,
                this.setting.buildings[zigguratUpgrade.name],
                locale,
                this.setting,
                zigguratUpgrade.label,
                label,
              ),
            ] as [ZiggurathUpgrade | "unicornPasture", SettingMaxTriggerListItem],
        ),
    ]);

    this._bestUnicornBuilding = new SettingListItem(
      host,
      this.setting.bestUnicornBuilding,
      host.engine.i18n("option.faith.best.unicorn"),
      {
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [
            host.engine.i18n("option.faith.best.unicorn"),
          ]);
          for (const building of this._unicornBuildings.values()) {
            building.setting.enabled = true;
            building.setting.max = -1;
            building.setting.trigger = -1;
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
          ...this._unicornBuildings.values(),
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
                locale,
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
                locale,
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
                locale,
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
              return new SettingListItem(host, this.setting[item], label, {
                onCheck: () => {
                  host.engine.imessage("status.sub.enable", [label]);
                },
                onUnCheck: () => {
                  host.engine.imessage("status.sub.disable", [label]);
                },
              });
            }

            const element = new SettingTriggerListItem(host, this.setting[item], locale, label, {
              classes: [stylesButton.lastHeadAction],
              onCheck: () => {
                host.engine.imessage("status.sub.enable", [label]);
              },
              onUnCheck: () => {
                host.engine.imessage("status.sub.disable", [label]);
              },
              onRefresh: element => {
                (element as SettingTriggerListItem).triggerButton.inactive =
                  !this.setting[item].enabled || this.setting[item].trigger === -1;
              },
              onSetTrigger: () => {
                Dialog.prompt(
                  host,
                  host.engine.i18n(
                    element.triggerButton.behavior === "integer"
                      ? "ui.trigger.setinteger"
                      : "ui.trigger.setpercentage",
                    [label],
                  ),
                  host.engine.i18n("ui.trigger.build.prompt", [
                    label,
                    element.triggerButton.behavior === "integer"
                      ? host.renderAbsolute(this.setting[item].trigger, locale.selected)
                      : host.renderPercentage(this.setting[item].trigger, locale.selected, true),
                  ]),
                  element.triggerButton.behavior === "integer"
                    ? host.renderAbsolute(this.setting[item].trigger)
                    : host.renderPercentage(this.setting[item].trigger),
                  host.engine.i18n(
                    element.triggerButton.behavior === "integer"
                      ? "ui.trigger.setinteger.promptExplainer"
                      : "ui.trigger.setpercentage.promptExplainer",
                  ),
                )
                  .then(value => {
                    if (value === undefined || value === "" || value.startsWith("-")) {
                      return;
                    }

                    this.setting[item].trigger =
                      (element.triggerButton.behavior === "integer"
                        ? host.parseAbsolute(value)
                        : host.parsePercentage(value)) ?? this.setting[item].trigger;
                  })
                  .then(() => {
                    this.refreshUi();
                  })
                  .catch(redirectErrorsToConsole(console));
              },
            });
            element.triggerButton.element.addClass(stylesButton.lastHeadAction);
            return element;
          }),
        ],
        hasDisableAll: false,
        hasEnableAll: false,
      }),
    ]);
  }

  override refreshUi() {
    for (const [buildingName, building] of this._unicornBuildings.entries()) {
      building.readOnly = this._bestUnicornBuilding.setting.enabled;
      building.maxButton.readOnly = this._bestUnicornBuilding.setting.enabled;
      building.triggerButton.readOnly = this._bestUnicornBuilding.setting.enabled;

      building.elementLabel.attr("data-ks-active-from", "❊");
      building.elementLabel.attr("data-ks-active-to", "✮");

      if (
        this.setting.bestUnicornBuilding.enabled &&
        this.setting.bestUnicornBuildingCurrent === buildingName
      ) {
        building.elementLabel.addClass(stylesTimeSkipHeatSettings.active);
      } else {
        building.elementLabel.removeClass(stylesTimeSkipHeatSettings.active);
      }
    }
    super.refreshUi();
  }
}
