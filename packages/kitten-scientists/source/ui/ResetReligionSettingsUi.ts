import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import { UnicornItems } from "../settings/ReligionSettings.js";
import { ResetReligionSettings } from "../settings/ResetReligionSettings.js";
import { SettingTrigger } from "../settings/Settings.js";
import { ZiggurathUpgrade } from "../types/religion.js";
import { Delimiter } from "./components/Delimiter.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import { SettingTriggerLimitListItem } from "./components/SettingTriggerLimitListItem.js";
import { SettingsList } from "./components/SettingsList.js";

export class ResetReligionSettingsUi extends IconSettingsPanel<ResetReligionSettings> {
  constructor(host: KittenScientists, settings: ResetReligionSettings) {
    const label = host.engine.i18n("ui.faith");
    super(host, label, settings, {
      icon: Icons.Religion,
    });

    const unicornsArray: Array<ZiggurathUpgrade | "unicornPasture"> = [...UnicornItems];

    this.addChild(
      new SettingsList(host, {
        children: [
          new HeaderListItem(host, host.engine.i18n("$religion.panel.ziggurat.label")),
          this._getResetOption(
            this.setting.buildings.unicornPasture,
            host.engine.i18n("$buildings.unicornPasture.label"),
          ),

          ...host.game.religion.zigguratUpgrades
            .filter(
              item =>
                unicornsArray.includes(item.name) && !isNil(this.setting.buildings[item.name]),
            )
            .map(zigguratUpgrade =>
              this._getResetOption(
                this.setting.buildings[zigguratUpgrade.name],
                zigguratUpgrade.label,
              ),
            ),
          new Delimiter(host),

          ...host.game.religion.zigguratUpgrades
            .filter(
              item =>
                !unicornsArray.includes(item.name) && !isNil(this.setting.buildings[item.name]),
            )
            .map(upgrade =>
              this._getResetOption(this.setting.buildings[upgrade.name], upgrade.label),
            ),
          new Delimiter(host),

          new HeaderListItem(host, host.engine.i18n("$religion.panel.orderOfTheSun.label")),
          ...host.game.religion.religionUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(upgrade =>
              this._getResetOption(
                this.setting.buildings[upgrade.name],
                upgrade.label,
                upgrade.name === host.game.religion.religionUpgrades.at(-1)?.name,
              ),
            ),

          new HeaderListItem(host, host.engine.i18n("$religion.panel.cryptotheology.label")),
          ...host.game.religion.transcendenceUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(upgrade =>
              this._getResetOption(this.setting.buildings[upgrade.name], upgrade.label),
            ),
        ],
      }),
    );
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
