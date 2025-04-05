import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import { Icons } from "../images/Icons.js";
import type { ResetReligionSettings } from "../settings/ResetReligionSettings.js";
import type { SettingOptions, SettingTrigger } from "../settings/Settings.js";
import { UnicornItems, type ZigguratUpgrade } from "../types/index.js";
import stylesButton from "./components/Button.module.css";
import { Container } from "./components/Container.js";
import { Delimiter } from "./components/Delimiter.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import type { UiComponent } from "./components/UiComponent.js";

export class ResetReligionSettingsUi extends IconSettingsPanel<ResetReligionSettings> {
  constructor(
    parent: UiComponent,
    settings: ResetReligionSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = parent.host.engine.i18n("ui.faith");
    super(parent, label, settings, {
      childrenHead: [new Container(parent, { classes: [stylesLabelListItem.fillSpace] })],
      icon: Icons.Religion,
    });

    const unicornsArray: Array<ZigguratUpgrade | "unicornPasture"> = [...UnicornItems];

    this.addChild(
      new SettingsList(parent, {
        children: [
          new HeaderListItem(parent, parent.host.engine.i18n("$religion.panel.ziggurat.label")),
          this._getResetOption(
            parent,
            this.setting.buildings.unicornPasture,
            locale,
            settings,
            parent.host.engine.i18n("$buildings.unicornPasture.label"),
          ),

          ...parent.host.game.religion.zigguratUpgrades
            .filter(
              item =>
                unicornsArray.includes(item.name) && !isNil(this.setting.buildings[item.name]),
            )
            .map(zigguratUpgrade =>
              this._getResetOption(
                parent,
                this.setting.buildings[zigguratUpgrade.name],
                locale,
                settings,
                zigguratUpgrade.label,
              ),
            ),
          new Delimiter(parent),

          ...parent.host.game.religion.zigguratUpgrades
            .filter(
              item =>
                !unicornsArray.includes(item.name) && !isNil(this.setting.buildings[item.name]),
            )
            .map(upgrade =>
              this._getResetOption(
                parent,
                this.setting.buildings[upgrade.name],
                locale,
                settings,
                upgrade.label,
              ),
            ),
          new Delimiter(parent),

          new HeaderListItem(
            parent,
            parent.host.engine.i18n("$religion.panel.orderOfTheSun.label"),
          ),
          ...parent.host.game.religion.religionUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(upgrade =>
              this._getResetOption(
                parent,
                this.setting.buildings[upgrade.name],
                locale,
                settings,
                upgrade.label,
                upgrade.name === parent.host.game.religion.religionUpgrades.at(-1)?.name,
              ),
            ),

          new HeaderListItem(
            parent,
            parent.host.engine.i18n("$religion.panel.cryptotheology.label"),
          ),
          ...parent.host.game.religion.transcendenceUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(upgrade =>
              this._getResetOption(
                parent,
                this.setting.buildings[upgrade.name],
                locale,
                settings,
                upgrade.label,
              ),
            ),
        ],
      }),
    );
  }

  private _getResetOption(
    parent: UiComponent,
    option: SettingTrigger,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: ResetReligionSettings,
    label: string,
    delimiter = false,
    upgradeIndicator = false,
  ) {
    const element = new SettingTriggerListItem(parent, option, locale, label, {
      delimiter,
      onCheck: () => {
        parent.host.engine.imessage("status.reset.check.enable", [label]);
      },
      onUnCheck: () => {
        parent.host.engine.imessage("status.reset.check.disable", [label]);
      },
      onRefresh: () => {
        element.triggerButton.inactive = !option.enabled || option.trigger === -1;
        element.triggerButton.ineffective =
          sectionSetting.enabled && option.enabled && option.trigger === -1;
      },
      onSetTrigger: async () => {
        const value = await Dialog.prompt(
          parent,
          parent.host.engine.i18n("ui.trigger.prompt.absolute"),
          parent.host.engine.i18n("ui.trigger.build.prompt", [
            label,
            option.trigger !== -1
              ? parent.host.renderAbsolute(option.trigger, locale.selected)
              : parent.host.engine.i18n("ui.trigger.inactive"),
          ]),
          option.trigger !== -1 ? parent.host.renderAbsolute(option.trigger) : "",
          parent.host.engine.i18n("ui.trigger.reset.promptExplainer"),
        );

        if (value === undefined) {
          return;
        }

        if (value === "" || value.startsWith("-")) {
          option.trigger = -1;
          option.enabled = false;
          return;
        }

        option.trigger = Number(value);
      },
      upgradeIndicator,
    });
    element.triggerButton.element.addClass(stylesButton.lastHeadAction);
    return element;
  }
}
