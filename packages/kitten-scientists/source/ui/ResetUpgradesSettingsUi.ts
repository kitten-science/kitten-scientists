import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { SupportedLocale } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import { ResetUpgradeSettings } from "../settings/ResetUpgradeSettings.js";
import { Setting, SettingOptions } from "../settings/Settings.js";
import { Container } from "./components/Container.js";
import stylesDelimiter from "./components/Delimiter.module.css";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";

export class ResetUpgradesSettingsUi extends IconSettingsPanel<ResetUpgradeSettings> {
  constructor(
    host: KittenScientists,
    settings: ResetUpgradeSettings,
    language: SettingOptions<SupportedLocale>,
  ) {
    const label = host.engine.i18n("ui.upgrades");
    super(host, label, settings, {
      childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
      icon: Icons.Workshop,
    });

    const upgrades = host.game.workshop.upgrades.filter(
      upgrade => !isNil(this.setting.upgrades[upgrade.name]),
    );

    const items = [];
    let lastLabel = upgrades[0].label;
    let lastElement: SettingListItem | undefined;
    for (const upgrade of upgrades.sort((a, b) =>
      a.label.localeCompare(b.label, language.selected),
    )) {
      const option = this.setting.upgrades[upgrade.name];

      const element = this._getResetOption(host, option, upgrade.label);

      if (host.engine.localeSupportsFirstLetterSplits(language.selected)) {
        if (lastLabel[0] !== upgrade.label[0]) {
          if (!isNil(lastElement)) {
            lastElement.element.addClass(stylesDelimiter.delimiter);
          }
          element.element.addClass(stylesLabelListItem.splitter);
        }
      }

      lastElement = element;
      items.push(element);

      lastLabel = upgrade.label;
    }

    this.addChild(new SettingsList(host, { children: items }));
  }

  private _getResetOption(
    host: KittenScientists,
    option: Setting,
    i18nName: string,
    delimiter = false,
    upgradeIndicator = false,
  ) {
    return new SettingListItem(host, i18nName, option, {
      delimiter,
      onCheck: () => {
        host.engine.imessage("status.reset.check.enable", [i18nName]);
      },
      onUnCheck: () => {
        host.engine.imessage("status.reset.check.disable", [i18nName]);
      },
      upgradeIndicator,
    });
  }
}
