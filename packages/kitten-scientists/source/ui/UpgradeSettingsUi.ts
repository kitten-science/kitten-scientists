import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { SupportedLanguage } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { Setting, SettingOptions } from "../settings/Settings.js";
import { UpgradeSettings } from "../settings/UpgradeSettings.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, SettingsPanelOptions } from "./components/SettingsPanel.js";

export class UpgradeSettingsUi extends SettingsPanel<UpgradeSettings> {
  constructor(
    host: KittenScientists,
    settings: UpgradeSettings,
    language: SettingOptions<SupportedLanguage>,
    options?: SettingsPanelOptions<SettingsPanel<UpgradeSettings>>,
  ) {
    super(host, host.engine.i18n("ui.upgrade.upgrades"), settings, options);

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
        this._getUpgradeOption(this.setting.upgrades[upgrade.name], upgrade.label, delimiter),
      );
      lastLabel = upgrade.label;
      return items;
    }, []);

    const itemsList = new SettingsList(this._host, {
      children,
    });
    this.addChild(itemsList);
  }

  private _getUpgradeOption(
    option: Setting,
    i18nName: string,
    delimiter = false,
    upgradeIndicator = false,
  ) {
    return new SettingListItem(this._host, i18nName, option, {
      delimiter,
      onCheck: () => {
        this._host.engine.imessage("status.sub.enable", [i18nName]);
      },
      onUnCheck: () => {
        this._host.engine.imessage("status.sub.disable", [i18nName]);
      },
      upgradeIndicator,
    });
  }
}
