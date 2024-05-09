import { isNil } from "@oliversalzburg/js-utils/nil.js";
import { UserScript } from "../UserScript.js";
import { Icons } from "../images/Icons.js";
import { ResetTimeSettings } from "../settings/ResetTimeSettings.js";
import { SettingTrigger } from "../settings/Settings.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import { SettingTriggerLimitListItem } from "./components/SettingTriggerLimitListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";

export class ResetTimeSettingsUi extends IconSettingsPanel<ResetTimeSettings> {
  private readonly _buildings: Array<SettingTriggerListItem>;

  constructor(host: UserScript, settings: ResetTimeSettings) {
    const label = host.engine.i18n("ui.time");
    super(host, label, settings, {
      icon: Icons.Time,
    });

    this._buildings = [
      ...this._host.game.time.chronoforgeUpgrades
        .filter(item => !isNil(this.setting.buildings[item.name]))
        .map(building =>
          this._getResetOption(
            this.setting.buildings[building.name],
            building.label,
            building.name === this._host.game.time.chronoforgeUpgrades.at(-1)?.name,
          ),
        ),
      ...this._host.game.time.voidspaceUpgrades
        .filter(item => !isNil(this.setting.buildings[item.name]))
        .map(building =>
          this._getResetOption(this.setting.buildings[building.name], building.label),
        ),
    ];

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
      onCheck: () => this._host.engine.imessage("status.reset.check.enable", [i18nName]),
      onUnCheck: () => this._host.engine.imessage("status.reset.check.disable", [i18nName]),
      upgradeIndicator,
    });
  }
}
