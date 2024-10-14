import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { SupportedLanguage } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { Setting, SettingOptions } from "../settings/Settings.js";
import { UpgradeSettings } from "../settings/UpgradeSettings.js";
import { PanelOptions } from "./components/CollapsiblePanel.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

export class UpgradeSettingsUi extends SettingsPanel<UpgradeSettings> {
  constructor(
    host: KittenScientists,
    settings: UpgradeSettings,
    language: SettingOptions<SupportedLanguage>,
    options?: PanelOptions,
  ) {
    const label = host.engine.i18n("ui.upgrade.upgrades");
    super(
      host,
      settings,
      new SettingListItem(host, label, settings, {
        onCheck: () => {
          host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.auto.disable", [label]);
        },
      }),
      options,
    );

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
    let lastElement: SettingListItem;

    this.addChild(
      new SettingsList(this._host, {
        children: upgrades.reduce<Array<SettingListItem>>((items, upgrade) => {
          if (
            !isNil(lastElement) &&
            localeSupportsSortMethod &&
            lastLabel[0] !== upgrade.label[0]
          ) {
            lastElement.element.addClass("ks-delimiter");
          }

          const element = this._getUpgradeOption(
            this.setting.upgrades[upgrade.name],
            upgrade.label,
          );
          lastElement = element;
          items.push(element);

          lastLabel = upgrade.label;
          return items;
        }, []),
      }),
    );
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
