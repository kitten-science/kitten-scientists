import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { UserScript } from "../UserScript.js";
import { Icons } from "../images/Icons.js";
import { ResetBonfireSettings } from "../settings/ResetBonfireSettings.js";
import { SettingTrigger } from "../settings/Settings.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import { SettingTriggerLimitListItem } from "./components/SettingTriggerLimitListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";

export class ResetBonfireSettingsUi extends IconSettingsPanel<ResetBonfireSettings> {
  private readonly _buildings: Array<SettingTriggerListItem>;

  constructor(host: UserScript, settings: ResetBonfireSettings) {
    const label = host.engine.i18n("ui.build");
    super(host, label, settings, {
      icon: Icons.Bonfire,
    });

    this._buildings = [];
    for (const buildingGroup of this._host.game.bld.buildingGroups) {
      for (const building of buildingGroup.buildings) {
        if (building === "unicornPasture" || isNil(this.setting.buildings[building])) continue;
        const meta = this._host.game.bld.getBuildingExt(building).meta;
        if (!isNil(meta.stages) && !isNil(meta.stage)) {
          this._buildings.push(
            this._getResetOption(this.setting.buildings[building], meta.stages[meta.stage].label),
          );
        } else if (!isNil(meta.label)) {
          this._buildings.push(this._getResetOption(this.setting.buildings[building], meta.label));
        }
      }
      this._buildings.at(-1)?.element.addClass("ks-delimiter");
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
    return new SettingTriggerLimitListItem(this._host, i18nName, option, {
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
