import { coalesceArray, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { KittenScientists } from "../KittenScientists.js";
import { BonfireSettings } from "../settings/BonfireSettings.js";
import { Building, StagedBuilding } from "../types/index.js";
import { BuildSectionTools } from "./BuildSectionTools.js";
import { BuildingUpgradeSettingsUi } from "./BuildingUpgradeSettingsUi.js";
import { Delimiter } from "./components/Delimiter.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { UiComponent } from "./components/UiComponent.js";

export class BonfireSettingsUi extends SettingsPanel<BonfireSettings> {
  constructor(host: KittenScientists, settings: BonfireSettings) {
    const label = host.engine.i18n("ui.build");
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
          (item as SettingTriggerListItem).triggerButton.inactive =
            !settings.enabled || settings.trigger < 0;
        },
        onRefreshTrigger: item => {
          item.triggerButton.element[0].title = host.engine.i18n("ui.trigger.section", [
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

    // Post-super() child insertion, so we can use this._getBuildOptions().
    // We want the ability to use `this` in our callbacks, to construct more complex
    // usage scenarios where we need access to the entire UI section.
    this.addChildren([
      new SettingsList(host, {
        children: coalesceArray(
          host.game.bld.buildingGroups.flatMap(buildingGroup => [
            new HeaderListItem(host, buildingGroup.title),
            ...buildingGroup.buildings.flatMap(building =>
              this._getBuildOptions(host, settings, label, building),
            ),
            buildingGroup !== host.game.bld.buildingGroups[host.game.bld.buildingGroups.length - 1]
              ? new Delimiter(host)
              : undefined,
          ]),
        ),
        onReset: () => {
          this.setting.load({ buildings: new BonfireSettings().buildings });
          this.refreshUi();
        },
      }),
      new SettingsList(host, {
        children: [
          new HeaderListItem(host, host.engine.i18n("ui.additional")),
          new BuildingUpgradeSettingsUi(host, settings.upgradeBuildings),
          new SettingListItem(host, host.engine.i18n("option.catnip"), settings.gatherCatnip, {
            onCheck: () => {
              host.engine.imessage("status.sub.enable", [host.engine.i18n("option.catnip")]);
            },
            onUnCheck: () => {
              host.engine.imessage("status.sub.disable", [host.engine.i18n("option.catnip")]);
            },
          }),
          new SettingListItem(
            host,
            host.engine.i18n("option.steamworks"),
            settings.turnOnSteamworks,
            {
              onCheck: () => {
                host.engine.imessage("status.sub.enable", [host.engine.i18n("option.steamworks")]);
              },
              onUnCheck: () => {
                host.engine.imessage("status.sub.disable", [host.engine.i18n("option.steamworks")]);
              },
            },
          ),
          new SettingListItem(host, host.engine.i18n("option.magnetos"), settings.turnOnMagnetos, {
            onCheck: () => {
              host.engine.imessage("status.sub.enable", [host.engine.i18n("option.magnetos")]);
            },
            onUnCheck: () => {
              host.engine.imessage("status.sub.disable", [host.engine.i18n("option.magnetos")]);
            },
          }),
          new SettingListItem(host, host.engine.i18n("option.reactors"), settings.turnOnReactors, {
            onCheck: () => {
              host.engine.imessage("status.sub.enable", [host.engine.i18n("option.reactors")]);
            },
            onUnCheck: () => {
              host.engine.imessage("status.sub.disable", [host.engine.i18n("option.reactors")]);
            },
          }),
        ],
        hasDisableAll: false,
        hasEnableAll: false,
      }),
    ]);
  }

  private _getBuildOptions(
    host: KittenScientists,
    settings: BonfireSettings,
    sectionLabel: string,
    building: Building,
  ) {
    if (building === "unicornPasture" || isNil(settings.buildings[building])) {
      return [];
    }

    const meta = host.game.bld.getBuildingExt(building).meta;
    if (!isNil(meta.stages)) {
      const name = Object.values(settings.buildings).find(item => item.baseBuilding === building)
        ?.building as StagedBuilding;
      return [
        BuildSectionTools.getBuildOption(
          host,
          settings.buildings[building],
          settings,
          meta.stages[0].label,
          sectionLabel,
        ),
        BuildSectionTools.getBuildOption(
          host,
          settings.buildings[name],
          settings,
          meta.stages[1].label,
          sectionLabel,
          false,
          true,
        ),
      ];
    } else if (!isNil(meta.label)) {
      return [
        BuildSectionTools.getBuildOption(
          host,
          settings.buildings[building],
          settings,
          meta.label,
          sectionLabel,
        ),
      ];
    }

    return [];
  }
}
