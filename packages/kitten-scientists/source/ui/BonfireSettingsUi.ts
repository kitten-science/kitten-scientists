import { coalesceArray, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../KittenScientists.js";
import { BonfireSettings } from "../settings/BonfireSettings.js";
import { SettingTriggerMax } from "../settings/Settings.js";
import { Building, StagedBuilding } from "../types/index.js";
import { BuildingUpgradeSettingsUi } from "./BuildingUpgradeSettingsUi.js";
import { Delimiter } from "./components/Delimiter.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingTriggerMaxListItem } from "./components/SettingTriggerMaxListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

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
      }),
      {
        children: [
          new SettingsList(host, {
            children: coalesceArray(
              host.game.bld.buildingGroups.flatMap(buildingGroup => [
                new HeaderListItem(host, buildingGroup.title),
                ...buildingGroup.buildings.flatMap(building =>
                  BonfireSettingsUi._getBuildOptions(host, settings, building),
                ),
                buildingGroup !==
                host.game.bld.buildingGroups[host.game.bld.buildingGroups.length - 1]
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
                    host.engine.imessage("status.sub.enable", [
                      host.engine.i18n("option.steamworks"),
                    ]);
                  },
                  onUnCheck: () => {
                    host.engine.imessage("status.sub.disable", [
                      host.engine.i18n("option.steamworks"),
                    ]);
                  },
                },
              ),
              new SettingListItem(
                host,
                host.engine.i18n("option.magnetos"),
                settings.turnOnMagnetos,
                {
                  onCheck: () => {
                    host.engine.imessage("status.sub.enable", [
                      host.engine.i18n("option.magnetos"),
                    ]);
                  },
                  onUnCheck: () => {
                    host.engine.imessage("status.sub.disable", [
                      host.engine.i18n("option.magnetos"),
                    ]);
                  },
                },
              ),
              new SettingListItem(
                host,
                host.engine.i18n("option.reactors"),
                settings.turnOnReactors,
                {
                  onCheck: () => {
                    host.engine.imessage("status.sub.enable", [
                      host.engine.i18n("option.reactors"),
                    ]);
                  },
                  onUnCheck: () => {
                    host.engine.imessage("status.sub.disable", [
                      host.engine.i18n("option.reactors"),
                    ]);
                  },
                },
              ),
            ],
            hasDisableAll: false,
            hasEnableAll: false,
          }),
        ],
      },
    );
  }

  private static _getBuildOptions(
    host: KittenScientists,
    settings: BonfireSettings,
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
        BonfireSettingsUi._getBuildOption(host, settings.buildings[building], meta.stages[0].label),
        BonfireSettingsUi._getBuildOption(
          host,
          settings.buildings[name],
          meta.stages[1].label,
          false,
          true,
        ),
      ];
    } else if (!isNil(meta.label)) {
      return [BonfireSettingsUi._getBuildOption(host, settings.buildings[building], meta.label)];
    }

    return [];
  }

  private static _getBuildOption(
    host: KittenScientists,
    option: SettingTriggerMax,
    label: string,
    delimiter = false,
    upgradeIndicator = false,
  ) {
    const buildOption = new SettingTriggerMaxListItem(host, label, option, {
      delimiter,
      onCheck: () => {
        host.engine.imessage("status.sub.enable", [label]);
      },
      onUnCheck: () => {
        host.engine.imessage("status.sub.disable", [label]);
      },
      onRefresh: () => {
        buildOption.triggerButton.inactive = option.trigger === 1;
      },
      upgradeIndicator,
    });
    buildOption.triggerButton.inactive = true;
    return buildOption;
  }
}
