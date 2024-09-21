import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { SupportedLanguage } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import { ResetUpgradeSettings } from "../settings/ResetUpgradeSettings.js";
import { Setting, SettingOptions } from "../settings/Settings.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";

export class ResetUpgradesSettingsUi extends IconSettingsPanel<ResetUpgradeSettings> {
  constructor(
    host: KittenScientists,
    settings: ResetUpgradeSettings,
    language: SettingOptions<SupportedLanguage>,
  ) {
    const label = host.engine.i18n("ui.upgrades");
    super(host, label, settings, {
      icon: Icons.Workshop,
    });

    const upgrades = this._host.game.workshop.upgrades.filter(
      upgrade => !isNil(this.setting.upgrades[upgrade.name]),
    );

    const localeSupportsSortMethod = language.selected !== "zh";
    // Ensure buttons are added into UI with their labels alphabetized.
    // This approach is not applicable to all locales!
    if (localeSupportsSortMethod) {
      upgrades.sort((a, b) => a.label.localeCompare(b.label));
    }

    let lastLabel = upgrades[0].label;
    const children = upgrades.reduce<Array<SettingListItem>>((items, upgrade) => {
      const delimiter = localeSupportsSortMethod && lastLabel[0] !== upgrade.label[0];
      items.push(
        this._getResetOption(this.setting.upgrades[upgrade.name], upgrade.label, delimiter),
      );
      lastLabel = upgrade.label;
      return items;
    }, []);

    const itemsList = new SettingsList(this._host, {
      children,
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
