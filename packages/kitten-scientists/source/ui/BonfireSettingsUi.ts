import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../KittenScientists.js";
import { BonfireSettings } from "../settings/BonfireSettings.js";
import { StagedBuilding } from "../types/index.js";
import { BuildingUpgradeSettingsUi } from "./BuildingUpgradeSettingsUi.js";
import { AbstractBuildSettingsPanel } from "./SettingsSectionUi.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingMaxListItem } from "./components/SettingMaxListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";

export class BonfireSettingsUi extends AbstractBuildSettingsPanel<BonfireSettings> {
  private readonly _buildings: Array<HeaderListItem | SettingMaxListItem>;

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
    );

    this._buildings = [];
    for (const buildingGroup of this._host.game.bld.buildingGroups) {
      this._buildings.push(new HeaderListItem(this._host, buildingGroup.title));
      for (const building of buildingGroup.buildings) {
        if (building === "unicornPasture" || isNil(this.setting.buildings[building])) {
          continue;
        }

        const meta = this._host.game.bld.getBuildingExt(building).meta;
        if (!isNil(meta.stages)) {
          const name = Object.values(this.setting.buildings).find(
            item => item.baseBuilding === building,
          )?.building as StagedBuilding;
          this._buildings.push(
            this._getBuildOption(this.setting.buildings[building], meta.stages[0].label),
            this._getBuildOption(this.setting.buildings[name], meta.stages[1].label, false, true),
          );
        } else if (!isNil(meta.label)) {
          this._buildings.push(this._getBuildOption(this.setting.buildings[building], meta.label));
        }
      }

      // Add padding after each group. Except for the last group, which ends the list.
      if (
        buildingGroup !==
        this._host.game.bld.buildingGroups[this._host.game.bld.buildingGroups.length - 1]
      ) {
        this._buildings.at(-1)?.element.addClass("ks-delimiter");
      }
    }

    const listBuildings = new SettingsList(this._host, {
      children: this._buildings,
      onReset: () => {
        this.setting.load({ buildings: new BonfireSettings().buildings });
        this.refreshUi();
      },
    });
    this.addChild(listBuildings);

    const listAddition = new SettingsList(this._host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    listAddition.addChild(new HeaderListItem(this._host, this._host.engine.i18n("ui.additional")));

    listAddition.addChild(new BuildingUpgradeSettingsUi(this._host, this.setting.upgradeBuildings));

    listAddition.addChild(
      new SettingListItem(
        this._host,
        this._host.engine.i18n("option.catnip"),
        this.setting.gatherCatnip,
        {
          onCheck: () => {
            this._host.engine.imessage("status.sub.enable", [
              this._host.engine.i18n("option.catnip"),
            ]);
          },
          onUnCheck: () => {
            this._host.engine.imessage("status.sub.disable", [
              this._host.engine.i18n("option.catnip"),
            ]);
          },
        },
      ),
    );

    listAddition.addChild(
      new SettingListItem(
        this._host,
        this._host.engine.i18n("option.steamworks"),
        this.setting.turnOnSteamworks,
        {
          onCheck: () => {
            this._host.engine.imessage("status.sub.enable", [
              this._host.engine.i18n("option.steamworks"),
            ]);
          },
          onUnCheck: () => {
            this._host.engine.imessage("status.sub.disable", [
              this._host.engine.i18n("option.steamworks"),
            ]);
          },
        },
      ),
    );

    listAddition.addChild(
      new SettingListItem(
        this._host,
        this._host.engine.i18n("option.magnetos"),
        this.setting.turnOnMagnetos,
        {
          onCheck: () => {
            this._host.engine.imessage("status.sub.enable", [
              this._host.engine.i18n("option.magnetos"),
            ]);
          },
          onUnCheck: () => {
            this._host.engine.imessage("status.sub.disable", [
              this._host.engine.i18n("option.magnetos"),
            ]);
          },
        },
      ),
    );

    listAddition.addChild(
      new SettingListItem(
        this._host,
        this._host.engine.i18n("option.reactors"),
        this.setting.turnOnReactors,
        {
          onCheck: () => {
            this._host.engine.imessage("status.sub.enable", [
              this._host.engine.i18n("option.reactors"),
            ]);
          },
          onUnCheck: () => {
            this._host.engine.imessage("status.sub.disable", [
              this._host.engine.i18n("option.reactors"),
            ]);
          },
        },
      ),
    );

    this.addChild(listAddition);
  }
}
