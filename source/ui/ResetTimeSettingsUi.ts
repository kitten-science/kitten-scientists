import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import { Icons } from "../images/Icons.js";
import type { ResetTimeSettings } from "../settings/ResetTimeSettings.js";
import type { SettingOptions, SettingTrigger } from "../settings/Settings.js";
import type { TimeItem } from "../settings/TimeSettings.js";
import stylesButton from "./components/Button.module.css";
import { Container } from "./components/Container.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingsList } from "./components/SettingsList.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import type { UiComponent } from "./components/UiComponent.js";

export class ResetTimeSettingsUi extends IconSettingsPanel<ResetTimeSettings> {
  constructor(
    parent: UiComponent,
    settings: ResetTimeSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = parent.host.engine.i18n("ui.time");
    super(parent, label, settings, {
      icon: Icons.Time,
      onRefresh: () => {
        this.expando.ineffective =
          settings.enabled &&
          Object.values(settings.buildings).some(_ => _.enabled && _.trigger <= 0);
      },
    });

    this.addChildrenHead([new Container(parent, { classes: [stylesLabelListItem.fillSpace] })]);

    this.addChildContent(
      new SettingsList(this).addChildren([
        new HeaderListItem(this, this.host.engine.i18n("$workshop.chronoforge.label")),
        ...this.host.game.time.chronoforgeUpgrades
          .filter(item => !isNil(this.setting.buildings[item.name]))
          .map(building =>
            this._getResetOption(
              this,
              this.setting.buildings[building.name],
              locale,
              settings,
              building.label,
              building.name === this.host.game.time.chronoforgeUpgrades.at(-1)?.name,
            ),
          ),

        new HeaderListItem(this, this.host.engine.i18n("$science.voidSpace.label")),
        ...this.host.game.time.voidspaceUpgrades
          .filter(item => item.name in this.setting.buildings)
          .map(building =>
            this._getResetOption(
              this,
              this.setting.buildings[building.name as TimeItem],
              locale,
              settings,
              building.label,
            ),
          ),
      ]),
    );
  }

  private _getResetOption(
    parent: UiComponent,
    option: SettingTrigger,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: ResetTimeSettings,
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
