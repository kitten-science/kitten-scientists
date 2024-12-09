import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { SupportedLocale } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import { UnicornItems } from "../settings/ReligionSettings.js";
import { ResetReligionSettings } from "../settings/ResetReligionSettings.js";
import { SettingOptions, SettingTrigger } from "../settings/Settings.js";
import { ZiggurathUpgrade } from "../types/religion.js";
import stylesButton from "./components/Button.module.css";
import { Container } from "./components/Container.js";
import { Delimiter } from "./components/Delimiter.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";

export class ResetReligionSettingsUi extends IconSettingsPanel<ResetReligionSettings> {
  constructor(
    host: KittenScientists,
    settings: ResetReligionSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = host.engine.i18n("ui.faith");
    super(host, label, settings, {
      childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
      icon: Icons.Religion,
    });

    const unicornsArray: Array<ZiggurathUpgrade | "unicornPasture"> = [...UnicornItems];

    this.addChild(
      new SettingsList(host, {
        children: [
          new HeaderListItem(host, host.engine.i18n("$religion.panel.ziggurat.label")),
          this._getResetOption(
            host,
            this.setting.buildings.unicornPasture,
            locale,
            host.engine.i18n("$buildings.unicornPasture.label"),
          ),

          ...host.game.religion.zigguratUpgrades
            .filter(
              item =>
                unicornsArray.includes(item.name) && !isNil(this.setting.buildings[item.name]),
            )
            .map(zigguratUpgrade =>
              this._getResetOption(
                host,
                this.setting.buildings[zigguratUpgrade.name],
                locale,
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
              this._getResetOption(
                host,
                this.setting.buildings[upgrade.name],
                locale,
                upgrade.label,
              ),
            ),
          new Delimiter(host),

          new HeaderListItem(host, host.engine.i18n("$religion.panel.orderOfTheSun.label")),
          ...host.game.religion.religionUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(upgrade =>
              this._getResetOption(
                host,
                this.setting.buildings[upgrade.name],
                locale,
                upgrade.label,
                upgrade.name === host.game.religion.religionUpgrades.at(-1)?.name,
              ),
            ),

          new HeaderListItem(host, host.engine.i18n("$religion.panel.cryptotheology.label")),
          ...host.game.religion.transcendenceUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(upgrade =>
              this._getResetOption(
                host,
                this.setting.buildings[upgrade.name],
                locale,
                upgrade.label,
              ),
            ),
        ],
      }),
    );
  }

  private _getResetOption(
    host: KittenScientists,
    option: SettingTrigger,
    locale: SettingOptions<SupportedLocale>,
    label: string,
    delimiter = false,
    upgradeIndicator = false,
  ) {
    const element = new SettingTriggerListItem(host, option, locale, label, {
      delimiter,
      onCheck: () => {
        host.engine.imessage("status.reset.check.enable", [label]);
      },
      onUnCheck: () => {
        host.engine.imessage("status.reset.check.disable", [label]);
      },
      onRefresh: () => {
        element.triggerButton.inactive = !option.enabled || option.trigger === -1;
      },
      onSetTrigger: () => {
        Dialog.prompt(
          host,
          host.engine.i18n("ui.trigger.prompt.absolute"),
          host.engine.i18n("ui.trigger.build.prompt", [
            label,
            option.trigger !== -1
              ? host.renderAbsolute(option.trigger, locale.selected)
              : host.engine.i18n("ui.trigger.inactive"),
          ]),
          option.trigger !== -1 ? host.renderAbsolute(option.trigger) : "",
          host.engine.i18n("ui.trigger.reset.promptExplainer"),
        )
          .then(value => {
            if (value === undefined) {
              return;
            }

            if (value === "" || value.startsWith("-")) {
              option.trigger = -1;
              option.enabled = false;
              return;
            }

            option.trigger = Number(value);
          })
          .then(() => {
            element.refreshUi();
          })
          .catch(redirectErrorsToConsole(console));
      },
      upgradeIndicator,
    });
    element.triggerButton.element.addClass(stylesButton.lastHeadAction);
    return element;
  }
}
