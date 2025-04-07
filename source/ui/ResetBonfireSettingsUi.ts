import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import { Icons } from "../images/Icons.js";
import type { ResetBonfireSettings } from "../settings/ResetBonfireSettings.js";
import type { SettingOptions, SettingTrigger } from "../settings/Settings.js";
import type { StagedBuilding } from "../types/index.js";
import stylesButton from "./components/Button.module.css";
import stylesDelimiter from "./components/Delimiter.module.css";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import type { UiComponent } from "./components/UiComponent.js";

export class ResetBonfireSettingsUi extends IconSettingsPanel<ResetBonfireSettings> {
  private readonly _buildings: Array<HeaderListItem | SettingTriggerListItem>;

  constructor(
    parent: UiComponent,
    settings: ResetBonfireSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = parent.host.engine.i18n("ui.build");
    super(parent, label, settings, {
      icon: Icons.Bonfire,
      onRefresh: () => {
        this.expando.ineffective =
          settings.enabled &&
          Object.values(settings.buildings).some(_ => _.enabled && _.trigger <= 0);
      },
    });

    this._buildings = [];
    for (const buildingGroup of this.host.game.bld.buildingGroups) {
      this._buildings.push(new HeaderListItem(this, buildingGroup.title));
      for (const building of buildingGroup.buildings) {
        if (building === "unicornPasture" || isNil(this.setting.buildings[building])) {
          continue;
        }

        const meta = this.host.game.bld.getBuildingExt(building).meta;
        if (!isNil(meta.stages)) {
          const name = Object.values(this.setting.buildings).find(
            item => item.baseBuilding === building,
          )?.building as StagedBuilding;
          this._buildings.push(
            this._getResetOption(
              this,
              this.setting.buildings[building],
              locale,
              settings,
              meta.stages[0].label,
            ),
            this._getResetOption(
              this,
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
              this,
              this.setting.buildings[building],
              locale,
              settings,
              meta.label,
            ),
          );
        }
      }

      // Add padding after each group. Except for the last group, which ends the list.
      if (
        buildingGroup !==
        this.host.game.bld.buildingGroups[this.host.game.bld.buildingGroups.length - 1]
      ) {
        this._buildings.at(-1)?.element.addClass(stylesDelimiter.delimiter);
      }
    }

    const listBuildings = new SettingsList(this);
    listBuildings.addChildren(this._buildings);
    this.addChildContent(listBuildings);
  }

  private _getResetOption(
    parent: UiComponent,
    option: SettingTrigger,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: ResetBonfireSettings,
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
