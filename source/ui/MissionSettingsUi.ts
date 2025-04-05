import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import type { MissionSettings } from "../settings/MissionSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { SpaceSettings } from "../settings/SpaceSettings.js";
import { Container } from "./components/Container.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";

export class MissionSettingsUi extends SettingsPanel<MissionSettings> {
  private readonly _missions: Array<SettingListItem>;

  constructor(
    parent: UiComponent,
    settings: MissionSettings,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: SpaceSettings,
  ) {
    const label = parent.host.engine.i18n("ui.upgrade.missions");
    super(
      parent,
      settings,
      new SettingListItem(parent, settings, label, {
        onCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.disable", [label]);
        },
        onRefresh: () => {
          this.expando.ineffective =
            sectionSetting.enabled &&
            settings.enabled &&
            !Object.values(settings.missions).some(mission => mission.enabled);
        },
      }).addChildrenHead([new Container(parent, { classes: [stylesLabelListItem.fillSpace] })]),
    );

    // Missions should be sorted by KG. For example, when going to the sun just choose the top five Checkbox instead of looking through the list
    this._missions = this.host.game.space.programs
      .filter(item => !isNil(this.setting.missions[item.name]))
      .map(
        mission =>
          new SettingListItem(this, this.setting.missions[mission.name], mission.label, {
            onCheck: () => {
              this.host.engine.imessage("status.sub.enable", [mission.label]);
            },
            onUnCheck: () => {
              this.host.engine.imessage("status.sub.disable", [mission.label]);
            },
          }),
      );

    const itemsList = new SettingsList(this).addChildren(this._missions);
    this.addChildContent(itemsList);
  }
}
