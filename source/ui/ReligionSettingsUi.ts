import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import { ReligionSettings } from "../settings/ReligionSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { ReligionOptions, UnicornItems, type ZigguratUpgrade } from "../types/index.js";
import { BuildSectionTools } from "./BuildSectionTools.js";
import stylesTimeSkipHeatSettings from "./TimeSkipHeatSettingsUi.module.css";
import stylesButton from "./components/Button.module.css";
import type { CollapsiblePanelOptions } from "./components/CollapsiblePanel.js";
import { Delimiter } from "./components/Delimiter.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingListItem, type SettingListItemOptions } from "./components/SettingListItem.js";
import type { SettingMaxTriggerListItem } from "./components/SettingMaxTriggerListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";

export class ReligionSettingsUi extends SettingsPanel<ReligionSettings, SettingTriggerListItem> {
  private readonly _unicornBuildings: Map<
    ZigguratUpgrade | "unicornPasture",
    SettingMaxTriggerListItem
  >;
  private readonly _bestUnicornBuilding: SettingListItem;

  constructor(
    parent: UiComponent,
    settings: ReligionSettings,
    locale: SettingOptions<SupportedLocale>,
    options?: CollapsiblePanelOptions & SettingListItemOptions,
  ) {
    const label = parent.host.engine.i18n("ui.faith");
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

    const unicornsArray: Array<ZigguratUpgrade | "unicornPasture"> = [...UnicornItems];

    this._unicornBuildings = new Map([
      [
        "unicornPasture",
        BuildSectionTools.getBuildOption(
          parent,
          this.setting.buildings.unicornPasture,
          locale,
          this.setting,
          parent.host.engine.i18n("$buildings.unicornPasture.label"),
          label,
        ),
      ],
      ...parent.host.game.religion.zigguratUpgrades
        .filter(
          item => unicornsArray.includes(item.name) && !isNil(this.setting.buildings[item.name]),
        )
        .map(
          zigguratUpgrade =>
            [
              zigguratUpgrade.name,
              BuildSectionTools.getBuildOption(
                parent,
                this.setting.buildings[zigguratUpgrade.name],
                locale,
                this.setting,
                zigguratUpgrade.label,
                label,
              ),
            ] as [ZigguratUpgrade | "unicornPasture", SettingMaxTriggerListItem],
        ),
    ]);

    this._bestUnicornBuilding = new SettingListItem(
      parent,
      this.setting.bestUnicornBuilding,
      parent.host.engine.i18n("option.faith.best.unicorn"),
      {
        onCheck: () => {
          parent.host.engine.imessage("status.sub.enable", [
            parent.host.engine.i18n("option.faith.best.unicorn"),
          ]);
          for (const building of this._unicornBuildings.values()) {
            building.setting.enabled = true;
            building.setting.max = -1;
            building.setting.trigger = -1;
          }
          this.refreshUi();
        },
        onUnCheck: () => {
          parent.host.engine.imessage("status.sub.disable", [
            parent.host.engine.i18n("option.faith.best.unicorn"),
          ]);
          this.refreshUi();
        },
        upgradeIndicator: true,
      },
    );

    this.addChildren([
      new SettingsList(parent, {
        children: [
          new HeaderListItem(parent, parent.host.engine.i18n("$religion.panel.ziggurat.label")),
          ...this._unicornBuildings.values(),
          this._bestUnicornBuilding,
          new Delimiter(parent),

          ...parent.host.game.religion.zigguratUpgrades
            .filter(
              item =>
                !unicornsArray.includes(item.name) && !isNil(this.setting.buildings[item.name]),
            )
            .map(upgrade =>
              BuildSectionTools.getBuildOption(
                parent,
                this.setting.buildings[upgrade.name],
                locale,
                this.setting,
                upgrade.label,
                label,
              ),
            ),
          new Delimiter(parent),

          new HeaderListItem(
            parent,
            parent.host.engine.i18n("$religion.panel.orderOfTheSun.label"),
          ),
          ...parent.host.game.religion.religionUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(upgrade =>
              BuildSectionTools.getBuildOption(
                parent,
                this.setting.buildings[upgrade.name],
                locale,
                this.setting,
                upgrade.label,
                label,
                {
                  delimiter:
                    upgrade.name === parent.host.game.religion.religionUpgrades.at(-1)?.name,
                },
              ),
            ),

          new HeaderListItem(
            parent,
            parent.host.engine.i18n("$religion.panel.cryptotheology.label"),
          ),
          ...parent.host.game.religion.transcendenceUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(upgrade =>
              BuildSectionTools.getBuildOption(
                parent,
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

      new SettingsList(parent, {
        children: [
          new HeaderListItem(parent, parent.host.engine.i18n("ui.additional")),
          ...ReligionOptions.map(item => {
            const label = parent.host.engine.i18n(`option.faith.${item}`);
            if (item === "transcend") {
              return new SettingListItem(parent, this.setting[item], label, {
                onCheck: () => {
                  parent.host.engine.imessage("status.sub.enable", [label]);
                },
                onUnCheck: () => {
                  parent.host.engine.imessage("status.sub.disable", [label]);
                },
              });
            }

            const element = new SettingTriggerListItem(parent, this.setting[item], locale, label, {
              classes: [stylesButton.lastHeadAction],
              onCheck: () => {
                parent.host.engine.imessage("status.sub.enable", [label]);
              },
              onUnCheck: () => {
                parent.host.engine.imessage("status.sub.disable", [label]);
              },
              onRefresh: () => {
                this.settingItem.triggerButton.inactive =
                  !this.setting[item].enabled || this.setting[item].trigger === -1;
              },
              onSetTrigger: async () => {
                const value = await Dialog.prompt(
                  parent,
                  parent.host.engine.i18n(
                    element.triggerButton.behavior === "integer"
                      ? "ui.trigger.setinteger"
                      : "ui.trigger.setpercentage",
                    [label],
                  ),
                  parent.host.engine.i18n("ui.trigger.build.prompt", [
                    label,
                    element.triggerButton.behavior === "integer"
                      ? parent.host.renderAbsolute(this.setting[item].trigger, locale.selected)
                      : parent.host.renderPercentage(
                          this.setting[item].trigger,
                          locale.selected,
                          true,
                        ),
                  ]),
                  element.triggerButton.behavior === "integer"
                    ? parent.host.renderAbsolute(this.setting[item].trigger)
                    : parent.host.renderPercentage(this.setting[item].trigger),
                  parent.host.engine.i18n(
                    element.triggerButton.behavior === "integer"
                      ? "ui.trigger.setinteger.promptExplainer"
                      : "ui.trigger.setpercentage.promptExplainer",
                  ),
                );

                if (value === undefined || value === "" || value.startsWith("-")) {
                  return;
                }

                this.setting[item].trigger =
                  (element.triggerButton.behavior === "integer"
                    ? parent.host.parseAbsolute(value)
                    : parent.host.parsePercentage(value)) ?? this.setting[item].trigger;
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
