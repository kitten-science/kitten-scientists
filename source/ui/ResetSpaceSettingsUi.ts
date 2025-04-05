import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import { Icons } from "../images/Icons.js";
import type { ResetSpaceSettings } from "../settings/ResetSpaceSettings.js";
import type { SettingOptions, SettingTrigger } from "../settings/Settings.js";
import stylesButton from "./components/Button.module.css";
import { Container } from "./components/Container.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import type { UiComponent } from "./components/UiComponent.js";

export class ResetSpaceSettingsUi extends IconSettingsPanel<ResetSpaceSettings> {
  constructor(
    parent: UiComponent,
    settings: ResetSpaceSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = parent.host.engine.i18n("ui.space");
    super(parent, label, settings, {
      icon: Icons.Space,
    });

    this.addChildrenHead([new Container(parent, { classes: [stylesLabelListItem.fillSpace] })]);

    this.addChild(
      new SettingsList(this).addChildren(
        this.host.game.space.planets
          .filter(plant => 0 < plant.buildings.length)
          .flatMap((planet, indexPlanet, arrayPlant) => [
            new HeaderListItem(this, this.host.engine.labelForPlanet(planet.name)),
            ...planet.buildings
              .filter(item => !isNil(this.setting.buildings[item.name]))
              .map((building, indexBuilding, arrayBuilding) =>
                this._getResetOption(
                  this,
                  this.setting.buildings[building.name],
                  locale,
                  settings,
                  building.label,
                  indexPlanet < arrayPlant.length - 1 && indexBuilding === arrayBuilding.length - 1,
                ),
              ),
          ]),
      ),
    );
  }

  private _getResetOption(
    parent: UiComponent,
    option: SettingTrigger,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: ResetSpaceSettings,
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
