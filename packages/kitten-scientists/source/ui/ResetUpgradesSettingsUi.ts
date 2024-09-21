import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import { ResetUpgradeSettings } from "../settings/ResetUpgradeSettings.js";
import { Setting } from "../settings/Settings.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";

export class ResetUpgradesSettingsUi extends IconSettingsPanel<ResetUpgradeSettings> {
  constructor(host: KittenScientists, settings: ResetUpgradeSettings) {
    const label = host.engine.i18n("ui.upgrades");
    super(host, label, settings, {
      icon: Icons.Workshop,
    });

    const itemsList = new SettingsList(this._host, {
      children: this._host.game.workshop.upgrades
        .filter(item => !isNil(this.setting.upgrades[item.name]))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(upgrade => this._getResetOption(this.setting.upgrades[upgrade.name], upgrade.label)),
    });
    this.addChild(itemsList);
  }

  private _getResetOption(
    option: Setting,
    i18nName: string,
    delimiter = false,
    upgradeIndicator = false,
  ) {
    return new SettingListItem(this._host, i18nName, option, {
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
