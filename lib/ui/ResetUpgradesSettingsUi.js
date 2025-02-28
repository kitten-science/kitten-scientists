import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { Icons } from "../images/Icons.js";
import { Container } from "./components/Container.js";
import stylesDelimiter from "./components/Delimiter.module.css";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
export class ResetUpgradesSettingsUi extends IconSettingsPanel {
  constructor(host, settings, locale) {
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
    let lastElement;
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
  _getResetOption(host, option, label, delimiter = false, upgradeIndicator = false) {
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
//# sourceMappingURL=ResetUpgradesSettingsUi.js.map
