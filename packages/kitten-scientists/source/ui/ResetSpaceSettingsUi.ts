import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { UserScript } from "../UserScript.js";
import { Icons } from "../images/Icons.js";
import { ResetSpaceSettings } from "../settings/ResetSpaceSettings.js";
import { SettingTrigger } from "../settings/Settings.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import { SettingTriggerLimitListItem } from "./components/SettingTriggerLimitListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";

export class ResetSpaceSettingsUi extends IconSettingsPanel<ResetSpaceSettings> {
  private readonly _buildings: Array<SettingTriggerListItem>;

  constructor(host: UserScript, settings: ResetSpaceSettings) {
    const label = host.engine.i18n("ui.space");
    super(host, label, settings, {
      icon: Icons.Space,
    });

    this._buildings = this._host.game.space.planets.flatMap(planet =>
      planet.buildings
        .filter(item => !isNil(this.setting.buildings[item.name]))
        .map(building =>
          this._getResetOption(
            this.setting.buildings[building.name],
            building.label,
            building.name === planet.buildings.at(-1)?.name,
          ),
        ),
    );

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
