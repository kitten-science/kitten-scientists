import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { MissionSettings } from "../settings/MissionSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { SpaceSettings } from "../settings/SpaceSettings.js";
import type { PanelOptions } from "./components/CollapsiblePanel.js";
import { Container } from "./components/Container.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem, type SettingListItemOptions } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

export class MissionSettingsUi extends SettingsPanel<MissionSettings> {
  private readonly _missions: Array<SettingListItem>;

  constructor(
    host: KittenScientists,
    settings: MissionSettings,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: SpaceSettings,
    options?: Partial<PanelOptions & SettingListItemOptions>,
  ) {
    const label = host.engine.i18n("ui.upgrade.missions");
    super(
      host,
      settings,
      new SettingListItem(host, settings, label, {
        childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
        onCheck: (isBatchProcess?: boolean) => {
          host.engine.imessage("status.auto.enable", [label]);
          this.refreshUi();
          options?.onCheck?.(isBatchProcess);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          host.engine.imessage("status.auto.disable", [label]);
          this.refreshUi();
          options?.onUnCheck?.(isBatchProcess);
        },
        onRefresh: _item => {
          this.expando.ineffective =
            sectionSetting.enabled &&
            settings.enabled &&
            !Object.values(settings.missions).some(mission => mission.enabled);
        },
      }),
      options,
    );

    // Missions should be sorted by KG. For example, when going to the sun just choose the top five Checkbox instead of looking through the list
    this._missions = host.game.space.programs
      .filter(item => !isNil(this.setting.missions[item.name]))
      .map(
        mission =>
          new SettingListItem(host, this.setting.missions[mission.name], mission.label, {
            onCheck: () => {
              host.engine.imessage("status.sub.enable", [mission.label]);
            },
            onUnCheck: () => {
              host.engine.imessage("status.sub.disable", [mission.label]);
            },
          }),
      );

    const itemsList = new SettingsList(host, { children: this._missions });
    this.addChild(itemsList);
  }
}
