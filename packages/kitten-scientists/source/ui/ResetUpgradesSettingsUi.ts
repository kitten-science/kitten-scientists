import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import type { ResetUpgradeSettings } from "../settings/ResetUpgradeSettings.js";
import type { Setting, SettingOptions } from "../settings/Settings.js";
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
    locale: SettingOptions<SupportedLocale>,
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
      a.label.localeCompare(b.label, locale.selected),
    )) {
      const option = this.setting.upgrades[upgrade.name];

      const element = this._getResetOption(host, option, upgrade.label);

      if (host.engine.localeSupportsFirstLetterSplits(locale.selected)) {
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
    label: string,
    delimiter = false,
    upgradeIndicator = false,
  ) {
    return new SettingListItem(host, option, label, {
      delimiter,
      onCheck: () => {
        host.engine.imessage("status.reset.check.enable", [label]);
      },
      onUnCheck: () => {
        host.engine.imessage("status.reset.check.disable", [label]);
      },
      upgradeIndicator,
    });
  }
}
