import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import { ReligionSettings } from "../settings/ReligionSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { ReligionOptions, UnicornItems, type ZigguratUpgrade } from "../types/index.js";
import { BuildSectionTools } from "./BuildSectionTools.js";
import stylesButton from "./components/Button.module.css";
import { Delimiter } from "./components/Delimiter.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import type { SettingMaxTriggerListItem } from "./components/SettingMaxTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import type { UiComponent } from "./components/UiComponent.js";
import stylesTimeSkipHeatSettings from "./TimeSkipHeatSettingsUi.module.css";

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
  ) {
    const label = parent.host.engine.i18n("ui.faith");
    super(
      parent,
      settings,
      new SettingTriggerListItem(parent, settings, locale, label, {
        onCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.enable", [label]);
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
      {
        onRefresh: () => {
          for (const [buildingName, building] of this._unicornBuildings.entries()) {
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
        },
        onRefreshRequest: () => {
          this.settingItem.triggerButton.inactive = !settings.enabled || settings.trigger === -1;
          this.settingItem.triggerButton.ineffective =
            settings.enabled &&
            settings.trigger < 0 &&
            Object.values(settings.buildings).some(_ => _.enabled && 0 < _.max && _.trigger < 0);

          this.expando.ineffective =
            settings.enabled &&
            Object.values(settings.buildings).some(
              _ => _.enabled && (0 === _.max || (0 < _.trigger && 0 < settings.trigger)),
            );

          for (const [_, building] of this._unicornBuildings.entries()) {
            building.readOnly = this._bestUnicornBuilding.setting.enabled;
            building.maxButton.readOnly = this._bestUnicornBuilding.setting.enabled;
            building.triggerButton.readOnly = this._bestUnicornBuilding.setting.enabled;
          }
        },
      },
    );

    const unicornsArray: Array<ZigguratUpgrade | "unicornPasture"> = [...UnicornItems];

    this._unicornBuildings = new Map([
      [
        "unicornPasture",
        BuildSectionTools.getBuildOption(
          this,
          this.setting.buildings.unicornPasture,
          locale,
          this.setting,
          this.host.engine.i18n("$buildings.unicornPasture.label"),
          label,
          { renderLabelTrigger: false },
        ),
      ],
      ...this.host.game.religion.zigguratUpgrades
        .filter(
          item => unicornsArray.includes(item.name) && !isNil(this.setting.buildings[item.name]),
        )
        .map(
          zigguratUpgrade =>
            [
              zigguratUpgrade.name,
              BuildSectionTools.getBuildOption(
                this,
                this.setting.buildings[zigguratUpgrade.name],
                locale,
                this.setting,
                zigguratUpgrade.label,
                label,
                { renderLabelTrigger: false },
              ),
            ] as [ZigguratUpgrade | "unicornPasture", SettingMaxTriggerListItem],
        ),
    ]);

    this._bestUnicornBuilding = new SettingListItem(
      this,
      this.setting.bestUnicornBuilding,
      this.host.engine.i18n("option.faith.best.unicorn"),
      {
        onCheck: () => {
          this.host.engine.imessage("status.sub.enable", [
            this.host.engine.i18n("option.faith.best.unicorn"),
          ]);
          for (const building of this._unicornBuildings.values()) {
            building.setting.enabled = true;
            building.setting.max = -1;
            building.setting.trigger = -1;
          }
        },
        onUnCheck: () => {
          this.host.engine.imessage("status.sub.disable", [
            this.host.engine.i18n("option.faith.best.unicorn"),
          ]);
        },
        upgradeIndicator: true,
      },
    );

    this.addChildrenContent([
      new SettingsList(this, {
        onReset: () => {
          const defaults = new ReligionSettings();
          this.setting.load({
            bestUnicornBuilding: defaults.bestUnicornBuilding,
            buildings: defaults.buildings,
          });
        },
      }).addChildren([
        new HeaderListItem(this, this.host.engine.i18n("$religion.panel.ziggurat.label")),
        ...this._unicornBuildings.values(),
        this._bestUnicornBuilding,
        new Delimiter(this),

        ...this.host.game.religion.zigguratUpgrades
          .filter(
            item => !unicornsArray.includes(item.name) && !isNil(this.setting.buildings[item.name]),
          )
          .map(upgrade =>
            BuildSectionTools.getBuildOption(
              this,
              this.setting.buildings[upgrade.name],
              locale,
              this.setting,
              upgrade.label,
              label,
              { renderLabelTrigger: false },
            ),
          ),
        new Delimiter(this),

        new HeaderListItem(this, this.host.engine.i18n("$religion.panel.orderOfTheSun.label")),
        ...this.host.game.religion.religionUpgrades
          .filter(item => !isNil(this.setting.buildings[item.name]))
          .map(upgrade =>
            BuildSectionTools.getBuildOption(
              this,
              this.setting.buildings[upgrade.name],
              locale,
              this.setting,
              upgrade.label,
              label,
              {
                delimiter: upgrade.name === this.host.game.religion.religionUpgrades.at(-1)?.name,
                renderLabelTrigger: false,
              },
            ),
          ),

        new HeaderListItem(this, this.host.engine.i18n("$religion.panel.cryptotheology.label")),
        ...this.host.game.religion.transcendenceUpgrades
          .filter(item => !isNil(this.setting.buildings[item.name]))
          .map(upgrade =>
            BuildSectionTools.getBuildOption(
              this,
              this.setting.buildings[upgrade.name],
              locale,
              this.setting,
              upgrade.label,
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
        ...ReligionOptions.map(item => {
          const label = this.host.engine.i18n(`option.faith.${item}`);
          if (item === "transcend") {
            return new SettingListItem(this, this.setting[item], label, {
              onCheck: () => {
                this.host.engine.imessage("status.sub.enable", [label]);
              },
              onUnCheck: () => {
                this.host.engine.imessage("status.sub.disable", [label]);
              },
            });
          }

          const element = new SettingTriggerListItem(this, this.setting[item], locale, label, {
            classes: [stylesButton.lastHeadAction],
            onCheck: () => {
              this.host.engine.imessage("status.sub.enable", [label]);
            },
            onRefresh: () => {
              element.triggerButton.inactive =
                !this.setting[item].enabled || this.setting[item].trigger === -1;
            },
            onSetTrigger: async () => {
              const value = await Dialog.prompt(
                this,
                this.host.engine.i18n(
                  element.triggerButton.behavior === "integer"
                    ? "ui.trigger.setinteger"
                    : "ui.trigger.setpercentage",
                  [label],
                ),
                this.host.engine.i18n("ui.trigger.build.prompt", [
                  label,
                  element.triggerButton.behavior === "integer"
                    ? this.host.renderAbsolute(this.setting[item].trigger, locale.selected)
                    : this.host.renderPercentage(this.setting[item].trigger, locale.selected, true),
                ]),
                element.triggerButton.behavior === "integer"
                  ? this.host.renderAbsolute(this.setting[item].trigger)
                  : this.host.renderPercentage(this.setting[item].trigger),
                this.host.engine.i18n(
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
                  ? this.host.parseAbsolute(value)
                  : this.host.parsePercentage(value)) ?? this.setting[item].trigger;
            },
            onUnCheck: () => {
              this.host.engine.imessage("status.sub.disable", [label]);
            },
          });
          element.triggerButton.element.addClass(stylesButton.lastHeadAction);
          return element;
        }),
      ]),
    ]);
  }
}
