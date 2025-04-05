import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import type { MissionSettings } from "../settings/MissionSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { SpaceSettings } from "../settings/SpaceSettings.js";
import { Container } from "./components/Container.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem, type SettingListItemOptions } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, type SettingsPanelOptions } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";

export class MissionSettingsUi extends SettingsPanel<MissionSettings> {
  private readonly _missions: Array<SettingListItem>;

  constructor(
    parent: UiComponent,
    settings: MissionSettings,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: SpaceSettings,
    options?: SettingsPanelOptions<SettingListItem> & SettingListItemOptions,
  ) {
    const label = parent.host.engine.i18n("ui.upgrade.missions");
    super(
      parent,
      settings,
      new SettingListItem(parent, settings, label, {
        childrenHead: [new Container(parent, { classes: [stylesLabelListItem.fillSpace] })],
        onCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.enable", [label]);
          this.refreshUi();
          options?.onCheck?.(isBatchProcess);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.disable", [label]);
          this.refreshUi();
          options?.onUnCheck?.(isBatchProcess);
        },
        onRefresh: () => {
          this.expando.ineffective =
            sectionSetting.enabled &&
            settings.enabled &&
            !Object.values(settings.missions).some(mission => mission.enabled);
        },
      }),
      options,
    );

    // Missions should be sorted by KG. For example, when going to the sun just choose the top five Checkbox instead of looking through the list
    this._missions = parent.host.game.space.programs
      .filter(item => !isNil(this.setting.missions[item.name]))
      .map(
        mission =>
          new SettingListItem(parent, this.setting.missions[mission.name], mission.label, {
            onCheck: () => {
              parent.host.engine.imessage("status.sub.enable", [mission.label]);
            },
            onUnCheck: () => {
              parent.host.engine.imessage("status.sub.disable", [mission.label]);
            },
          }),
      );

    const itemsList = new SettingsList(parent, { children: this._missions });
    this.addChild(itemsList);
  }
}
