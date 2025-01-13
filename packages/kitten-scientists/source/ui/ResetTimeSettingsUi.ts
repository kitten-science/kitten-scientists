import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { SupportedLocale } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import { ResetTimeSettings } from "../settings/ResetTimeSettings.js";
import { SettingOptions, SettingTrigger } from "../settings/Settings.js";
import stylesButton from "./components/Button.module.css";
import { Container } from "./components/Container.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";

export class ResetTimeSettingsUi extends IconSettingsPanel<ResetTimeSettings> {
  constructor(
    host: KittenScientists,
    settings: ResetTimeSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = host.engine.i18n("ui.time");
    super(host, label, settings, {
      childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
      icon: Icons.Time,
    });

    this.addChild(
      new SettingsList(host, {
        children: [
          new HeaderListItem(host, host.engine.i18n("$workshop.chronoforge.label")),
          ...host.game.time.chronoforgeUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(building =>
              this._getResetOption(
                host,
                this.setting.buildings[building.name],
                locale,
                settings,
                building.label,
                building.name === host.game.time.chronoforgeUpgrades.at(-1)?.name,
              ),
            ),

          new HeaderListItem(host, host.engine.i18n("$science.voidSpace.label")),
          ...host.game.time.voidspaceUpgrades
            .filter(item => !isNil(this.setting.buildings[item.name]))
            .map(building =>
              this._getResetOption(
                host,
                this.setting.buildings[building.name],
                locale,
                settings,
                building.label,
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
    sectionSetting: ResetTimeSettings,
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
        element.triggerButton.ineffective =
          sectionSetting.enabled && option.enabled && option.trigger === -1;
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
