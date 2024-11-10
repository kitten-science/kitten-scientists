import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import { ResetBonfireSettings } from "../settings/ResetBonfireSettings.js";
import { SettingTrigger } from "../settings/Settings.js";
import { StagedBuilding } from "../types/index.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";

export class ResetBonfireSettingsUi extends IconSettingsPanel<ResetBonfireSettings> {
  private readonly _buildings: Array<HeaderListItem | SettingTriggerListItem>;

  constructor(host: KittenScientists, settings: ResetBonfireSettings) {
    const label = host.engine.i18n("ui.build");
    super(host, label, settings, {
      icon: Icons.Bonfire,
    });

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
            this._getResetOption(this.setting.buildings[building], meta.stages[0].label),
            this._getResetOption(this.setting.buildings[name], meta.stages[1].label, false, true),
          );
        } else if (!isNil(meta.label)) {
          this._buildings.push(this._getResetOption(this.setting.buildings[building], meta.label));
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

    const listBuildings = new SettingsList(this._host);
    listBuildings.addChildren(this._buildings);
    this.addChild(listBuildings);
  }

  private _getResetOption(
    option: SettingTrigger,
    i18nName: string,
    delimiter = false,
    upgradeIndicator = false,
  ) {
    return new SettingTriggerListItem(this._host, i18nName, option, {
      delimiter,
      onCheck: () => {
        this._host.engine.imessage("status.reset.check.enable", [i18nName]);
      },
      onUnCheck: () => {
        this._host.engine.imessage("status.reset.check.disable", [i18nName]);
      },
      upgradeIndicator,
    });
  }
}
