import { coalesceArray, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { BonfireSettings } from "../settings/BonfireSettings.js";
import { BuildSectionTools } from "./BuildSectionTools.js";
import { BuildingUpgradeSettingsUi } from "./BuildingUpgradeSettingsUi.js";
import { Delimiter } from "./components/Delimiter.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export class BonfireSettingsUi extends SettingsPanel {
  constructor(host, settings, locale) {
    const label = host.engine.i18n("ui.build");
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
          item.triggerButton.inactive = !settings.enabled || settings.trigger < 0;
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
    // Post-super() child insertion, so we can use this._getBuildOptions().
    // We want the ability to use `this` in our callbacks, to construct more complex
    // usage scenarios where we need access to the entire UI section.
    this.addChildren([
      new SettingsList(host, {
        children: coalesceArray(
          host.game.bld.buildingGroups.flatMap(buildingGroup => [
            new HeaderListItem(host, buildingGroup.title),
            ...buildingGroup.buildings.flatMap(building =>
              this._getBuildOptions(host, settings, locale, label, building),
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
          new SettingListItem(host, settings.gatherCatnip, host.engine.i18n("option.catnip"), {
            onCheck: () => {
              host.engine.imessage("status.sub.enable", [host.engine.i18n("option.catnip")]);
            },
            onUnCheck: () => {
              host.engine.imessage("status.sub.disable", [host.engine.i18n("option.catnip")]);
            },
          }),
          new SettingListItem(
            host,
            settings.turnOnSteamworks,
            host.engine.i18n("option.steamworks"),
            {
              onCheck: () => {
                host.engine.imessage("status.sub.enable", [host.engine.i18n("option.steamworks")]);
              },
              onUnCheck: () => {
                host.engine.imessage("status.sub.disable", [host.engine.i18n("option.steamworks")]);
              },
            },
          ),
          new SettingListItem(host, settings.turnOnMagnetos, host.engine.i18n("option.magnetos"), {
            onCheck: () => {
              host.engine.imessage("status.sub.enable", [host.engine.i18n("option.magnetos")]);
            },
            onUnCheck: () => {
              host.engine.imessage("status.sub.disable", [host.engine.i18n("option.magnetos")]);
            },
          }),
          new SettingListItem(host, settings.turnOnReactors, host.engine.i18n("option.reactors"), {
            onCheck: () => {
              host.engine.imessage("status.sub.enable", [host.engine.i18n("option.reactors")]);
            },
            onUnCheck: () => {
              host.engine.imessage("status.sub.disable", [host.engine.i18n("option.reactors")]);
            },
          }),
          new BuildingUpgradeSettingsUi(host, settings.upgradeBuildings),
        ],
        hasDisableAll: false,
        hasEnableAll: false,
      }),
    ]);
  }
  _getBuildOptions(host, settings, locale, sectionLabel, building) {
    if (building === "unicornPasture" || isNil(settings.buildings[building])) {
      return [];
    }
    const meta = host.game.bld.getBuildingExt(building).meta;
    if (!isNil(meta.stages)) {
      const name = Object.values(settings.buildings).find(
        item => item.baseBuilding === building,
      )?.building;
      return [
        BuildSectionTools.getBuildOption(
          host,
          settings.buildings[building],
          locale,
          settings,
          meta.stages[0].label,
          sectionLabel,
        ),
        BuildSectionTools.getBuildOption(
          host,
          settings.buildings[name],
          locale,
          settings,
          meta.stages[1].label,
          sectionLabel,
          false,
          true,
        ),
      ];
    }
    if (!isNil(meta.label)) {
      return [
        BuildSectionTools.getBuildOption(
          host,
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
//# sourceMappingURL=BonfireSettingsUi.js.map
