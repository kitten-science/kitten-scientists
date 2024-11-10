import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import { ResetTimeSettings } from "../settings/ResetTimeSettings.js";
import { SettingTrigger } from "../settings/Settings.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";

export class ResetTimeSettingsUi extends IconSettingsPanel<ResetTimeSettings> {
  constructor(host: KittenScientists, settings: ResetTimeSettings) {
    const label = host.engine.i18n("ui.time");
    super(host, label, settings, {
      icon: Icons.Time,
    });

    this.addChild(
      new SettingsList(this._host, {
        children: [
          new HeaderListItem(this._host, this._host.engine.i18n("$workshop.chronoforge.label")),
          ...this._host.game.time.chronoforgeUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(building =>
              this._getResetOption(
                this.setting.buildings[building.name],
                building.label,
                building.name === this._host.game.time.chronoforgeUpgrades.at(-1)?.name,
              ),
            ),

          new HeaderListItem(this._host, this._host.engine.i18n("$science.voidSpace.label")),
          ...this._host.game.time.voidspaceUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(building =>
              this._getResetOption(this.setting.buildings[building.name], building.label),
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
