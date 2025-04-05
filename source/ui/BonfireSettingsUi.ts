import { coalesceArray, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import { BonfireSettings } from "../settings/BonfireSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { Building, StagedBuilding } from "../types/index.js";
import { BuildSectionTools } from "./BuildSectionTools.js";
import { BuildingUpgradeSettingsUi } from "./BuildingUpgradeSettingsUi.js";
import { Delimiter } from "./components/Delimiter.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";

export class BonfireSettingsUi extends SettingsPanel<BonfireSettings, SettingTriggerListItem> {
  constructor(
    parent: UiComponent,
    settings: BonfireSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = parent.host.engine.i18n("ui.build");
    super(
      parent,
      settings,
      new SettingTriggerListItem(parent, settings, locale, label, {
        onCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.disable", [label]);
        },
        onRefresh: () => {
          this.settingItem.triggerButton.inactive = !settings.enabled || settings.trigger < 0;
          this.settingItem.triggerButton.ineffective =
            settings.enabled &&
            settings.trigger < 0 &&
            !Object.values(settings.buildings).some(_ => _.enabled && 0 < _.max && 0 <= _.trigger);

          this.expando.ineffective =
            settings.enabled &&
            !Object.values(settings.buildings).some(
              _ => _.enabled && 0 < _.max && (0 <= _.trigger || 0 <= settings.trigger),
            ) &&
            !settings.gatherCatnip.enabled &&
            !settings.turnOnMagnetos.enabled &&
            !settings.turnOnReactors.enabled &&
            !settings.turnOnSteamworks.enabled &&
            !settings.upgradeBuildings.enabled;
        },
        onRefreshTrigger: () => {
          this.settingItem.triggerButton.element[0].title = parent.host.engine.i18n(
            "ui.trigger.section",
            [
              settings.trigger < 0
                ? parent.host.engine.i18n("ui.trigger.section.inactive")
                : parent.host.renderPercentage(settings.trigger, locale.selected, true),
            ],
          );
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

    // Post-super() child insertion, so we can use this._getBuildOptions().
    // We want the ability to use `this` in our callbacks, to construct more complex
    // usage scenarios where we need access to the entire UI section.
    this.addChildren([
      new SettingsList(this, {
        onReset: () => {
          this.setting.load({ buildings: new BonfireSettings().buildings });
          this.refreshUi();
        },
      }).addChildren(
        coalesceArray(
          this.host.game.bld.buildingGroups.flatMap(buildingGroup => [
            new HeaderListItem(this, buildingGroup.title),
            ...buildingGroup.buildings.flatMap(building =>
              this._getBuildOptions(this, settings, locale, label, building),
            ),
            buildingGroup !==
            this.host.game.bld.buildingGroups[this.host.game.bld.buildingGroups.length - 1]
              ? new Delimiter(this)
              : undefined,
          ]),
        ),
      ),
      new SettingsList(this, {
        hasDisableAll: false,
        hasEnableAll: false,
      }).addChildren([
        new HeaderListItem(this, this.host.engine.i18n("ui.additional")),
        new SettingListItem(this, settings.gatherCatnip, this.host.engine.i18n("option.catnip"), {
          onCheck: () => {
            this.host.engine.imessage("status.sub.enable", [
              this.host.engine.i18n("option.catnip"),
            ]);
          },
          onUnCheck: () => {
            this.host.engine.imessage("status.sub.disable", [
              this.host.engine.i18n("option.catnip"),
            ]);
          },
        }),
        new SettingListItem(
          this,
          settings.turnOnSteamworks,
          this.host.engine.i18n("option.steamworks"),
          {
            onCheck: () => {
              this.host.engine.imessage("status.sub.enable", [
                this.host.engine.i18n("option.steamworks"),
              ]);
            },
            onUnCheck: () => {
              this.host.engine.imessage("status.sub.disable", [
                this.host.engine.i18n("option.steamworks"),
              ]);
            },
          },
        ),
        new SettingListItem(
          this,
          settings.turnOnMagnetos,
          this.host.engine.i18n("option.magnetos"),
          {
            onCheck: () => {
              this.host.engine.imessage("status.sub.enable", [
                this.host.engine.i18n("option.magnetos"),
              ]);
            },
            onUnCheck: () => {
              this.host.engine.imessage("status.sub.disable", [
                this.host.engine.i18n("option.magnetos"),
              ]);
            },
          },
        ),
        new SettingListItem(
          this,
          settings.turnOnReactors,
          this.host.engine.i18n("option.reactors"),
          {
            onCheck: () => {
              this.host.engine.imessage("status.sub.enable", [
                this.host.engine.i18n("option.reactors"),
              ]);
            },
            onUnCheck: () => {
              this.host.engine.imessage("status.sub.disable", [
                this.host.engine.i18n("option.reactors"),
              ]);
            },
          },
        ),
        new BuildingUpgradeSettingsUi(this, settings.upgradeBuildings, locale, settings),
      ]),
    ]);
  }

  private _getBuildOptions(
    parent: UiComponent,
    settings: BonfireSettings,
    locale: SettingOptions<SupportedLocale>,
    sectionLabel: string,
    building: Building,
  ) {
    if (building === "unicornPasture" || isNil(settings.buildings[building])) {
      return [];
    }

    const meta = parent.host.game.bld.getBuildingExt(building).meta;
    if (!isNil(meta.stages)) {
      const name = Object.values(settings.buildings).find(item => item.baseBuilding === building)
        ?.building as StagedBuilding;
      return [
        BuildSectionTools.getBuildOption(
          parent,
          settings.buildings[building],
          locale,
          settings,
          meta.stages[0].label,
          sectionLabel,
        ),
        BuildSectionTools.getBuildOption(
          parent,
          settings.buildings[name],
          locale,
          settings,
          meta.stages[1].label,
          sectionLabel,
          {
            upgradeIndicator: true,
          },
        ),
      ];
    }
    if (!isNil(meta.label)) {
      return [
        BuildSectionTools.getBuildOption(
          parent,
          settings.buildings[building],
          locale,
          settings,
          meta.label,
          sectionLabel,
        ),
      ];
    }

    return [];
  }
}
