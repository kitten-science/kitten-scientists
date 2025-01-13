import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { SupportedLocale } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import { ResetBonfireSettings } from "../settings/ResetBonfireSettings.js";
import { SettingOptions, SettingTrigger } from "../settings/Settings.js";
import { StagedBuilding } from "../types/index.js";
import stylesButton from "./components/Button.module.css";
import { Container } from "./components/Container.js";
import stylesDelimiter from "./components/Delimiter.module.css";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";

export class ResetBonfireSettingsUi extends IconSettingsPanel<ResetBonfireSettings> {
  private readonly _buildings: Array<HeaderListItem | SettingTriggerListItem>;

  constructor(
    host: KittenScientists,
    settings: ResetBonfireSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = host.engine.i18n("ui.build");
    super(host, label, settings, {
      childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
      icon: Icons.Bonfire,
    });

    this._buildings = [];
    for (const buildingGroup of host.game.bld.buildingGroups) {
      this._buildings.push(new HeaderListItem(host, buildingGroup.title));
      for (const building of buildingGroup.buildings) {
        if (building === "unicornPasture" || isNil(this.setting.buildings[building])) {
          continue;
        }

        const meta = host.game.bld.getBuildingExt(building).meta;
        if (!isNil(meta.stages)) {
          const name = Object.values(this.setting.buildings).find(
            item => item.baseBuilding === building,
          )?.building as StagedBuilding;
          this._buildings.push(
            this._getResetOption(
              host,
              this.setting.buildings[building],
              locale,
              settings,
              meta.stages[0].label,
            ),
            this._getResetOption(
              host,
              this.setting.buildings[name],
              locale,
              settings,
              meta.stages[1].label,
              false,
              true,
            ),
          );
        } else if (!isNil(meta.label)) {
          this._buildings.push(
            this._getResetOption(
              host,
              this.setting.buildings[building],
              locale,
              settings,
              meta.label,
            ),
          );
        }
      }

      // Add padding after each group. Except for the last group, which ends the list.
      if (buildingGroup !== host.game.bld.buildingGroups[host.game.bld.buildingGroups.length - 1]) {
        this._buildings.at(-1)?.element.addClass(stylesDelimiter.delimiter);
      }
    }

    const listBuildings = new SettingsList(host);
    listBuildings.addChildren(this._buildings);
    this.addChild(listBuildings);
  }

  private _getResetOption(
    host: KittenScientists,
    option: SettingTrigger,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: ResetBonfireSettings,
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
