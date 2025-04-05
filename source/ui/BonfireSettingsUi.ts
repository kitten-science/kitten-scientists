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
import { SettingListItem, type SettingListItemOptions } from "./components/SettingListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, type SettingsPanelOptions } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";

export class BonfireSettingsUi extends SettingsPanel<BonfireSettings, SettingTriggerListItem> {
  constructor(
    parent: UiComponent,
    settings: BonfireSettings,
    locale: SettingOptions<SupportedLocale>,
    options?: SettingsPanelOptions<SettingTriggerListItem> & SettingListItemOptions,
  ) {
    const label = parent.host.engine.i18n("ui.build");
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
          const element = this.settingItem;
          element.triggerButton.inactive = !settings.enabled || settings.trigger < 0;
          element.triggerButton.ineffective =
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
          const element = this.settingItem;
          element.triggerButton.element[0].title = parent.host.engine.i18n("ui.trigger.section", [
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

    // Post-super() child insertion, so we can use this._getBuildOptions().
    // We want the ability to use `this` in our callbacks, to construct more complex
    // usage scenarios where we need access to the entire UI section.
    this.addChildren([
      new SettingsList(parent, {
        children: coalesceArray(
          parent.host.game.bld.buildingGroups.flatMap(buildingGroup => [
            new HeaderListItem(parent, buildingGroup.title),
            ...buildingGroup.buildings.flatMap(building =>
              this._getBuildOptions(parent, settings, locale, label, building),
            ),
            buildingGroup !==
            parent.host.game.bld.buildingGroups[parent.host.game.bld.buildingGroups.length - 1]
              ? new Delimiter(parent)
              : undefined,
          ]),
        ),
        onReset: () => {
          this.setting.load({ buildings: new BonfireSettings().buildings });
          this.refreshUi();
        },
      }),
      new SettingsList(parent, {
        children: [
          new HeaderListItem(parent, parent.host.engine.i18n("ui.additional")),
          new SettingListItem(
            parent,
            settings.gatherCatnip,
            parent.host.engine.i18n("option.catnip"),
            {
              onCheck: () => {
                parent.host.engine.imessage("status.sub.enable", [
                  parent.host.engine.i18n("option.catnip"),
                ]);
              },
              onUnCheck: () => {
                parent.host.engine.imessage("status.sub.disable", [
                  parent.host.engine.i18n("option.catnip"),
                ]);
              },
            },
          ),
          new SettingListItem(
            parent,
            settings.turnOnSteamworks,
            parent.host.engine.i18n("option.steamworks"),
            {
              onCheck: () => {
                parent.host.engine.imessage("status.sub.enable", [
                  parent.host.engine.i18n("option.steamworks"),
                ]);
              },
              onUnCheck: () => {
                parent.host.engine.imessage("status.sub.disable", [
                  parent.host.engine.i18n("option.steamworks"),
                ]);
              },
            },
          ),
          new SettingListItem(
            parent,
            settings.turnOnMagnetos,
            parent.host.engine.i18n("option.magnetos"),
            {
              onCheck: () => {
                parent.host.engine.imessage("status.sub.enable", [
                  parent.host.engine.i18n("option.magnetos"),
                ]);
              },
              onUnCheck: () => {
                parent.host.engine.imessage("status.sub.disable", [
                  parent.host.engine.i18n("option.magnetos"),
                ]);
              },
            },
          ),
          new SettingListItem(
            parent,
            settings.turnOnReactors,
            parent.host.engine.i18n("option.reactors"),
            {
              onCheck: () => {
                parent.host.engine.imessage("status.sub.enable", [
                  parent.host.engine.i18n("option.reactors"),
                ]);
              },
              onUnCheck: () => {
                parent.host.engine.imessage("status.sub.disable", [
                  parent.host.engine.i18n("option.reactors"),
                ]);
              },
            },
          ),
          new BuildingUpgradeSettingsUi(parent, settings.upgradeBuildings, locale, settings),
        ],
        hasDisableAll: false,
        hasEnableAll: false,
      }),
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
          {
            onCheck: () => {
              this.refreshUi();
            },
            onUnCheck: () => {
              this.refreshUi();
            },
          },
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
            onCheck: () => {
              this.refreshUi();
            },
            onUnCheck: () => {
              this.refreshUi();
            },
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
          {
            onCheck: () => {
              this.refreshUi();
            },
            onUnCheck: () => {
              this.refreshUi();
            },
          },
        ),
      ];
    }

    return [];
  }
}
