import { isNil } from "@oliversalzburg/js-utils/nil.js";
import { UserScript } from "../UserScript.js";
import { Icons } from "../images/Icons.js";
import { UnicornItemArray, ZiggurathUpgrades } from "../index.js";
import { ResetReligionSettings } from "../settings/ResetReligionSettings.js";
import { SettingTrigger } from "../settings/Settings.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import { SettingTriggerLimitListItem } from "./components/SettingTriggerLimitListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";

export class ResetReligionSettingsUi extends IconSettingsPanel<ResetReligionSettings> {
  private readonly _buildings: Array<SettingTriggerListItem>;

  constructor(host: UserScript, settings: ResetReligionSettings) {
    const label = host.engine.i18n("ui.faith");
    super(host, label, settings, {
      icon: Icons.Religion,
    });

    const unicornsArray: Array<ZiggurathUpgrades | "unicornPasture"> = [...UnicornItemArray];

    this._buildings = [
      this._getResetOption(
        this.setting.buildings.unicornPasture,
        this._host.engine.i18n("$buildings.unicornPasture.label"),
      ),

      ...this._host.game.religion.zigguratUpgrades
        .filter(
          item => unicornsArray.includes(item.name) && !isNil(this.setting.buildings[item.name]),
        )
        .map(zigguratUpgrade =>
          this._getResetOption(this.setting.buildings[zigguratUpgrade.name], zigguratUpgrade.label),
        ),

      ...this._host.game.religion.zigguratUpgrades
        .filter(
          item => !unicornsArray.includes(item.name) && !isNil(this.setting.buildings[item.name]),
        )
        .map(upgrade =>
          this._getResetOption(
            this.setting.buildings[upgrade.name],
            upgrade.label,
            upgrade.name === this._host.game.religion.zigguratUpgrades.at(-1)?.name,
          ),
        ),

      ...this._host.game.religion.religionUpgrades
        .filter(item => !isNil(this.setting.buildings[item.name]))
        .map(upgrade =>
          this._getResetOption(
            this.setting.buildings[upgrade.name],
            upgrade.label,
            upgrade.name === this._host.game.religion.religionUpgrades.at(-1)?.name,
          ),
        ),

      ...this._host.game.religion.transcendenceUpgrades
        .filter(item => !isNil(this.setting.buildings[item.name]))
        .map(upgrade =>
          this._getResetOption(
            this.setting.buildings[upgrade.name],
            upgrade.label,
            upgrade.name === this._host.game.religion.transcendenceUpgrades.at(-1)?.name,
          ),
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
