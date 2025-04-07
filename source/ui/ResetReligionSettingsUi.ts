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
import { SettingsList } from "./components/SettingsList.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import type { UiComponent } from "./components/UiComponent.js";

export class ResetReligionSettingsUi extends IconSettingsPanel<ResetReligionSettings> {
  constructor(
    parent: UiComponent,
    settings: ResetReligionSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = parent.host.engine.i18n("ui.faith");
    super(parent, label, settings, {
      icon: Icons.Religion,
      onRefresh: () => {
        this.expando.ineffective =
          settings.enabled &&
          Object.values(settings.buildings).some(_ => _.enabled && _.trigger <= 0);
      },
    });

    this.addChildrenHead([new Container(parent, { classes: [stylesLabelListItem.fillSpace] })]);

    const unicornsArray: Array<ZigguratUpgrade | "unicornPasture"> = [...UnicornItems];

    this.addChildContent(
      new SettingsList(this).addChildren([
        new HeaderListItem(this, this.host.engine.i18n("$religion.panel.ziggurat.label")),
        this._getResetOption(
          this,
          this.setting.buildings.unicornPasture,
          locale,
          settings,
          this.host.engine.i18n("$buildings.unicornPasture.label"),
        ),

        ...this.host.game.religion.zigguratUpgrades
          .filter(
            item => unicornsArray.includes(item.name) && !isNil(this.setting.buildings[item.name]),
          )
          .map(zigguratUpgrade =>
            this._getResetOption(
              this,
              this.setting.buildings[zigguratUpgrade.name],
              locale,
              settings,
              zigguratUpgrade.label,
            ),
          ),
        new Delimiter(this),

        ...this.host.game.religion.zigguratUpgrades
          .filter(
            item => !unicornsArray.includes(item.name) && !isNil(this.setting.buildings[item.name]),
          )
          .map(upgrade =>
            this._getResetOption(
              this,
              this.setting.buildings[upgrade.name],
              locale,
              settings,
              upgrade.label,
            ),
          ),
        new Delimiter(this),

        new HeaderListItem(this, this.host.engine.i18n("$religion.panel.orderOfTheSun.label")),
        ...this.host.game.religion.religionUpgrades
          .filter(item => !isNil(this.setting.buildings[item.name]))
          .map(upgrade =>
            this._getResetOption(
              this,
              this.setting.buildings[upgrade.name],
              locale,
              settings,
              upgrade.label,
              upgrade.name === this.host.game.religion.religionUpgrades.at(-1)?.name,
            ),
          ),

        new HeaderListItem(this, this.host.engine.i18n("$religion.panel.cryptotheology.label")),
        ...this.host.game.religion.transcendenceUpgrades
          .filter(item => !isNil(this.setting.buildings[item.name]))
          .map(upgrade =>
            this._getResetOption(
              this,
              this.setting.buildings[upgrade.name],
              locale,
              settings,
              upgrade.label,
            ),
          ),
      ]),
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
      onUnCheck: () => {
        parent.host.engine.imessage("status.reset.check.disable", [label]);
      },
      upgradeIndicator,
    });
    element.triggerButton.element.addClass(stylesButton.lastHeadAction);
    return element;
  }
}
